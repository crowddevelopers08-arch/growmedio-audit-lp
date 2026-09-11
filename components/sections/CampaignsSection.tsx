import BookNowButton from "@/components/booking/BookNowButton";
import VideoCarousel from "@/components/sections/VideoCarousel";

const VIDEOS = [
  { id: "96_CFkqBnOo", title: "Campaign video 1" },
  { id: "8KvwD99H73Q", title: "Campaign video 2" },
  { id: "4gyg-J7JGDs", title: "Campaign video 3" },
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
            video to watch.
          </p>
        </div>

        <VideoCarousel items={VIDEOS} />

        <div className="mx-auto mt-6 text-center md:mt-8">
          <BookNowButton variant="ghost">
            Get An Audit Of What&apos;s Holding Yours Back · ₹199
          </BookNowButton>
        </div>
      </div>
    </section>
  );
}
