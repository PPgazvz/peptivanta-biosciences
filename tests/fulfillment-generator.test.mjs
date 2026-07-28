import assert from "node:assert/strict";
import test from "node:test";

import {
  createBackfillRows,
  createDailyRows,
  currentFulfillmentStatus,
  DISPLAY_LIMIT,
  LEDGER_VERSION,
  UPDATE_INTERVAL_DAYS,
} from "../app/api/fulfillment-cases/generator.ts";

const asOf = new Date("2026-07-28T00:00:00.000Z");

test("daily ledger backfill is deterministic and limited to 100 records", () => {
  const first = createBackfillRows(DISPLAY_LIMIT, asOf);
  const second = createBackfillRows(DISPLAY_LIMIT, asOf);

  assert.equal(LEDGER_VERSION, "daily-v1");
  assert.equal(UPDATE_INTERVAL_DAYS, 1);
  assert.equal(first.length, 100);
  assert.deepEqual(first, second);
  assert.ok(first.every((row) => row.occurredAt >= "2026-04-28"));
});

test("service, size, and market weights resemble a catalogue-led business", () => {
  const rows = createBackfillRows(100, asOf);
  const serviceCount = Object.fromEntries(
    ["catalogue", "private_label", "bulk", "custom"].map((service) => [
      service,
      rows.filter((row) => row.service === service).length,
    ]),
  );
  const marketCount = Object.fromEntries(
    ["United States", "Canada", "Brazil", "Mexico"].map((market) => [
      market,
      rows.filter((row) => row.destination === market).length,
    ]),
  );
  const smallOrders = rows.filter((row) => row.quantityUnits <= 50);
  const megaBulk = rows.filter(
    (row) => row.service === "bulk" && row.orderProfile === "3,000+ kits",
  );

  assert.ok(serviceCount.catalogue >= 55, serviceCount);
  assert.ok(serviceCount.bulk <= 8, serviceCount);
  assert.ok(smallOrders.length >= 45);
  assert.ok(megaBulk.length <= 2);
  assert.ok(marketCount["United States"] > marketCount.Canada, marketCount);
  assert.ok(marketCount.Canada > marketCount.Mexico, marketCount);
  assert.ok(marketCount.Brazil > 0);
  assert.ok(marketCount.Mexico > 0);
});

test("bulk orders are separated and weekend orders stay exceptional", () => {
  const rows = createBackfillRows(100, asOf);
  const bulkRows = rows
    .filter((row) => row.service === "bulk")
    .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt));
  const weekendRows = rows.filter((row) => {
    const day = new Date(`${row.occurredAt}T00:00:00.000Z`).getUTCDay();
    return day === 0 || day === 6;
  });

  for (let index = 1; index < bulkRows.length; index += 1) {
    const gap =
      (Date.parse(`${bulkRows[index].occurredAt}T00:00:00.000Z`) -
        Date.parse(`${bulkRows[index - 1].occurredAt}T00:00:00.000Z`)) /
      86_400_000;
    assert.ok(gap >= 9, `bulk gap was ${gap} days`);
  }
  assert.ok(weekendRows.length <= 5);
});

test("amounts are derived from quantity, unit price, and named fees", () => {
  const rows = createBackfillRows(100, asOf);
  let nonRoundedAmounts = 0;

  for (const row of rows) {
    const expected =
      row.quantityUnits * row.unitPriceUsdCents +
      row.packagingFeeUsdCents +
      row.testingFeeUsdCents +
      row.logisticsFeeUsdCents;
    assert.equal(row.amountUsdCents, expected);
    assert.ok(row.productName.length > 0);
    assert.ok(row.specification.length > 0);
    if (row.amountUsdCents % 1000 !== 0) nonRoundedAmounts += 1;
  }

  assert.ok(nonRoundedAmounts >= 80);
});

test("new orders cannot skip ahead and statuses advance by business day", () => {
  const record = {
    occurredAt: "2026-07-06",
    destination: "United States",
    service: "catalogue",
    quantityUnits: 24,
  };
  const order = [
    "confirmed",
    "documentation_review",
    "in_production",
    "quality_control",
    "packaging",
    "dispatched",
    "delivered",
  ];
  const seen = new Set();
  let previousRank = -1;

  for (let offset = 0; offset <= 30; offset += 1) {
    const date = new Date("2026-07-06T00:00:00.000Z");
    date.setUTCDate(date.getUTCDate() + offset);
    const status = currentFulfillmentStatus(record, date);
    const rank = order.indexOf(status);
    assert.ok(rank >= previousRank, `${status} regressed on day ${offset}`);
    seen.add(status);
    previousRank = rank;
  }

  assert.equal(currentFulfillmentStatus(record, new Date("2026-07-06")), "confirmed");
  assert.equal(
    currentFulfillmentStatus(record, new Date("2026-07-07")),
    "documentation_review",
  );
  assert.ok(seen.has("quality_control"));
  assert.ok(seen.has("packaging"));
  assert.ok(seen.has("dispatched"));
  assert.ok(seen.has("delivered"));
});

test("large private-label and bulk projects retain realistic production time", () => {
  const privateLabel = {
    occurredAt: "2026-07-06",
    destination: "Canada",
    service: "private_label",
    quantityUnits: 480,
  };
  const bulk = {
    occurredAt: "2026-07-06",
    destination: "Brazil",
    service: "bulk",
    quantityUnits: 3600,
  };

  assert.equal(
    currentFulfillmentStatus(privateLabel, new Date("2026-07-20")),
    "in_production",
  );
  assert.equal(
    currentFulfillmentStatus(bulk, new Date("2026-07-27")),
    "in_production",
  );
  assert.notEqual(
    currentFulfillmentStatus(bulk, new Date("2026-09-30")),
    "in_production",
  );
});

test("daily generation is stable and can produce a quiet day", () => {
  const first = createDailyRows(new Date("2026-07-28T00:00:00.000Z"));
  const second = createDailyRows(new Date("2026-07-28T00:00:00.000Z"));
  assert.deepEqual(first, second);

  const weekend = createDailyRows(new Date("2026-07-26T00:00:00.000Z"));
  assert.ok(weekend.rows.length <= 1);
});
