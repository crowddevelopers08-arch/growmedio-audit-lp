import BookNowButton from "@/components/booking/BookNowButton";
import Ph from "@/components/ui/Ph";
import { PlayIcon } from "@/components/ui/Icons";

const VIDEO_SPECIALTIES = [
  "Dermatology",
  "Dental",
  "IVF & Fertility",
  "Ortho",
  "Multi-Specialty",
  "Cosmetic & Aesthetic",
];

export default function CampaignsSection() {
  return (
    <section className="relative border-t border-line bg-bg-alt py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-6 md:mb-12">
          <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-brand md:mb-[14px]">
            Our work in the wild
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            The Campaigns Behind The Numbers
          </h2>
          <p className="mt-3 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim md:mt-4">
            Real patient-acquisition ads, running for clinics right now. Tap any
            card to see it during your session.
          </p>
        </div>

        {/* Narrower cards on phones so the next one peeks in and the 9:16
            frames don't fill the whole screen height. */}
        <div className="hide-scrollbar-thumb flex snap-x snap-mandatory gap-3 overflow-x-auto px-0.5 pt-1.5 pb-3 md:gap-4 md:pb-[18px]">
          {VIDEO_SPECIALTIES.map((specialty) => (
            <div
              key={specialty}
              className="flex-[0_0_172px] snap-start overflow-hidden rounded-[16px] border border-line bg-surface min-[480px]:flex-[0_0_210px] md:flex-[0_0_240px]"
            >
              <div className="relative flex aspect-[9/16] items-center justify-center bg-[linear-gradient(160deg,#161C22,#0C0F12_70%)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.12] text-white backdrop-blur-[6px] md:h-[52px] md:w-[52px]">
                  <PlayIcon className="ml-0.5 h-5 w-5" />
                </div>
                <Ph
                  title="Add real video clip"
                  className="absolute right-3 bottom-3 left-3 text-[0.72rem] text-faint"
                >
                  Video testimonial — add clip
                </Ph>
              </div>
              <div className="px-3 py-2.5 text-[0.8rem] text-dim md:px-[14px] md:py-3 md:text-[0.82rem]">
                {specialty} clinic
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-4 text-center md:mt-2">
          <BookNowButton variant="ghost">
            Get An Audit Of What&apos;s Holding Yours Back · ₹199
          </BookNowButton>
        </div>
      </div>
    </section>
  );
}
