export const GENERATOR_VERSION = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

export type FulfillmentService = "catalogue" | "private_label" | "bulk" | "custom";
export type FulfillmentStatus = "completed" | "dispatched" | "in_production";

type OrderProfile = {
  label: string;
  minimum: number;
  maximum: number;
};

/**
 * Quantity and value bands are tied to the selected service.
 *
 * Keeping these profiles service-specific prevents combinations such as
 * "Bulk supply / 10–50 kits". Bulk supply always starts at 500 kits, while
 * catalogue and custom work may use smaller commercial or pilot quantities.
 */
export const SERVICE_PROFILES = {
  catalogue: [
    { label: "10–50 kits", minimum: 2500, maximum: 12000 },
    { label: "50–100 kits", minimum: 7000, maximum: 25000 },
  ],
  private_label: [
    { label: "100–300 kits", minimum: 15000, maximum: 45000 },
    { label: "300–500 kits", minimum: 25000, maximum: 70000 },
    { label: "500–1,000 kits", minimum: 40000, maximum: 110000 },
  ],
  bulk: [
    { label: "500–1,000 kits", minimum: 35000, maximum: 95000 },
    { label: "1,000–3,000 kits", minimum: 80000, maximum: 230000 },
    { label: "3,000+ kits", minimum: 180000, maximum: 480000 },
  ],
  custom: [
    { label: "Pilot order", minimum: 4000, maximum: 15000 },
    { label: "10–50 kits", minimum: 10000, maximum: 28000 },
    { label: "50–100 kits", minimum: 18000, maximum: 52000 },
    { label: "100–300 kits", minimum: 40000, maximum: 100000 },
  ],
} as const satisfies Record<FulfillmentService, readonly OrderProfile[]>;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
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

/**
 * Resolve a weekly snapshot status from age and genuine order scale.
 *
 * Normal orders leave production after 3–4 days. Bulk orders use scale-aware
 * thresholds, and even the 3,000+ tier leaves production by day six.
 */
function requiredStatusForAge(
  ageDays: number,
  service: FulfillmentService,
  orderProfile: string,
): FulfillmentStatus | null {
  if (service === "bulk" && orderProfile === "3,000+ kits") {
    if (ageDays >= 14) return "completed";
    if (ageDays >= 6) return "dispatched";
    return null;
  }

  if (service === "bulk" && orderProfile === "1,000–3,000 kits") {
    if (ageDays >= 12) return "completed";
    if (ageDays >= 5) return "dispatched";
    return null;
  }

  if (service === "bulk") {
    if (ageDays >= 9) return "completed";
    if (ageDays >= 4) return "dispatched";
    return null;
  }

  if (service === "private_label" || service === "custom") {
    if (ageDays >= 8) return "completed";
    if (ageDays >= 4) return "dispatched";
    return null;
  }

  if (ageDays >= 6) return "completed";
  if (ageDays >= 3) return "dispatched";
  return null;
}

export function fulfillmentStatus({
  occurredAt,
  service,
  orderProfile,
  cycleStart,
  random,
}: {
  occurredAt: Date;
  service: FulfillmentService;
  orderProfile: string;
  cycleStart: Date;
  random: () => number;
}): FulfillmentStatus {
  const ageAtSnapshotDays = Math.max(
    0,
    Math.floor((cycleStart.getTime() - occurredAt.getTime()) / DAY_MS),
  );
  const draw = random();
  const requiredStatus = requiredStatusForAge(
    ageAtSnapshotDays,
    service,
    orderProfile,
  );

  if (requiredStatus) {
    return requiredStatus;
  }

  if (service === "bulk" && orderProfile === "3,000+ kits") {
    if (draw < 0.08) return "completed";
    if (draw < 0.28) return "dispatched";
    return "in_production";
  }

  if (service === "bulk") {
    if (draw < 0.12) return "completed";
    if (draw < 0.38) return "dispatched";
    return "in_production";
  }

  if (service === "private_label" || service === "custom") {
    if (draw < 0.08) return "completed";
    if (draw < 0.42) return "dispatched";
    return "in_production";
  }

  if (draw < 0.15) return "completed";
  if (draw < 0.65) return "dispatched";
  return "in_production";
}

/**
 * Keep the generated order stable for seven days while allowing its visible
 * fulfillment state to advance with real elapsed time. The state can only move
 * forward: production -> dispatched -> completed.
 */
export function currentFulfillmentStatus({
  occurredAt,
  service,
  orderProfile,
  storedStatus,
  asOf,
}: {
  occurredAt: Date;
  service: FulfillmentService;
  orderProfile: string;
  storedStatus: FulfillmentStatus;
  asOf: Date;
}): FulfillmentStatus {
  const ageDays = Math.max(
    0,
    Math.floor((asOf.getTime() - occurredAt.getTime()) / DAY_MS),
  );
  const requiredStatus = requiredStatusForAge(ageDays, service, orderProfile);

  if (requiredStatus === "completed") return "completed";
  if (requiredStatus === "dispatched" && storedStatus === "in_production") {
    return "dispatched";
  }
  return storedStatus;
}

export function createWeeklyRows(count: number, cycleStart: Date, cycleKey: string) {
  const destinations = ["United States", "Canada", "Brazil"] as const;
  const services = ["catalogue", "private_label", "bulk", "custom"] as const;
  const random = createSeededRandom(hashSeed(`peptivanta-${cycleKey}`));

  return Array.from({ length: count }, (_, index) => {
    const occurredAt = new Date(cycleStart);
    occurredAt.setUTCDate(occurredAt.getUTCDate() - Math.floor(random() * 83));
    const dateKey = isoDate(occurredAt).replaceAll("-", "");
    const destination = destinations[Math.floor(random() * destinations.length)];
    const service = services[Math.floor(random() * services.length)];
    const profiles = SERVICE_PROFILES[service];
    const profile = profiles[Math.floor(random() * profiles.length)];
    const status = fulfillmentStatus({
      occurredAt,
      service,
      orderProfile: profile.label,
      cycleStart,
      random,
    });
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
