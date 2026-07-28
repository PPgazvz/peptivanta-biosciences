import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const fulfillmentCases = sqliteTable(
  "fulfillment_cases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reference: text("reference").notNull().unique(),
    occurredAt: text("occurred_at").notNull(),
    destination: text("destination").notNull(),
    service: text("service").notNull(),
    orderProfile: text("order_profile").notNull(),
    productName: text("product_name").notNull().default(""),
    specification: text("specification").notNull().default(""),
    quantityUnits: integer("quantity_units").notNull().default(0),
    unitPriceUsdCents: integer("unit_price_usd_cents").notNull().default(0),
    packagingFeeUsdCents: integer("packaging_fee_usd_cents")
      .notNull()
      .default(0),
    testingFeeUsdCents: integer("testing_fee_usd_cents")
      .notNull()
      .default(0),
    logisticsFeeUsdCents: integer("logistics_fee_usd_cents")
      .notNull()
      .default(0),
    amountUsdCents: integer("amount_usd_cents").notNull().default(0),
    status: text("status").notNull(),
    cycleKey: text("cycle_key").notNull().default("legacy"),
    isSample: integer("is_sample", { mode: "boolean" })
      .notNull()
      .default(true),
    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("fulfillment_cases_occurred_at_idx").on(table.occurredAt),
    index("fulfillment_cases_cycle_key_idx").on(table.cycleKey),
    index("fulfillment_cases_published_idx").on(table.isPublished),
    index("fulfillment_cases_service_occurred_at_idx").on(
      table.service,
      table.occurredAt,
    ),
  ],
);

export const fulfillmentLedgerMeta = sqliteTable(
  "fulfillment_ledger_meta",
  {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
);
