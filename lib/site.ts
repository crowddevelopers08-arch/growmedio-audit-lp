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
  price: "₹299",
  listPrice: "₹2,999",
  phone: "+91 XXXXX XXXXX",
  email: "hello@growmedico.in",
} as const;

/** Shown in the checkout modal — keep in sync with RAZORPAY_SESSION_AMOUNT. */
export const SESSION_PRICE_LABEL = SITE.price;

/** Drives the specialty dropdown in the booking form and TeleCRM's procedure field. */
export const SPECIALTIES = [
  "Dermatology / Skin & Hair",
  "Dental",
  "IVF & Fertility",
  "Orthopedics",
  "Multi-Specialty Hospital",
  "Cosmetic & Aesthetics",
  "Diagnostics",
  "Ayurveda & Wellness",
  "Other",
] as const;
