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
    amountUsdCents: integer("amount_usd_cents").notNull().default(0),
    status: text("status").notNull(),
    cycleKey: text("cycle_key").notNull().default("legacy"),
    isSample: integer("is_sample", { mode: "boolean" }).notNull().default(true),
    isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("fulfillment_cases_occurred_at_idx").on(table.occurredAt),
    index("fulfillment_cases_cycle_key_idx").on(table.cycleKey),
    index("fulfillment_cases_published_idx").on(table.isPublished),
  ],
);
