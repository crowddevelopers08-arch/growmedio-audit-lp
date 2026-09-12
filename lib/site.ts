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

/*
 * The booking form's dropdowns — speciality, enquiry handling, ad spend,
 * revenue and decision-making — now live in lib/booking.ts alongside the slot
 * definitions, so the form, the API's validation and the dashboard all read
 * one list.
 */
