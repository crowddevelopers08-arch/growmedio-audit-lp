import BookNowButton from "@/components/booking/BookNowButton";
import {
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  TargetIcon,
  TrendingUpIcon,
} from "@/components/ui/Icons";

const LINE_ITEMS = [
  {
    Icon: TargetIcon,
    title: "45-Minute 1:1 Revenue Strategy Session",
    body: "Deep-dive on your clinic, patient funnel and local market, live with a senior strategist.",
    price: "₹4,999",
  },
  {
    Icon: SearchIcon,
    title: "Revenue Leak Audit",
    body: "We find the biggest places your patient-acquisition spend is bleeding money right now.",
    price: "₹2,999",
  },
  {
    Icon: PackageIcon,
    title: "Your 90-Day Growth Roadmap",
    body: "A written, step-by-step plan: offer → creative → ads → follow-up → revenue.",
    price: "₹3,999",
  },
  {
    Icon: TrendingUpIcon,
    title: "ROAS Projection For Your Business",
    body: "Realistic cost-per-enquiry and ROAS targets, modeled for your specialty and city.",
    price: "₹1,999",
  },
];

export default function OfferSection() {
  return (
    <section id="offer" className="relative border-t border-line py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1240px] px-6">
        <div className="mx-auto mb-8 text-center md:mb-12">
          <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-brand md:mb-[14px]">
            Here&apos;s exactly what you get
          </span>
          <h2 className="mx-auto max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            The ₹199 Revenue Strategy Session
          </h2>
          <p className="mx-auto mt-3 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim md:mt-4">
            Not a sales call. A working session with a senior strategist —
            focused on one thing: where your next patient revenue is hiding, and
            what it would take to unlock up to 5x more of it from the same ad
            spend.
          </p>
        </div>

        <div className="flex justify-center">
          {/* The receipt tilt only kicks in once there's room — on a phone it
              just nudges the edges out of line with the page gutter. */}
          <div className="w-full max-w-[880px] rounded-[20px] border border-line-strong bg-surface px-4 pt-6 pb-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] min-[480px]:px-[30px] min-[640px]:rotate-[-0.6deg] md:rounded-[26px] md:pt-9 md:pb-[30px]">
            <div className="mb-4 border-b border-dashed border-line-strong pb-4 text-center md:mb-[22px] md:pb-[22px]">
              <div className="text-[0.72rem] tracking-[0.04em] text-faint md:text-[0.75rem]">
                GROW MEDICO — SESSION RECEIPT
              </div>
              <h3 className="mt-1.5 font-display text-[1.2rem] font-semibold leading-[1.12] tracking-[-0.01em] md:text-[1.3rem]">
                What&apos;s Included
              </h3>
            </div>

            {/* gap-px over a bg-line parent keeps the receipt's hairline rules
                while laying the four items out 2×2. */}
            <div className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
              {LINE_ITEMS.map(({ Icon, title, body, price }) => (
                <div
                  key={title}
                  className="flex gap-3 bg-surface p-4 md:gap-[14px] md:p-[18px]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(22,212,146,0.3)] bg-brand-wash text-brand md:h-[38px] md:w-[38px]">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  {/* Price sits on the title row, so the description gets the
                      full width instead of a narrow column beside it. */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-display text-[0.98rem] font-semibold leading-[1.2] tracking-[-0.01em]">
                        {title}
                      </h4>
                      <span className="shrink-0 font-[family-name:'Courier_New',monospace] text-[0.85rem] whitespace-nowrap text-faint line-through md:text-[0.9rem]">
                        {price}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.85rem] text-dim">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* The dashed rule spans the receipt, but the totals, CTA and
                guarantee share one narrow column — across the full 880px the
                label and amount get pushed to opposite edges. */}
            <div className="mt-5 border-t border-dashed border-line-strong pt-4 md:mt-6 md:pt-5">
              <div className="mx-auto max-w-[340px]">
                <div className="flex items-center justify-between">
                  <span className="text-[0.95rem] text-dim">Total value</span>
                  <span className="font-[family-name:'Courier_New',monospace] text-faint line-through">
                    ₹13,996
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between md:mt-2.5">
                  <span className="text-[1.05rem] font-bold">Today</span>
                  <span className="font-[family-name:'Courier_New',monospace] text-[1.6rem] font-bold text-brand md:text-[1.8rem]">
                    ₹199
                  </span>
                </div>

                <BookNowButton block className="mt-4 md:mt-6">
                  Claim My ₹199 Session
                </BookNowButton>

                <div className="mt-4 flex items-start gap-2.5 text-[0.82rem] text-dim md:mt-[18px]">
                  <ShieldIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-brand" />
                  <span>
                    Leave with 3 concrete revenue opportunities for your clinic,
                    or we refund your ₹199 on the spot.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[0.82rem] text-faint md:mt-[22px] md:text-[0.85rem]">
          Only a limited number of 1:1 slots open every week — first booked,
          first served.
        </p>
      </div>
    </section>
  );
}
