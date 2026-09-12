import BookNowButton from "@/components/booking/BookNowButton";
import { ClockIcon, LockIcon, TrendingUpIcon } from "@/components/ui/Icons";

const STEPS = [
  {
    num: "1",
    Icon: LockIcon,
    title: "Book & lock your slot",
    body: "Secure checkout, takes under a minute — UPI, card, anything.",
  },
  {
    num: "2",
    Icon: ClockIcon,
    title: "Pick your time",
    body: "Choose a convenient slot instantly. We study your clinic and current ads before the call.",
  },
  {
    num: "3",
    Icon: TrendingUpIcon,
    title: "Walk out with your roadmap",
    body: "Leave with your Revenue Leak Audit and 90-day plan — implement it yourself, or let us run it.",
  },
];

export default function StepsSection() {
  return (
    <section className="relative border-t border-line bg-bg-alt py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-7 md:mb-12">
          <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-brand md:mb-[14px]">
            Dead simple
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            From ₹199 To Your Growth Roadmap In 3 Steps
          </h2>
          <p className="mt-3 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim md:mt-4">
            No forms to chase, no discovery calls before the real call. Booking
            to roadmap in one sitting.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:gap-4 min-[800px]:grid-cols-3 min-[800px]:gap-[22px]">
          {STEPS.map(({ num, Icon, title, body }) => (
            <div
              key={num}
              /* The ::after is the hairline bridging one card to the next
                 across the grid gap — hidden on the last card and on phones,
                 where the cards stack. */
              className="group relative flex h-full flex-col rounded-[16px] border border-line bg-surface p-5 transition-colors duration-200 hover:border-brand/40 md:p-6 min-[800px]:after:absolute min-[800px]:after:top-[42px] min-[800px]:after:-right-[22px] min-[800px]:after:h-px min-[800px]:after:w-[22px] min-[800px]:after:bg-line-strong min-[800px]:last:after:hidden"
            >
              {/* Oversized numeral, kept inside the card so it can sit behind
                  the text without clipping the connector above. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1 right-4 font-display text-[4.5rem] leading-none font-bold text-white/[0.04] md:text-[5.5rem]"
              >
                {num}
              </span>

              <div className="relative flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-brand-wash text-brand transition-colors duration-200 group-hover:border-brand/50">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[0.72rem] font-semibold tracking-[0.14em] text-faint uppercase">
                  Step {num}
                </span>
              </div>

              <h3 className="relative mt-4 font-display text-[1.1rem] font-semibold leading-[1.15] tracking-[-0.01em] md:mt-5">
                {title}
              </h3>
              <p className="relative mt-2 text-[0.92rem] leading-[1.6] text-dim">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-7 text-center md:mt-10">
          <BookNowButton>Start With Step 1 · ₹199</BookNowButton>
        </div>
      </div>
    </section>
  );
}
