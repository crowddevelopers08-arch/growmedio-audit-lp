import BookNowButton from "@/components/booking/BookNowButton";
import Reveal from "@/components/ui/Reveal";
import {
  CAMPAIGNS,
  RESULTS,
  TOTALS,
  costPerEnquiry,
  count,
  inr,
  roasOf,
} from "@/lib/results";

const MAX_ROAS = Math.max(...RESULTS.map(roasOf));
const MIN_ROAS = Math.min(...RESULTS.map(roasOf));
const TOP_RESULT = RESULTS.find((r) => roasOf(r) === MAX_ROAS)!;

export default function ProofSection() {
  return (
    <section id="proof" className="relative border-t border-line py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-12">
          <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
            Receipts, not promises
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            Straight From Our Live Client Tracker — July 2026
          </h2>
          <p className="mt-4 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim">
            This isn&apos;t a highlight reel. It&apos;s the same dashboard our
            strategists are measured against, every single month.
          </p>
        </div>

        {/* Live tracker panel */}
        <div className="rounded-[26px] border border-line-strong bg-surface px-6 py-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-5">
            <span className="text-[0.85rem] text-faint">
              Grow Medico · Patient Acquisition Report · July 2026 · All active
              clients
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-brand">
              <span
                aria-hidden="true"
                className="inline-block h-[7px] w-[7px] animate-blink rounded-full bg-brand"
              />
              Live tracker
            </span>
          </div>

          <div className="grid grid-cols-1 gap-[22px] min-[700px]:grid-cols-4">
            <TrackerStat
              label="Total ad spend managed"
              delta={`across ${CAMPAIGNS} campaigns`}
            >
              {inr(TOTALS.adSpend)}
            </TrackerStat>

            <TrackerStat
              label="Patient revenue generated"
              delta={`▲ ${roasOf(TOTALS).toFixed(2)}x return on spend`}
            >
              {inr(TOTALS.revenue)}
            </TrackerStat>

            <TrackerStat
              label="Enquiries generated"
              delta={`avg ${inr(costPerEnquiry(TOTALS))} per enquiry`}
            >
              {count(TOTALS.enquiries)}
            </TrackerStat>

            <TrackerStat label="Appointments booked" delta="tracked to revenue">
              {count(TOTALS.appointments)}
            </TrackerStat>
          </div>

          {/* ROAS by specialty */}
          <div className="mt-9">
            <div className="mb-5 text-[0.9rem] text-dim">
              Return on ad spend — by specialty (revenue ÷ ad spend, per active
              client)
            </div>

            <div className="flex h-[180px] items-end gap-[14px] border-b border-line">
              {RESULTS.map((result) => (
                <div
                  key={result.name}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="relative w-full max-w-[46px] rounded-t-lg bg-[linear-gradient(180deg,var(--color-brand),var(--color-brand-dim))]"
                    style={{ height: `${(roasOf(result) / MAX_ROAS) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.72rem] text-dim">
                      {roasOf(result).toFixed(2)}x
                    </span>
                  </div>
                  <div className="mt-2.5 text-center text-[0.72rem] text-faint">
                    {result.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[14px] text-[0.78rem] text-faint">
              Every specialty returns at least {MIN_ROAS.toFixed(1)}x its ad
              spend — {TOP_RESULT.name} leads at {MAX_ROAS.toFixed(2)}x.
            </div>
          </div>
        </div>

        {/* Case cards */}
        <div className="mt-10 grid grid-cols-1 gap-[14px] min-[700px]:grid-cols-2">
          {RESULTS.map((result) => (
            <CaseCard
              key={result.name}
              tag={result.clinic}
              flow={
                <>
                  {inr(result.adSpend)}
                  <span className="mx-1.5 text-faint">→</span>
                  {inr(result.revenue)}
                </>
              }
              roas={`${roasOf(result).toFixed(2)}x ROAS`}
            >
              {count(result.enquiries)} enquiries →{" "}
              {count(result.appointments)} appointments booked, at{" "}
              {inr(costPerEnquiry(result))} per enquiry.
            </CaseCard>
          ))}
        </div>

        <div className="mx-auto mt-10 text-center">
          <BookNowButton>
            I Want Numbers Like These — Book For ₹299
          </BookNowButton>
        </div>
      </div>
    </section>
  );
}

function TrackerStat({
  children,
  label,
  delta,
}: {
  children: React.ReactNode;
  label: string;
  delta: React.ReactNode;
}) {
  return (
    <div>
      <Reveal className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold tabular-nums">
        {children}
      </Reveal>
      <div className="mt-1 text-[0.82rem] text-faint">{label}</div>
      <div className="mt-1.5 text-[0.82rem] font-semibold text-brand">
        {delta}
      </div>
    </div>
  );
}

function CaseCard({
  tag,
  flow,
  roas,
  children,
}: {
  tag: string;
  flow: React.ReactNode;
  roas: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-line bg-surface p-[22px]">
      <div className="mb-2.5 text-[0.78rem] font-semibold text-gold">{tag}</div>
      <div className="mb-1.5 font-display text-[1.15rem] font-semibold">
        {flow}
      </div>
      <div className="mb-2.5 text-[0.95rem] font-bold text-brand">{roas}</div>
      <p className="text-[0.9rem] text-dim">{children}</p>
    </div>
  );
}
