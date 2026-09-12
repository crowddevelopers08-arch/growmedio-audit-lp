import "server-only";

/**
 * TeleCRM client.
 *
 * TeleCRM is the only system of record for this site — there is no database —
 * so both the booking form (app/api/lead) and the Razorpay webhook
 * (app/api/razorpay/webhook) push through here.
 */

export interface TeleCRMPayload {
  fields: Record<string, string>;
  actions: { type: string; text: string }[];
}

/** "Sep 12, 2026, 3:13 PM" — the format TeleCRM's CreatedOn field expects. */
export function createdOnStamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Digits only, no "+" — how TeleCRM stores numbers. */
export function normaliseNumber(dialCode: string | undefined, phone: string) {
  const dial = (dialCode || "91").replace(/\D/g, "");
  const digits = phone.replace(/\D/g, "");
  // A number that already carries its country code must not get a second one.
  return digits.startsWith(dial) ? digits : `${dial}${digits}`;
}

export async function postToTeleCRM(payload: TeleCRMPayload) {
  const endpoint = process.env.TELECRM_API_URL;
  if (!endpoint) throw new Error("TELECRM_API_URL is not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TELECRM_API_KEY}`,
        "X-Client-ID": "grow-medico-website",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 204) return { status: "success" };

    const text = await res.text();
    // A misconfigured URL returns TeleCRM's login page rather than an API error.
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      throw new Error("TeleCRM returned an HTML response — check the API URL");
    }

    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || `TeleCRM HTTP ${res.status}`);
    return json;
  } catch (err) {
    clearTimeout(timeout);
    throw err instanceof Error ? err : new Error(String(err));
  }
}
