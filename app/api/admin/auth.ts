/**
 * Lightweight protection for the private order console.
 *
 * The secret is stored as a Cloudflare runtime secret named
 * FULFILLMENT_ADMIN_KEY. It is never committed to the repository or returned
 * by an API response. The browser keeps it only for the current tab session.
 */
export async function requireFulfillmentAdmin(request: Request) {
  const { env } = await import("cloudflare:workers");
  const runtimeEnv = env as unknown as {
    FULFILLMENT_ADMIN_KEY?: string;
  };
  const expected = runtimeEnv.FULFILLMENT_ADMIN_KEY?.trim() ?? "";

  if (!expected) {
    return Response.json(
      { error: "The fulfillment admin key has not been configured." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  if (!constantTimeEqual(supplied, expected)) {
    return Response.json(
      { error: "Invalid admin key." },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return null;
}

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |=
      (leftBytes[index] ?? 0) ^
      (rightBytes[index] ?? 0);
  }

  return difference === 0;
}
