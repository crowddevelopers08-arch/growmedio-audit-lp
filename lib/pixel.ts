"use client";

/**
 * Meta Pixel + GTM dataLayer helpers.
 *
 * The base pixel and GTM container are installed in app/layout.tsx. Every call
 * here is guarded: an ad-blocker removes `fbq` entirely, and an unguarded call
 * would throw and take the surrounding handler (payment, redirect) down with
 * it. Tracking must never break the booking.
 */

type FbqArgs = [string, string, Record<string, unknown>?, { eventID?: string }?];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

function fbq(...args: FbqArgs) {
  try {
    window.fbq?.(...args);
  } catch {
    /* tracking must never break the flow */
  }
}

/** Push a named event into GTM's dataLayer. */
export function pushDataLayer(event: string, params: Record<string, unknown> = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch {
    /* ignore */
  }
}

/** Name + phone submitted, before payment. */
export function trackLead() {
  fbq("track", "Lead");
  pushDataLayer("Lead");
}

/** Razorpay checkout opened. */
export function trackInitiateCheckout(value: number) {
  fbq("track", "InitiateCheckout", { value, currency: "INR" });
  pushDataLayer("InitiateCheckout", { value, currency: "INR" });
}

/**
 * Payment complete.
 *
 * `eventId` must match the `event_id` the server sends to the Conversions API
 * for the same payment — that is what stops Meta counting one purchase twice.
 */
export function trackPurchase(value: number, eventId: string) {
  fbq("track", "Purchase", { value, currency: "INR" }, { eventID: eventId });
  pushDataLayer("Purchased", { value, currency: "INR", event_id: eventId });
}

/** The booking is fully done — payment taken and slot chosen. */
export function trackSubmitApplication() {
  fbq("track", "SubmitApplication");
  pushDataLayer("SubmitApplication");
}

// ── Handover between the booking modal and /thank-you ────────────────────────
const STORAGE_KEY = "gm_purchase";

export interface PurchaseRecord {
  paymentId: string;
  /** Rupees. */
  value: number;
}

export function rememberPurchase(record: PurchaseRecord) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* private mode — the thank-you page falls back to defaults */
  }
}

export function readPurchase(): PurchaseRecord | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PurchaseRecord;
    return parsed?.paymentId ? parsed : null;
  } catch {
    return null;
  }
}
