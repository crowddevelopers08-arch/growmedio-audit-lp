import BookNowButton from "@/components/booking/BookNowButton";
import { ClockIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";

const TRUST_ITEMS = [
  { Icon: ShieldIcon, label: "3 opportunities or ₹299 back" },
  { Icon: LockIcon, label: "Secure checkout" },
  { Icon: ClockIcon, label: "Instant slot booking" },
];

export default function FinalCta() {
  return (
    <section className="relative border-t border-line bg-[radial-gradient(ellipse_at_50%_0%,rgba(22,212,146,0.14),transparent_60%)] py-[88px] text-center">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <h2 className="mx-auto max-w-[680px] font-display text-[clamp(1.8rem,3.4vw_+_1rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
          Your Competitors Are Already Tracking Their Patients. Are You?
        </h2>

        <p className="mx-auto mt-4 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim">
          For less than one consultation fee, get the full ₹13,996 audit,
          90-day roadmap and ROAS projection — for just ₹299.
        </p>

        <div className="mt-7 flex flex-col items-center gap-[14px]">
          <BookNowButton>Book My ₹299 Session Now</BookNowButton>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-[18px] text-[0.85rem] text-faint">
          {TRUST_ITEMS.map(({ Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <Icon className="h-[15px] w-[15px] shrink-0 text-brand" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
