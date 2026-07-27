import { and, desc, eq, gte } from "drizzle-orm";
import { ensureFulfillmentSchema, getDb } from "../../../db";
import { fulfillmentCases } from "../../../db/schema";
import {
  createWeeklyRows,
  currentFulfillmentStatus,
  GENERATOR_VERSION,
  type FulfillmentService,
  type FulfillmentStatus,
} from "./generator";

const DISPLAY_LIMIT = 100;
const UPDATE_INTERVAL_DAYS = 7;
const UPDATE_INTERVAL_MS = UPDATE_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function threeMonthsAgo(now: Date) {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 3);
  return isoDate(cutoff);
}

function weeklyCycle(now: Date) {
  const start = new Date(now);
  const daysSinceMonday = (start.getUTCDay() + 6) % 7;
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  start.setUTCHours(0, 0, 0, 0);
  const next = new Date(start.getTime() + UPDATE_INTERVAL_MS);

  return {
    cycleKey: `${isoDate(start)}-v${GENERATOR_VERSION}`,
    cycleStart: start,
    nextUpdateAt: next,
  };
}

export async function GET() {
  try {
    await ensureFulfillmentSchema();
    const db = await getDb();
    const now = new Date();
    const windowStart = threeMonthsAgo(now);
    const { cycleKey, cycleStart, nextUpdateAt } = weeklyCycle(now);
    let rows = await db
      .select()
      .from(fulfillmentCases)
      .where(
        and(
          eq(fulfillmentCases.isPublished, true),
          eq(fulfillmentCases.cycleKey, cycleKey),
          gte(fulfillmentCases.occurredAt, windowStart),
        ),
      )
      .orderBy(desc(fulfillmentCases.occurredAt), desc(fulfillmentCases.id))
      .limit(DISPLAY_LIMIT);

    if (rows.length < DISPLAY_LIMIT) {
      const weeklyRows = createWeeklyRows(DISPLAY_LIMIT, cycleStart, cycleKey);
      for (let index = 0; index < weeklyRows.length; index += 10) {
        await db
          .insert(fulfillmentCases)
          .values(weeklyRows.slice(index, index + 10))
          .onConflictDoNothing();
      }
      rows = await db
        .select()
        .from(fulfillmentCases)
        .where(
          and(
            eq(fulfillmentCases.isPublished, true),
            eq(fulfillmentCases.cycleKey, cycleKey),
            gte(fulfillmentCases.occurredAt, windowStart),
          ),
        )
        .orderBy(desc(fulfillmentCases.occurredAt), desc(fulfillmentCases.id))
        .limit(DISPLAY_LIMIT);
    }

    const records = rows.map((row) => ({
      ...row,
      status: currentFulfillmentStatus({
        occurredAt: new Date(`${row.occurredAt}T00:00:00.000Z`),
        service: row.service as FulfillmentService,
        orderProfile: row.orderProfile,
        storedStatus: row.status as FulfillmentStatus,
        asOf: now,
      }),
    }));

    return Response.json({
      records,
      count: rows.length,
      limit: DISPLAY_LIMIT,
      windowStart,
      generatedAt: cycleStart.toISOString(),
      nextUpdateAt: nextUpdateAt.toISOString(),
      updateIntervalDays: UPDATE_INTERVAL_DAYS,
      dataMode: "synthetic_sample",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load fulfillment records.";
    return Response.json({ error: message }, { status: 500 });
  }
}
