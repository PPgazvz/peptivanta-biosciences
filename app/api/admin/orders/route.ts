import { ensureFulfillmentSchema, getD1 } from "../../../../db";
import { findCatalogVariant } from "../../../../lib/product-catalog.ts";
import {
  calculateOrderPricing,
  orderProfileForQuantity,
} from "../../../../lib/order-pricing.ts";
import { requireFulfillmentAdmin } from "../auth";

const markets = new Set([
  "United States",
  "Canada",
  "Brazil",
  "Mexico",
]);
const services = new Set([
  "catalogue",
  "private_label",
  "bulk",
  "custom",
]);
const statuses = new Set([
  "confirmed",
  "documentation_review",
  "in_production",
  "quality_control",
  "packaging",
  "dispatched",
  "delivered",
]);

type ManualOrderInput = {
  id?: unknown;
  reference?: unknown;
  occurredAt?: unknown;
  destination?: unknown;
  service?: unknown;
  sku?: unknown;
  productName?: unknown;
  specification?: unknown;
  quantityUnits?: unknown;
  serviceFeeUsdCents?: unknown;
  shippingFeeUsdCents?: unknown;
  deductionUsdCents?: unknown;
  status?: unknown;
  isPublished?: unknown;
};

function textField(value: unknown, name: string, maximum: number) {
  if (typeof value !== "string") {
    throw new Error(`${name} is required.`);
  }
  const normalized = value.trim();
  if (!normalized || normalized.length > maximum) {
    throw new Error(`${name} must contain 1-${maximum} characters.`);
  }
  return normalized;
}

function validateDate(value: unknown) {
  const date = textField(value, "Order date", 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Order date must use YYYY-MM-DD.");
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Order date is invalid.");
  }
  return date;
}

function normalizeReference(value: unknown, occurredAt: string) {
  const supplied = typeof value === "string" ? value.trim().toUpperCase() : "";
  if (supplied) {
    if (!/^[A-Z0-9][A-Z0-9-]{4,39}$/.test(supplied)) {
      throw new Error(
        "Reference must contain 5-40 uppercase letters, numbers, or hyphens.",
      );
    }
    return supplied;
  }
  return `PV-R-${occurredAt.replaceAll("-", "")}-${crypto
    .randomUUID()
    .slice(0, 6)
    .toUpperCase()}`;
}

function validateInput(body: ManualOrderInput, includeId: boolean) {
  const occurredAt = validateDate(body.occurredAt);
  const destination = textField(body.destination, "Destination", 40);
  const service = textField(body.service, "Service", 30);
  const status = textField(body.status, "Status", 40);

  if (!markets.has(destination)) throw new Error("Destination is invalid.");
  if (!services.has(service)) throw new Error("Service is invalid.");
  if (!statuses.has(status)) throw new Error("Status is invalid.");

  const quantityUnits = Number(body.quantityUnits);
  if (
    !Number.isSafeInteger(quantityUnits) ||
    quantityUnits < 1 ||
    quantityUnits > 100_000
  ) {
    throw new Error("Quantity must be a whole number between 1 and 100,000.");
  }

  const id = Number(body.id);
  if (includeId && (!Number.isSafeInteger(id) || id < 1)) {
    throw new Error("Order id is invalid.");
  }

  const sku = textField(body.sku, "SKU", 40);
  const productName = textField(body.productName, "Product name", 120);
  const specification = textField(
    body.specification,
    "Specification",
    180,
  );
  const catalogItem = findCatalogVariant(sku, productName, specification);
  if (!catalogItem) {
    throw new Error(
      "The selected product specification does not match the official quote catalogue.",
    );
  }

  const requestedServiceFeeUsdCents = moneyField(
    body.serviceFeeUsdCents,
    "Service/packaging fee",
  );
  const requestedShippingFeeUsdCents = moneyField(
    body.shippingFeeUsdCents,
    "Shipping fee",
  );
  const serviceFeeUsdCents =
    service === "catalogue" ? 0 : requestedServiceFeeUsdCents;
  const shippingFeeUsdCents =
    service === "catalogue" ? 0 : requestedShippingFeeUsdCents;
  const deductionUsdCents = moneyField(
    body.deductionUsdCents,
    "Extra deduction",
  );
  const pricing = calculateOrderPricing({
    retailUnitPriceUsdCents: catalogItem.retailUsdCents,
    quantityUnits,
    service: service as "catalogue" | "private_label" | "bulk" | "custom",
    serviceFeeUsdCents,
    shippingFeeUsdCents,
    deductionUsdCents,
  });
  if (pricing.amountUsdCents < 1) {
    throw new Error("The calculated order total must be greater than US$0.");
  }

  return {
    id,
    reference: normalizeReference(body.reference, occurredAt),
    occurredAt,
    destination,
    service,
    orderProfile: orderProfileForQuantity(quantityUnits),
    sku: catalogItem.sku,
    productName: catalogItem.productName,
    specification: catalogItem.specification,
    quantityUnits,
    retailUnitPriceUsdCents: catalogItem.retailUsdCents,
    discountBps: pricing.discountBps,
    serviceFeeUsdCents,
    shippingFeeUsdCents,
    deductionUsdCents,
    amountUsdCents: pricing.amountUsdCents,
    status,
    isPublished: body.isPublished === false ? 0 : 1,
  };
}

function moneyField(value: unknown, name: string) {
  const amount = Number(value ?? 0);
  if (
    !Number.isSafeInteger(amount) ||
    amount < 0 ||
    amount > 1_000_000_000
  ) {
    throw new Error(`${name} must be between US$0 and US$10,000,000.`);
  }
  return amount;
}

async function readOrders() {
  const d1 = await getD1();
  const result = await d1
    .prepare(
      `SELECT
         id,
         reference,
         occurred_at AS occurredAt,
         destination,
         service,
         order_profile AS orderProfile,
         sku,
         product_name AS productName,
         specification,
         quantity_units AS quantityUnits,
         retail_unit_price_usd_cents AS retailUnitPriceUsdCents,
         discount_bps AS discountBps,
         service_fee_usd_cents AS serviceFeeUsdCents,
         shipping_fee_usd_cents AS shippingFeeUsdCents,
         deduction_usd_cents AS deductionUsdCents,
         amount_usd_cents AS amountUsdCents,
         status,
         is_published AS isPublished,
         created_at AS createdAt,
         updated_at AS updatedAt
       FROM manual_fulfillment_orders
       ORDER BY occurred_at DESC, id DESC
       LIMIT 200`,
    )
    .all();
  return result.results;
}

export async function GET(request: Request) {
  const unauthorized = await requireFulfillmentAdmin(request);
  if (unauthorized) return unauthorized;

  await ensureFulfillmentSchema();
  return Response.json(
    { orders: await readOrders() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const unauthorized = await requireFulfillmentAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await ensureFulfillmentSchema();
    const order = validateInput(
      (await request.json()) as ManualOrderInput,
      false,
    );
    const d1 = await getD1();
    await d1
      .prepare(
        `INSERT INTO manual_fulfillment_orders (
           reference,
           occurred_at,
           destination,
           service,
           order_profile,
           sku,
           product_name,
           specification,
           quantity_units,
           retail_unit_price_usd_cents,
           discount_bps,
           service_fee_usd_cents,
           shipping_fee_usd_cents,
           deduction_usd_cents,
           amount_usd_cents,
           status,
           is_published,
           updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      )
      .bind(
        order.reference,
        order.occurredAt,
        order.destination,
        order.service,
        order.orderProfile,
        order.sku,
        order.productName,
        order.specification,
        order.quantityUnits,
        order.retailUnitPriceUsdCents,
        order.discountBps,
        order.serviceFeeUsdCents,
        order.shippingFeeUsdCents,
        order.deductionUsdCents,
        order.amountUsdCents,
        order.status,
        order.isPublished,
      )
      .run();

    return Response.json(
      { ok: true, orders: await readOrders() },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create order.";
    const status = /UNIQUE constraint failed/i.test(message) ? 409 : 400;
    return Response.json(
      { error: status === 409 ? "That order reference already exists." : message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireFulfillmentAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await ensureFulfillmentSchema();
    const order = validateInput(
      (await request.json()) as ManualOrderInput,
      true,
    );
    const d1 = await getD1();
    const result = await d1
      .prepare(
        `UPDATE manual_fulfillment_orders SET
           reference = ?,
           occurred_at = ?,
           destination = ?,
           service = ?,
           order_profile = ?,
           sku = ?,
           product_name = ?,
           specification = ?,
           quantity_units = ?,
           retail_unit_price_usd_cents = ?,
           discount_bps = ?,
           service_fee_usd_cents = ?,
           shipping_fee_usd_cents = ?,
           deduction_usd_cents = ?,
           amount_usd_cents = ?,
           status = ?,
           is_published = ?,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(
        order.reference,
        order.occurredAt,
        order.destination,
        order.service,
        order.orderProfile,
        order.sku,
        order.productName,
        order.specification,
        order.quantityUnits,
        order.retailUnitPriceUsdCents,
        order.discountBps,
        order.serviceFeeUsdCents,
        order.shippingFeeUsdCents,
        order.deductionUsdCents,
        order.amountUsdCents,
        order.status,
        order.isPublished,
        order.id,
      )
      .run();

    if (!result.meta.changes) {
      return Response.json(
        { error: "Order not found." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(
      { ok: true, orders: await readOrders() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update order.";
    const status = /UNIQUE constraint failed/i.test(message) ? 409 : 400;
    return Response.json(
      { error: status === 409 ? "That order reference already exists." : message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
