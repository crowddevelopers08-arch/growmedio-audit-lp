/** Handover from the lead form (components/ayurveda/LeadModal) to /ayurveda/thank-you. */

const KEY = "gm_ayurveda_lead";

export interface AyurvedaLeadRecord {
  firstName: string;
  /** Pixel / Conversions API Lead event id, also used to fire the thank-you event once. */
  eventId: string;
}

export function rememberAyurvedaLead(record: AyurvedaLeadRecord) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    /* private mode — the thank-you page falls back to a generic greeting */
  }
}

export function readAyurvedaLead(): AyurvedaLeadRecord | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as AyurvedaLeadRecord) : null;
    return parsed?.eventId ? parsed : null;
  } catch {
    return null;
  }
}
