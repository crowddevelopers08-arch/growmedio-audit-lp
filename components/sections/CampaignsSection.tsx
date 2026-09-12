import BookNowButton from "@/components/booking/BookNowButton";
import VideoCarousel from "@/components/sections/VideoCarousel";

/**
 * Clinic owners and doctors talking about their own results. Titles are not
 * shown on the cards — they label each video for screen readers and for the
 * carousel's slide and dot controls, so replace the numbering with the
 * speaker's name and specialty once each clip is identified.
 */
const VIDEOS = [
  { id: "96_CFkqBnOo", title: "Client video 1" },
  { id: "8KvwD99H73Q", title: "Client video 2" },
  { id: "4gyg-J7JGDs", title: "Client video 3" },
];

export default function CampaignsSection() {
  return (
    <section className="relative border-t border-line bg-bg-alt py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-6 md:mb-12">
          <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-brand md:mb-[14px]">
            In their own words
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            The Clinic Owners And Doctors Behind The Numbers
          </h2>
          <p className="mt-3 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim md:mt-4">
            Doctors and clinic owners on what changed once their marketing
            started being measured. Tap any video to watch.
          </p>
        </div>

        <VideoCarousel items={VIDEOS} />

        <div className="mx-auto mt-6 text-center md:mt-8">
          <BookNowButton variant="ghost">
            Get The Same Audit They Did · ₹199
          </BookNowButton>
        </div>
      </div>
    </section>
  );
}
