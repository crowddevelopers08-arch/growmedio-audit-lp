"use client";

import { useEffect } from "react";
import {
  readPurchase,
  trackPurchase,
  trackSubmitApplication,
} from "@/lib/pixel";

/** Fallback when the booking modal's handover is missing (see below). */
const DEFAULT_VALUE = 199;
const FIRED_KEY = "gm_purchase_fired";

/**
 * Fires the conversion events on /thank-you — reached only after payment and a
 * completed Calendly booking.
 *
 * `Purchase` carries an `eventID` built from the Razorpay payment id, which the
 * Razorpay webhook repeats as `event_id` when it sends the same purchase to the
 * Conversions API. Meta collapses the pair into one conversion, so a visitor
 * whose browser event lands is not counted twice.
 */
export default function ConversionTracking() {
  useEffect(() => {
    const purchase = readPurchase();
    // A refresh of this page must not report a second purchase.
    const dedupeKey = purchase?.paymentId ?? "unknown";
    try {
      if (sessionStorage.getItem(FIRED_KEY) === dedupeKey) return;
      sessionStorage.setItem(FIRED_KEY, dedupeKey);
    } catch {
      /* private mode — accept the small risk of a double count */
    }

    // Without the handover (private mode, or a direct visit to this URL) we
    // still report the conversion, but with no id the server event cannot be
    // deduplicated against it.
    trackPurchase(
      purchase?.value ?? DEFAULT_VALUE,
      purchase ? `purchase_${purchase.paymentId}` : `purchase_${Date.now()}`
    );
    trackSubmitApplication();
  }, []);

  return null;
}
