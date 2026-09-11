import BookNowButton from "@/components/booking/BookNowButton";
import {
  OVERALL,
  RESULTS,
  TOTALS,
  costPerEnquiry,
  count,
  crores,
  inr,
  roasOf,
  shortInr,
  type SpecialtyResult,
} from "@/lib/results";
import Reveal from "@/components/ui/Reveal";
import { ClockIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";

const TRUST_ITEMS = [
  { Icon: ShieldIcon, label: "100% money-back guarantee" },
  { Icon: LockIcon, label: "Confidential & secure booking" },
  { Icon: ClockIcon, label: "Instant slot confirmation" },
];

// One pill per metric per specialty, interleaved so the clinics alternate.
const TICKER_METRICS: ((r: SpecialtyResult) => string)[] = [
  (r) => `${roasOf(r).toFixed(2)}x ROAS`,
  (r) => `${shortInr(r.revenue)} revenue`,
];

const TICKER_ITEMS = TICKER_METRICS.flatMap((metric) =>
  RESULTS.map((r) => ({ label: r.clinic, metric: metric(r) }))
);

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-[48px] pb-[40px]">
      {/* emerald bloom behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[220px] left-1/2 h-[560px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(22,212,146,0.16),transparent_72%)]"
      />

      {/* Gutter and cap share one box, as in the original. The headline and copy
          keep their own tighter measure so the wider shell only widens the
          stat grid and ticker, not the reading line. */}
      <div className="relative z-[1] mx-auto w-full max-w-[1080px] px-6 text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-[0.85rem] text-dim">
          For doctors &amp; clinic owners done guessing with ad spend
        </span>

        <h1 className="mx-auto max-w-[860px] font-display text-[clamp(2.15rem,4.6vw_+_1rem,3.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
          We Turned{" "}
          <span className="text-brand">
            ₹{(OVERALL.adSpend / 1e7).toFixed(2)} Crore
          </span>{" "}
          Of Clinic Ad Spend Into{" "}
          <span className="text-brand">
            ₹{(OVERALL.revenue / 1e7).toFixed(2)} Crore
          </span>{" "}
          Of Patient Revenue — Last Quarter.
        </h1>

        <p className="mx-auto mt-[16px] max-w-[640px] text-[1.15rem] leading-[1.6] text-dim">
          Not a pitch for another marketing retainer — a focused 45-minute audit
          of your actual ad account, showing exactly where it&apos;s lagging and
          what to fix first. For less than the cost of a single OPD
          consultation.
        </p>

        <div className="mt-[24px] flex flex-col items-center gap-[12px]">
          <BookNowButton>Book My ₹299 Strategy Session</BookNowButton>
          <small className="text-[0.85rem] text-faint">
            45-min 1:1 call · Your Revenue Leak Audit included
          </small>

          <div className="mt-[10px] flex flex-wrap justify-center gap-[18px] text-[0.85rem] text-faint">
            {TRUST_ITEMS.map(({ Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-[15px] w-[15px] shrink-0 text-brand" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-[1] mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-line bg-line min-[720px]:grid-cols-4">
          <StatCell label="Patient revenue generated">
            ₹{crores(OVERALL.revenue)} Cr+
          </StatCell>
          <StatCell label="Average ROAS delivered">
            {+roasOf(OVERALL).toFixed(1)}x
          </StatCell>
          <StatCell label="Patient enquiries generated">
            {count(TOTALS.enquiries)}
          </StatCell>
          <StatCell label="Avg. cost per enquiry">
            {inr(costPerEnquiry(TOTALS))}
          </StatCell>
        </div>

        <div
          aria-hidden="true"
          className="mt-[28px] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        >
          {/* Scale the loop with the pill count so the scroll speed stays the
              same however many specialties there are (~4.25s per pill). */}
          <div
            className="flex w-max animate-ticker gap-[14px]"
            style={{ animationDuration: `${TICKER_ITEMS.length * 4.25}s` }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={`${item.label}-${i}`}
                className="whitespace-nowrap rounded-full border border-line bg-surface px-4 py-[9px] text-[0.84rem] text-dim"
              >
                {item.label} ·{" "}
                <b className="font-semibold text-brand">{item.metric}</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="bg-surface px-[18px] py-[20px] text-center">
      <Reveal className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold text-ink tabular-nums">
        {children}
      </Reveal>
      <div className="mt-1.5 text-[0.82rem] text-faint">{label}</div>
    </div>
  );
}
