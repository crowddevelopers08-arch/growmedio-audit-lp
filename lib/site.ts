/**
 * BEFORE GOING LIVE
 * -----------------
 * 1. Replace every <Ph> placeholder in the section components with real,
 *    verified figures (ad spend, revenue, ROAS, lead counts, tracker rows,
 *    video clips, written testimonials, founder credentials).
 * 2. Fill in the Neon database URLs and Razorpay keys in `.env.local` (see
 *    `.env.example`), then run `npm run db:migrate`.
 */

export const SITE = {
  name: "Grow Medico",
  price: "₹199",
  listPrice: "₹2,999",
} as const;

/** Shown in the checkout modal — keep in sync with RAZORPAY_SESSION_AMOUNT. */
export const SESSION_PRICE_LABEL = SITE.price;

/**
 * The Calendly event clients book after paying.
 *
 * `primary_color` is Calendly's own brand green, from the embed snippet.
 * `hide_gdpr_banner` suppresses the cookie bar, which would otherwise cover
 * the first slot inside our modal.
 */
export const CALENDLY_URL =
  "https://calendly.com/growmedico/strategy_call?primary_color=289b57&hide_gdpr_banner=1";
