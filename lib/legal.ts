/**
 * Business details and policy terms used across the legal pages.
 *
 * BEFORE GOING LIVE: every `null` below must be filled in. Razorpay will not
 * approve a live account without a legal entity name, a reachable support
 * email and phone number, and a registered address on the Terms and
 * Cancellation & Refund pages. Until then the pages render each missing value
 * as a dashed placeholder rather than quietly omitting it.
 */
export interface LegalDetails {
  /** Registered name, e.g. "Grow Medico Media Private Limited". */
  entityName: string | null;
  /** Registered address as it appears on your GST / incorporation records. */
  address: string | null;
  /** Monitored support inbox — this is where refund requests will land. */
  email: string | null;
  /** Support number, in full international form, e.g. "+91 98765 43210". */
  phone: string | null;
  /** GSTIN, if registered. Leave null if not. */
  gstin: string | null;
}

export const LEGAL: LegalDetails = {
  entityName: "Sosavi",
  address:
    "Shree Sai Niwas, Plot no. 213, in front of NMC Corporation Office, Gokulpeth, Dharampeth, Nagpur, Maharashtra 440010",
  email: "support@growmedico.in",
  phone: "+91 75587 72126",
  gstin: null,
};

/**
 * Policy terms. These are our commitments to the customer, so changing a
 * number here changes what we are bound to — confirm before launch rather
 * than treating them as defaults.
 */
export const POLICY = {
  /** Days after the session within which the ₹199-back guarantee can be claimed. */
  guaranteeWindowDays: 7,
  /** Notice needed to cancel a booked slot for a full refund. */
  cancellationNoticeHours: 24,
  /** Free reschedules included, per the FAQ. */
  freeReschedules: 1,
  /** Working days for a refund to land back on the original payment method. */
  refundProcessingDays: "5–7",
  /** Concrete revenue opportunities we promise, or the fee comes back. */
  guaranteedOpportunities: 3,
} as const;

export const LEGAL_LAST_UPDATED = "12 September 2026";
