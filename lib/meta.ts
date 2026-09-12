import "server-only";
import crypto from "crypto";

/**
 * Meta Conversions API — server-side conversion events.
 *
 * The browser pixel is lost to ad-blockers, dropped tabs and iOS restrictions;
 * this fires from our server off a Razorpay-verified payment, so the purchase
 * is reported either way. Both events carry the same `event_id`, which is how
 * Meta collapses them into one conversion instead of counting two.
 *
 * Env: META_PIXEL_ID, META_CONVERSIONS_API_TOKEN, and optionally
 * META_TEST_EVENT_CODE while testing in Events Manager.
 */

const GRAPH_VERSION = "v21.0";

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

export interface PurchaseEvent {
  /** Razorpay payment id — also the browser event's eventID, for dedup. */
  eventId: string;
  value: number; // rupees
  currency: string;
  name?: string;
  phone?: string; // digits, with country code, no "+"
  email?: string;
  country?: string; // ISO-2
  sourceUrl?: string;
}

/** Returns `{ skipped: true }` when the API isn't configured — never throws for that. */
export async function sendPurchaseToMeta(event: PurchaseEvent) {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CONVERSIONS_API_TOKEN;
  if (!pixelId || !token) return { skipped: true as const };

  // Meta requires every identifier to be SHA-256 hashed before it is sent.
  const user_data: Record<string, unknown> = {};
  if (event.phone) user_data.ph = [sha256(event.phone)];
  if (event.email) user_data.em = [sha256(event.email)];
  if (event.country) user_data.country = [sha256(event.country)];
  if (event.name) {
    const parts = event.name.trim().split(/\s+/);
    if (parts[0]) user_data.fn = [sha256(parts[0])];
    const last = parts.slice(1).join(" ");
    if (last) user_data.ln = [sha256(last)];
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: event.sourceUrl || undefined,
        event_id: event.eventId,
        user_data,
        custom_data: {
          value: event.value,
          currency: event.currency,
          content_name: "Revenue Strategy Session",
          content_category: "consultation",
        },
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || `Meta CAPI HTTP ${res.status}`);
    return json;
  } catch (err) {
    clearTimeout(timeout);
    throw err instanceof Error ? err : new Error(String(err));
  }
}
