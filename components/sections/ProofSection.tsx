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
    <section id="proof" className="relative border-t border-line py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-8 md:mb-12">
          <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-brand md:mb-[14px]">
            Receipts, not promises
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            Straight From Our Live Client Tracker — July 2026
          </h2>
          <p className="mt-3 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim md:mt-4">
            This isn&apos;t a highlight reel. It&apos;s the same dashboard our
            strategists are measured against, every single month.
          </p>
        </div>

        {/* Live tracker panel */}
        <div className="rounded-[20px] border border-line-strong bg-surface px-4 py-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] min-[480px]:px-6 md:rounded-[26px] md:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4 md:mb-6 md:pb-5">
            <span className="text-[0.8rem] text-faint md:text-[0.85rem]">
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

          <div className="grid grid-cols-1 gap-x-4 gap-y-5 min-[360px]:grid-cols-2 min-[700px]:grid-cols-4 min-[700px]:gap-[22px]">
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
          <div className="mt-7 md:mt-9">
            <div className="mb-3 text-[0.85rem] text-dim md:mb-5 md:text-[0.9rem]">
              Return on ad spend — by specialty (revenue ÷ ad spend, per active
              client)
            </div>

            {/* Bars and labels are separate rows with identical columns, so a
                label wrapping to two lines on a phone can't squash its bar. */}
            <div className="flex h-[150px] items-end gap-1.5 border-b border-line pt-6 min-[480px]:h-[180px] min-[480px]:gap-[14px]">
              {RESULTS.map((result) => (
                <div
                  key={result.name}
                  className="flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <div
                    className="relative w-full max-w-[46px] rounded-t-md bg-[linear-gradient(180deg,var(--color-brand),var(--color-brand-dim))] min-[480px]:rounded-t-lg"
                    style={{ height: `${(roasOf(result) / MAX_ROAS) * 100}%` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.62rem] text-dim min-[480px]:-top-6 min-[480px]:text-[0.72rem]">
                      {roasOf(result).toFixed(2)}x
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5 min-[480px]:mt-2.5 min-[480px]:gap-[14px]">
              {RESULTS.map((result) => (
                <div
                  key={result.name}
                  className="min-w-0 flex-1 text-center text-[0.62rem] leading-tight text-faint min-[480px]:text-[0.72rem]"
                >
                  <span className="sm:hidden">{result.shortName}</span>
                  <span className="hidden sm:inline">{result.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[0.78rem] text-faint md:mt-[14px]">
              Every specialty returns at least {MIN_ROAS.toFixed(1)}x its ad
              spend — {TOP_RESULT.name} leads at {MAX_ROAS.toFixed(2)}x.
            </div>
          </div>
        </div>

        {/* Case cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 md:mt-10 md:gap-[14px] min-[700px]:grid-cols-2">
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

        <div className="mx-auto mt-8 text-center md:mt-10">
          <BookNowButton>
            I Want Numbers Like These — Book For ₹199
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
    <div className="min-w-0">
      <Reveal className="font-display text-[clamp(1.2rem,2.4vw_+_0.4rem,2rem)] font-bold tabular-nums">
        {children}
      </Reveal>
      <div className="mt-1 text-[0.8rem] leading-snug text-faint md:text-[0.82rem]">{label}</div>
      <div className="mt-1 text-[0.8rem] leading-snug font-semibold text-brand md:mt-1.5 md:text-[0.82rem]">
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
    <div className="rounded-[16px] border border-line bg-surface p-5 md:p-[22px]">
      <div className="mb-2 text-[0.78rem] font-semibold text-gold md:mb-2.5">{tag}</div>
      <div className="mb-1 font-display text-[1.05rem] font-semibold md:mb-1.5 md:text-[1.15rem]">
        {flow}
      </div>
      <div className="mb-2 text-[0.95rem] font-bold text-brand md:mb-2.5">{roas}</div>
      <p className="text-[0.9rem] text-dim">{children}</p>
    </div>
  );
}
