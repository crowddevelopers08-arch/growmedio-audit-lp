import "server-only";

/**
 * Google Sheets client (via the Apps Script web app in scripts/google-sheets.gs).
 *
 * A copy of every booking-form lead — name and number — for the team,
 * next to TeleCRM and the Neon dashboard.
 */

/** "7 Oct 2026, 3:13 pm" in India time. */
function istStamp() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export async function appendLeadToSheet(lead: { name: string; phone: string }) {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!endpoint) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    // Apps Script answers with a 302 to googleusercontent.com; fetch follows it.
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        timestamp: istStamp(),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    const text = await res.text();
    // A deployment that isn't public ("Anyone") returns Google's sign-in page.
    if (text.trim().startsWith("<")) {
      throw new Error("Google Sheets returned HTML — check the web app's access is 'Anyone'");
    }

    const json = text ? JSON.parse(text) : {};
    if (!res.ok || json.error) throw new Error(json.error || `Google Sheets HTTP ${res.status}`);
    return json;
  } catch (err) {
    clearTimeout(timeout);
    throw err instanceof Error ? err : new Error(String(err));
  }
}
