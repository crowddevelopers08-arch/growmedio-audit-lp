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
    <section id="offer" className="relative border-t border-line py-[88px]">
      <div className="mx-auto w-full max-w-[1240px] px-6">
        <div className="mx-auto mb-12 text-center">
          <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
            Here&apos;s exactly what you get
          </span>
          <h2 className="mx-auto max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            The ₹299 Revenue Strategy Session
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim">
            Not a sales call. A working session with a senior strategist —
            focused on one thing: where your next patient revenue is hiding, and
            what it would take to unlock up to 5x more of it from the same ad
            spend.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[880px] rotate-[-0.6deg] rounded-[26px] border border-line-strong bg-surface px-[30px] pt-9 pb-[30px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
            <div className="mb-[22px] border-b border-dashed border-line-strong pb-[22px] text-center">
              <div className="text-[0.75rem] tracking-[0.04em] text-faint">
                GROW MEDICO — SESSION RECEIPT
              </div>
              <h3 className="mt-1.5 font-display text-[1.3rem] font-semibold leading-[1.12] tracking-[-0.01em]">
                What&apos;s Included
              </h3>
            </div>

            {/* gap-px over a bg-line parent keeps the receipt's hairline rules
                while laying the four items out 2×2. */}
            <div className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
              {LINE_ITEMS.map(({ Icon, title, body, price }) => (
                <div
                  key={title}
                  className="flex gap-[14px] bg-surface p-[18px]"
                >
                  <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[rgba(22,212,146,0.3)] bg-brand-wash text-brand">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-[0.98rem] font-semibold leading-[1.12] tracking-[-0.01em]">
                      {title}
                    </h4>
                    <p className="mt-1 text-[0.85rem] text-dim">{body}</p>
                  </div>
                  <div className="font-[family-name:'Courier_New',monospace] text-[0.9rem] whitespace-nowrap text-faint line-through">
                    {price}
                  </div>
                </div>
              ))}
            </div>

            {/* The dashed rule spans the receipt, but the totals, CTA and
                guarantee share one narrow column — across the full 880px the
                label and amount get pushed to opposite edges. */}
            <div className="mt-6 border-t border-dashed border-line-strong pt-5">
              <div className="mx-auto max-w-[340px]">
                <div className="flex items-center justify-between">
                  <span className="text-[0.95rem] text-dim">Total value</span>
                  <span className="font-[family-name:'Courier_New',monospace] text-faint line-through">
                    ₹13,996
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[1.05rem] font-bold">Today</span>
                  <span className="font-[family-name:'Courier_New',monospace] text-[1.8rem] font-bold text-brand">
                    ₹299
                  </span>
                </div>

                <BookNowButton block className="mt-6">
                  Claim My ₹299 Session
                </BookNowButton>

                <div className="mt-[18px] flex items-start gap-2.5 text-[0.82rem] text-dim">
                  <ShieldIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-brand" />
                  <span>
                    Leave with 3 concrete revenue opportunities for your clinic,
                    or we refund your ₹299 on the spot.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-[22px] text-center text-[0.85rem] text-faint">
          Only a limited number of 1:1 slots open every week — first booked,
          first served.
        </p>
      </div>
    </section>
  );
}
