import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

async function getD1Binding() {
  const { env } = await import("cloudflare:workers");

  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return env.DB;
}

export async function getDb() {
  return drizzle(await getD1Binding(), { schema });
}

export async function ensureFulfillmentSchema() {
  const d1 = await getD1Binding();
  await d1.batch([
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS fulfillment_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        reference TEXT NOT NULL UNIQUE,
        occurred_at TEXT NOT NULL,
        destination TEXT NOT NULL,
        service TEXT NOT NULL,
        order_profile TEXT NOT NULL,
        status TEXT NOT NULL,
        is_sample INTEGER DEFAULT 1 NOT NULL,
        is_published INTEGER DEFAULT 1 NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `),
    d1.prepare(
      "CREATE INDEX IF NOT EXISTS fulfillment_cases_occurred_at_idx ON fulfillment_cases (occurred_at)",
    ),
    d1.prepare(
      "CREATE INDEX IF NOT EXISTS fulfillment_cases_published_idx ON fulfillment_cases (is_published)",
    ),
  ]);
}
