import { and, desc, eq, gte } from "drizzle-orm";
import { ensureFulfillmentSchema, getDb } from "../../../db";
import { fulfillmentCases } from "../../../db/schema";

const DISPLAY_LIMIT = 100;
const UPDATE_INTERVAL_DAYS = 7;
const UPDATE_INTERVAL_MS = UPDATE_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
const GENERATOR_VERSION = 2;

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

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createWeeklyRows(count: number, cycleStart: Date, cycleKey: string) {
  const destinations = ["United States", "Canada", "Brazil"] as const;
  const services = ["catalogue", "private_label", "bulk", "custom"] as const;
  const orderProfiles = [
    { label: "Pilot order", minimum: 1200, maximum: 8500 },
    { label: "10–50 kits", minimum: 2500, maximum: 12000 },
    { label: "50–100 kits", minimum: 7000, maximum: 25000 },
    { label: "Bulk specification", minimum: 15000, maximum: 75000 },
    { label: "Packaging project", minimum: 8000, maximum: 40000 },
  ] as const;
  const statuses = ["completed", "dispatched", "in_production"] as const;
  const random = createSeededRandom(hashSeed(`peptivanta-${cycleKey}`));

  return Array.from({ length: count }, (_, index) => {
    const occurredAt = new Date(cycleStart);
    occurredAt.setUTCDate(occurredAt.getUTCDate() - Math.floor(random() * 83));
    const dateKey = isoDate(occurredAt).replaceAll("-", "");
    const destination = destinations[Math.floor(random() * destinations.length)];
    const service = services[Math.floor(random() * services.length)];
    const profile = orderProfiles[Math.floor(random() * orderProfiles.length)];
    const status = statuses[Math.floor(random() * statuses.length)];
    const amountUsd = Math.round(
      (profile.minimum + random() * (profile.maximum - profile.minimum)) / 10,
    ) * 10;

    return {
      reference: `PV-${cycleKey.replaceAll("-", "")}-${dateKey}-${String(index + 1).padStart(3, "0")}`,
      occurredAt: isoDate(occurredAt),
      destination,
      service,
      orderProfile: profile.label,
      amountUsdCents: amountUsd * 100,
      status,
      cycleKey,
      isSample: true,
      isPublished: true,
    };
  });
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

    return Response.json({
      records: rows,
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
