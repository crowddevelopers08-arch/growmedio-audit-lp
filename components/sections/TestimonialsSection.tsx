import Ph from "@/components/ui/Ph";
import { ShieldIcon, StarIcon } from "@/components/ui/Icons";

const TESTIMONIALS = [
  { specialty: "Dermatology, Chennai" },
  { specialty: "Dental, Bengaluru" },
  { specialty: "IVF & Fertility, Hyderabad" },
  { specialty: "Multi-Specialty, Coimbatore" },
];

export default function TestimonialsSection() {
  return (
    <section className="relative border-t border-line bg-bg-alt py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-12">
          <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
            What clients say
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            They Stopped Guessing. They Started Tracking Patients.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[760px]:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.specialty}
              className="rounded-[16px] border border-line bg-surface p-[26px]"
            >
              <div className="mb-[14px] flex gap-[3px] text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-[15px] w-[15px]" />
                ))}
              </div>
              <Ph
                title="Add a real, specific quote from this client"
                className="block text-[0.98rem] leading-[1.65] text-ink"
              >
                &ldquo;[Add a specific, result-focused quote from a real client —
                mention an actual number: enquiries generated, cost per enquiry,
                or patients booked.]&rdquo;
              </Ph>
              <Ph
                title="Add real name, specialty and city"
                className="mt-4 block text-[0.85rem] text-faint"
              >
                Dr. [Name], {t.specialty}
              </Ph>
            </div>
          ))}
        </div>

        <div className="mt-9 flex items-start gap-4 rounded-[16px] border border-[rgba(22,212,146,0.3)] bg-brand-wash p-6">
          <ShieldIcon className="h-[30px] w-[30px] shrink-0 text-brand" />
          <div>
            <h4 className="mb-1.5 font-display text-[1.02rem] font-semibold leading-[1.12] tracking-[-0.01em]">
              The &ldquo;3 Opportunities Or ₹299 Back&rdquo; Guarantee
            </h4>
            <p className="text-[0.9rem] text-dim">
              If you finish your session without at least 3 concrete revenue
              opportunities for your clinic, say so and we refund your ₹299 on
              the spot. No forms, no back-and-forth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
