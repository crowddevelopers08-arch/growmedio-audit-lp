import TestimonialCarousel from "@/components/sections/TestimonialCarousel";
import { ShieldIcon } from "@/components/ui/Icons";
import { PUBLISHABLE } from "@/lib/testimonials";

export default function TestimonialsSection() {
  const hasQuotes = PUBLISHABLE.length > 0;

  return (
    <section className="relative border-t border-line bg-bg-alt py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        {hasQuotes && (
          <>
            <div className="mb-8 md:mb-12">
              <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-brand md:mb-[14px]">
                What clients say
              </span>
              <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
                They Stopped Guessing. They Started Tracking Patients.
              </h2>
            </div>

            <TestimonialCarousel items={PUBLISHABLE} />
          </>
        )}

        <div
          className={`flex items-start gap-3 rounded-[16px] border border-[rgba(22,212,146,0.3)] bg-brand-wash p-5 md:gap-4 md:p-6 ${
            hasQuotes ? "mt-8 md:mt-10" : ""
          }`}
        >
          <ShieldIcon className="h-6 w-6 shrink-0 text-brand md:h-[30px] md:w-[30px]" />
          <div>
            <h4 className="mb-1.5 font-display text-[1.02rem] font-semibold leading-[1.12] tracking-[-0.01em]">
              The &ldquo;3 Opportunities Or ₹199 Back&rdquo; Guarantee
            </h4>
            <p className="text-[0.9rem] text-dim">
              If you finish your session without at least 3 concrete revenue
              opportunities for your clinic, say so and we refund your ₹199 on
              the spot. No forms, no back-and-forth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
