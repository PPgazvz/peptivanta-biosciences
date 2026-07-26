import { and, desc, eq, gte } from "drizzle-orm";
import { ensureFulfillmentSchema, getDb } from "../../../db";
import { fulfillmentCases } from "../../../db/schema";

const DISPLAY_LIMIT = 100;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function threeMonthsAgo(now: Date) {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 3);
  return isoDate(cutoff);
}

function createIllustrativeRows(count: number, now: Date) {
  const destinations = ["United States", "Canada", "Brazil"] as const;
  const services = ["catalogue", "private_label", "bulk", "custom"] as const;
  const orderProfiles = [
    "Pilot order",
    "10–50 kits",
    "50–100 kits",
    "Bulk specification",
    "Packaging project",
  ] as const;
  const statuses = ["completed", "dispatched", "in_production"] as const;
  const requestKey = Date.now().toString(36).toUpperCase();

  return Array.from({ length: count }, (_, index) => {
    const occurredAt = new Date(now);
    occurredAt.setUTCDate(occurredAt.getUTCDate() - (index % 88));
    const dateKey = isoDate(occurredAt).replaceAll("-", "");

    return {
      reference: `PV-DEMO-${dateKey}-${requestKey}-${String(index + 1).padStart(3, "0")}`,
      occurredAt: isoDate(occurredAt),
      destination: destinations[index % destinations.length],
      service: services[index % services.length],
      orderProfile: orderProfiles[index % orderProfiles.length],
      status: statuses[index % statuses.length],
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
    let rows = await db
      .select()
      .from(fulfillmentCases)
      .where(
        and(
          eq(fulfillmentCases.isPublished, true),
          gte(fulfillmentCases.occurredAt, windowStart),
        ),
      )
      .orderBy(desc(fulfillmentCases.occurredAt), desc(fulfillmentCases.id))
      .limit(DISPLAY_LIMIT);

    const hasVerifiedRows = rows.some((row) => !row.isSample);
    if (!hasVerifiedRows && rows.length < DISPLAY_LIMIT) {
      const illustrativeRows = createIllustrativeRows(DISPLAY_LIMIT - rows.length, now);
      for (let index = 0; index < illustrativeRows.length; index += 10) {
        await db.insert(fulfillmentCases).values(illustrativeRows.slice(index, index + 10));
      }
      rows = await db
        .select()
        .from(fulfillmentCases)
        .where(
          and(
            eq(fulfillmentCases.isPublished, true),
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
      generatedAt: now.toISOString(),
      includesIllustrativeData: rows.some((row) => row.isSample),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load fulfillment records.";
    return Response.json({ error: message }, { status: 500 });
  }
}
