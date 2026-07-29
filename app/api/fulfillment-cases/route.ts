import { and, desc, eq, gte } from "drizzle-orm";
import { ensureFulfillmentSchema, getD1, getDb } from "../../../db";
import {
  fulfillmentCases,
  manualFulfillmentOrders,
} from "../../../db/schema";
import {
  createBackfillRows,
  createDailyRows,
  currentFulfillmentStatus,
  DISPLAY_LIMIT,
  LEDGER_VERSION,
  UPDATE_INTERVAL_DAYS,
  type FulfillmentMarket,
  type FulfillmentService,
  type GenerationContext,
  type GeneratedFulfillmentRow,
} from "./generator";
import { findCatalogVariantByDescription } from "../../../lib/product-catalog.ts";
import { volumeDiscountBps } from "../../../lib/order-pricing.ts";

const RESET_MARKER_KEY = `${LEDGER_VERSION}:history-cleared`;
const LAST_GENERATED_KEY = `${LEDGER_VERSION}:last-generated-date`;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date: Date) {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

function addUtcDays(date: Date, days: number) {
  const result = startOfUtcDay(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function threeMonthsAgo(now: Date) {
  const cutoff = startOfUtcDay(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 3);
  return isoDate(cutoff);
}

async function getMeta(key: string) {
  const d1 = await getD1();
  const result = await d1
    .prepare("SELECT value FROM fulfillment_ledger_meta WHERE key = ?")
    .bind(key)
    .first<{ value: string }>();
  return result?.value ?? null;
}

async function setMeta(key: string, value: string) {
  const d1 = await getD1();
  await d1
    .prepare(
      `INSERT INTO fulfillment_ledger_meta (key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(key, value)
    .run();
}

/**
 * A generator-version change may replace old illustrative rows once. Manual
 * orders live in their own table and are never touched by this reset.
 */
async function clearPreviousHistoryOnce() {
  const d1 = await getD1();
  const marker = await getMeta(RESET_MARKER_KEY);
  if (marker === "done") return;

  await d1.batch([
    d1.prepare("DELETE FROM fulfillment_cases WHERE is_sample = 1"),
    d1.prepare(
      "DELETE FROM fulfillment_ledger_meta WHERE key LIKE 'daily-%'",
    ),
    d1
      .prepare(
        `INSERT INTO fulfillment_ledger_meta (key, value, updated_at)
         VALUES (?, 'done', CURRENT_TIMESTAMP)`,
      )
      .bind(RESET_MARKER_KEY),
  ]);
}

async function insertRows(rows: GeneratedFulfillmentRow[]) {
  if (rows.length === 0) return;
  const db = await getDb();
  for (let index = 0; index < rows.length; index += 5) {
    await db
      .insert(fulfillmentCases)
      .values(rows.slice(index, index + 5))
      .onConflictDoNothing();
  }
}

async function generationContext(): Promise<GenerationContext> {
  const db = await getDb();
  const recentBulk = await db
    .select({
      occurredAt: fulfillmentCases.occurredAt,
      orderProfile: fulfillmentCases.orderProfile,
    })
    .from(fulfillmentCases)
    .where(
      and(
        eq(fulfillmentCases.isSample, true),
        eq(fulfillmentCases.service, "bulk"),
      ),
    )
    .orderBy(desc(fulfillmentCases.occurredAt))
    .limit(40);

  return {
    lastBulkAt: recentBulk[0]?.occurredAt ?? null,
    lastMegaBulkAt:
      recentBulk.find((row) => row.orderProfile === "3,000+ kits")
        ?.occurredAt ?? null,
  };
}

async function advanceDailyLedger(now: Date) {
  const today = startOfUtcDay(now);
  const db = await getDb();
  const countResult = await db
    .select({ id: fulfillmentCases.id })
    .from(fulfillmentCases)
    .where(eq(fulfillmentCases.isSample, true))
    .limit(1);
  let lastGenerated = await getMeta(LAST_GENERATED_KEY);

  if (countResult.length === 0 || !lastGenerated) {
    await insertRows(createBackfillRows(DISPLAY_LIMIT, today));
    lastGenerated = isoDate(today);
    await setMeta(LAST_GENERATED_KEY, lastGenerated);
    return lastGenerated;
  }

  let context = await generationContext();
  let cursor = addUtcDays(
    new Date(`${lastGenerated}T00:00:00.000Z`),
    1,
  );

  while (cursor.getTime() <= today.getTime()) {
    const result = createDailyRows(cursor, context);
    await insertRows(result.rows);
    context = result.context;
    lastGenerated = isoDate(cursor);
    cursor = addUtcDays(cursor, 1);
  }

  await setMeta(LAST_GENERATED_KEY, lastGenerated);
  return lastGenerated;
}

export async function GET() {
  try {
    await ensureFulfillmentSchema();
    await clearPreviousHistoryOnce();

    const now = new Date();
    const windowStart = threeMonthsAgo(now);
    const generatedAt = await advanceDailyLedger(now);
    const d1 = await getD1();
    await d1
      .prepare(
        "DELETE FROM fulfillment_cases WHERE is_sample = 1 AND occurred_at < ?",
      )
      .bind(windowStart)
      .run();

    const db = await getDb();
    const sampleRows = await db
      .select()
      .from(fulfillmentCases)
      .where(
        and(
          eq(fulfillmentCases.isSample, true),
          eq(fulfillmentCases.isPublished, true),
          gte(fulfillmentCases.occurredAt, windowStart),
        ),
      )
      .orderBy(
        desc(fulfillmentCases.occurredAt),
        desc(fulfillmentCases.id),
      )
      .limit(DISPLAY_LIMIT);

    const manualRows = await db
      .select()
      .from(manualFulfillmentOrders)
      .where(eq(manualFulfillmentOrders.isPublished, true))
      .orderBy(
        desc(manualFulfillmentOrders.occurredAt),
        desc(manualFulfillmentOrders.id),
      )
      .limit(DISPLAY_LIMIT);

    const sampleRecords = sampleRows.map((row) => {
      const { quantityUnits, ...publicRow } = row;
      const catalogItem = findCatalogVariantByDescription(
        row.productName,
        row.specification,
      );
      const discountBps =
        row.service === "custom" ? 0 : volumeDiscountBps(quantityUnits);
      return {
        ...publicRow,
        id: `sample-${row.id}`,
        source: "sample" as const,
        retailUnitPriceUsdCents:
          catalogItem?.retailUsdCents ?? row.unitPriceUsdCents,
        discountBps,
        status: currentFulfillmentStatus(
          {
            occurredAt: row.occurredAt,
            destination: row.destination as FulfillmentMarket,
            service: row.service as FulfillmentService,
            quantityUnits,
          },
          now,
        ),
      };
    });

    const manualRecords = manualRows.map((row) => ({
      id: `manual-${row.id}`,
      reference: row.reference,
      occurredAt: row.occurredAt,
      destination: row.destination,
      service: row.service,
      orderProfile: row.orderProfile,
      productName: row.productName,
      specification: row.specification,
      unitPriceUsdCents: Math.round(
        (row.retailUnitPriceUsdCents * (10_000 - row.discountBps)) / 10_000,
      ),
      retailUnitPriceUsdCents: row.retailUnitPriceUsdCents,
      discountBps: row.discountBps,
      packagingFeeUsdCents: row.serviceFeeUsdCents,
      testingFeeUsdCents: 0,
      logisticsFeeUsdCents: row.shippingFeeUsdCents,
      amountUsdCents: row.amountUsdCents,
      status: row.status,
      isSample: false,
      isPublished: row.isPublished,
      createdAt: row.createdAt,
      source: "manual" as const,
    }));

    const records = [...manualRecords, ...sampleRecords]
      .sort((left, right) => {
        const dateDelta = right.occurredAt.localeCompare(left.occurredAt);
        if (dateDelta !== 0) return dateDelta;
        return right.createdAt.localeCompare(left.createdAt);
      })
      .slice(0, DISPLAY_LIMIT);
    const nextUpdateAt = addUtcDays(startOfUtcDay(now), 1);

    return Response.json(
      {
        records,
        count: records.length,
        limit: DISPLAY_LIMIT,
        windowStart,
        generatedAt: `${generatedAt}T00:00:00.000Z`,
        nextUpdateAt: nextUpdateAt.toISOString(),
        updateIntervalDays: UPDATE_INTERVAL_DAYS,
        realOrderCount: records.filter((record) => !record.isSample).length,
        dataMode: "mixed_workflow",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "CDN-Cache-Control": "no-store",
          "Cloudflare-CDN-Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load fulfillment records.";
    return Response.json(
      { error: message },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
