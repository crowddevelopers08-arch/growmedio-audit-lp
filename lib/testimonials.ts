/**
 * Real client testimonials shown in TestimonialsSection.
 *
 * Nothing in here may be written by us. Every entry is a client's own words,
 * from a client who is happy for it to be published under their name. The
 * section renders nothing at all in production while this list is empty — so
 * an unfilled list can never go live looking like real reviews.
 *
 * ── Collecting more ───────────────────────────────────────────────────────
 *
 * Send this to a client whose numbers you're proud of, on WhatsApp:
 *
 *   "Hi ___ — quick favour. We're putting up a new page and I'd rather show
 *    your words than our claims. Could you answer these four in a voice note
 *    or text, whenever you get a minute? Takes two minutes.
 *
 *      1. What was patient acquisition like before we started — what were you
 *         doing, and what was the frustrating part?
 *      2. What changed, and roughly how long did it take?
 *      3. Any number you'd be comfortable sharing — enquiries a month, cost
 *         per enquiry, or appointments booked?
 *      4. If a doctor in your specialty asked whether to work with us, what
 *         would you tell them?
 *
 *    I'll draft it into 2-3 sentences and send it back for your approval —
 *    nothing goes up until you say the wording and the credit are fine."
 *
 * Then: trim their answer to 2-3 sentences, keeping their phrasing. Send it
 * back. Publish only after they reply yes, and keep that reply — that's what
 * `consentOnFile` records.
 */
export interface Testimonial {
  /** The client's own words, trimmed but not rewritten. */
  quote: string;
  /** As they want to be credited, e.g. "Team Advanced Adgro Hair". */
  name: string;
  /** Shown under the credit, e.g. "Hair Restoration". */
  specialty: string;
  /** Optional — appended to the specialty when the client is city-specific. */
  city?: string;
  /**
   * The client is happy for this exact wording and credit to be published, and
   * you can produce their okay if asked. Entries without it are never rendered.
   */
  consentOnFile: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We finally got a clear picture of where our ad spend was going and what it was bringing back. Tracking enquiries and patient conversions made our marketing decisions much easier.",
    name: "Team Advanced Adgro Hair",
    specialty: "Hair Restoration",
    consentOnFile: true,
  },
  {
    quote:
      "Instead of simply looking at reach and engagement, we started focusing on the numbers that actually matter — enquiries, appointments and patients. That completely changed how we looked at our marketing.",
    name: "Team Advanced Adgro Skin",
    specialty: "Skin & Aesthetics",
    consentOnFile: true,
  },
  {
    quote:
      "The biggest difference was having a clearer view of our patient acquisition journey. We could finally understand what was working, where enquiries were coming from and where we needed to improve.",
    name: "Team Equitas",
    specialty: "Healthcare",
    consentOnFile: true,
  },
  {
    quote:
      "Our marketing became much more measurable. Instead of relying on assumptions, we could look at the actual numbers and make better decisions around campaigns and patient acquisition.",
    name: "Team Dr. Shreevarma’s Wellness",
    specialty: "Wellness",
    consentOnFile: true,
  },
  {
    quote:
      "We didn’t need more likes or views — we needed more patients. Having the right tracking in place helped us understand our enquiries and appointments much more clearly.",
    name: "Team Southern Spine",
    specialty: "Physio Rehab · Osteopathy · Chiropractic",
    consentOnFile: true,
  },
  {
    quote:
      "The biggest improvement was visibility. We could see how our campaigns were performing beyond impressions and clicks, and understand which efforts were actually contributing to patient enquiries.",
    name: "Team Ayush Ortho",
    specialty: "Healthcare",
    consentOnFile: true,
  },
  {
    quote:
      "Marketing decisions became much easier once we could see the numbers clearly. The focus shifted from simply generating attention to understanding the enquiries and patients coming from our campaigns.",
    name: "Team Anlon",
    specialty: "Healthcare",
    consentOnFile: true,
  },
  {
    quote:
      "We now have a much clearer understanding of our patient acquisition funnel. Being able to connect ad performance with enquiries and appointments gives us confidence in where we’re investing our budget.",
    name: "Team AVN",
    specialty: "Healthcare",
    consentOnFile: true,
  },
];

/** The only list the page is allowed to render. */
export const PUBLISHABLE = TESTIMONIALS.filter((t) => t.consentOnFile);
