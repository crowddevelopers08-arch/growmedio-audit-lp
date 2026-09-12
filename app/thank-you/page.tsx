import type { Metadata } from "next";
import Link from "next/link";
import ConversionTracking from "@/components/booking/ConversionTracking";
import PageShell from "@/components/layout/PageShell";
import { ctaClass } from "@/components/ui/CtaButton";
import { SESSION_PRICE_LABEL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Booking confirmed — Grow Medico",
  robots: { index: false, follow: false },
};

/** Same pixel as the root layout — needed here for the noscript fallback. */
const META_PIXEL_ID = "757838743050832";

const NEXT_STEPS = [
  {
    title: "Check your email and WhatsApp",
    body: "Calendly has sent your slot confirmation, and we'll message you on the number you booked with.",
  },
  {
    title: "We study your clinic",
    body: "Before the call we review your clinic, speciality and current ads, so the session starts with answers.",
  },
  {
    title: "You walk out with your roadmap",
    body: "Your Revenue Leak Audit, 90-day growth roadmap and ROAS projection.",
  },
];

export default function ThankYouPage() {
  return (
    <PageShell>
      {/* Purchase + SubmitApplication, and the GTM dataLayer pushes alongside
          them. Reaching this page means payment succeeded and a slot was
          booked. */}
      <ConversionTracking />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=SubmitApplication&noscript=1`}
        />
      </noscript>

      <section className="relative overflow-hidden pt-8 pb-12 md:pb-16 min-[860px]:pt-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[220px] left-1/2 h-[480px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(22,212,146,0.14),transparent_72%)]"
        />

        <div className="relative mx-auto w-full max-w-[640px] px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(22,212,146,0.35)] bg-brand-wash text-brand">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>

          <span className="mt-5 inline-block text-[0.85rem] font-semibold text-brand">
            Booking confirmed
          </span>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,3vw_+_1rem,2.7rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            Your session is locked in
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[1.02rem] leading-[1.65] text-dim">
            Your {SESSION_PRICE_LABEL} payment is received and your slot is
            booked. A confirmation with the call link is on its way to you.
          </p>

          <div className="mt-6 rounded-[18px] border border-line bg-surface p-5 text-left md:mt-8 md:p-6">
            <h2 className="font-display text-[1.05rem] font-semibold">
              What happens next
            </h2>
            <ol className="mt-4 grid gap-4">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-display text-[1.4rem] leading-none font-bold text-brand">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{step.title}</div>
                    <p className="mt-1 text-[0.9rem] text-dim">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-6 text-[0.85rem] text-faint">
            Need to change something? Reply to your confirmation email and
            we&apos;ll sort it out.
          </p>

          <Link href="/" className={ctaClass({ variant: "ghost", size: "sm", className: "mt-5" })}>
            Back to {SITE.name}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
