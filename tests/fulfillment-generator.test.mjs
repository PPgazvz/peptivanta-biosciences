import assert from "node:assert/strict";
import test from "node:test";

import {
  createWeeklyRows,
  currentFulfillmentStatus,
  fulfillmentStatus,
  GENERATOR_VERSION,
  SERVICE_PROFILES,
} from "../app/api/fulfillment-cases/generator.ts";

const cycleStart = new Date("2026-07-27T00:00:00.000Z");

test("bulk supply always uses a genuine bulk quantity and value", () => {
  const rows = createWeeklyRows(500, cycleStart, `2026-07-27-v${GENERATOR_VERSION}`);
  const bulkRows = rows.filter((row) => row.service === "bulk");
  const bulkLabels = new Set(SERVICE_PROFILES.bulk.map((profile) => profile.label));

  assert.ok(bulkRows.length > 0);
  for (const row of bulkRows) {
    assert.ok(bulkLabels.has(row.orderProfile));
    assert.ok(row.amountUsdCents >= 3_500_000);
    assert.notEqual(row.orderProfile, "10–50 kits");
    assert.notEqual(row.orderProfile, "50–100 kits");
  }
});

test("weekly generation is deterministic and stable", () => {
  const first = createWeeklyRows(100, cycleStart, `2026-07-27-v${GENERATOR_VERSION}`);
  const second = createWeeklyRows(100, cycleStart, `2026-07-27-v${GENERATOR_VERSION}`);
  assert.deepEqual(first, second);
});

test("records leave production on a credible schedule", () => {
  const status = (date, service, orderProfile, draw = 0.99) =>
    fulfillmentStatus({
      occurredAt: new Date(`${date}T00:00:00.000Z`),
      service,
      orderProfile,
      cycleStart,
      random: () => draw,
    });

  assert.equal(status("2026-07-16", "bulk", "500–1,000 kits"), "completed");
  assert.equal(status("2026-07-23", "bulk", "500–1,000 kits"), "dispatched");
  assert.equal(status("2026-07-16", "bulk", "1,000–3,000 kits"), "dispatched");
  assert.equal(status("2026-07-20", "bulk", "3,000+ kits"), "dispatched");
  assert.equal(status("2026-07-21", "bulk", "3,000+ kits"), "dispatched");
  assert.equal(status("2026-07-13", "bulk", "3,000+ kits"), "completed");
  assert.equal(status("2026-07-21", "catalogue", "50–100 kits"), "completed");
  assert.notEqual(status("2026-07-23", "private_label", "100–300 kits"), "in_production");
});

test("stored rows advance with elapsed time without changing order data", () => {
  const base = {
    occurredAt: new Date("2026-07-22T00:00:00.000Z"),
    service: "bulk",
    orderProfile: "3,000+ kits",
    storedStatus: "in_production",
  };

  assert.equal(
    currentFulfillmentStatus({
      ...base,
      asOf: new Date("2026-07-27T00:00:00.000Z"),
    }),
    "in_production",
  );
  assert.equal(
    currentFulfillmentStatus({
      ...base,
      asOf: new Date("2026-07-28T00:00:00.000Z"),
    }),
    "dispatched",
  );
  assert.equal(
    currentFulfillmentStatus({
      ...base,
      asOf: new Date("2026-08-05T00:00:00.000Z"),
    }),
    "completed",
  );
});
