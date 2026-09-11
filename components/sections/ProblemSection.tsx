import {
  AlertTriangleIcon,
  LayoutIcon,
  TrendingDownIcon,
} from "@/components/ui/Icons";

const PAINS = [
  {
    Icon: AlertTriangleIcon,
    title: "You're spending on ads blind",
    body: "Boosted posts, random reels, “brand awareness” campaigns — but no system connecting spend to enquiry to walk-in to revenue.",
  },
  {
    Icon: LayoutIcon,
    title: "Your agency sells you pretty creatives",
    body: "Reach, impressions and a beautifully designed grid look great in a report. But followers don't pay your clinic's rent — patients do.",
  },
  {
    Icon: TrendingDownIcon,
    title: "Enquiries come in, patients don't show up",
    body: "No follow-up system, no front-desk conversion tracking — most enquiries quietly die in a WhatsApp chat nobody replied to.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="relative border-t border-line py-[88px]">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        {/* Left column pins while the card column scrolls past it. Sticky needs
            an `items-start` grid so the column box doesn't stretch full height. */}
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* 72px sticky SiteHeader + 32px of air */}
          <div className="lg:sticky lg:top-[104px]">
            <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
              The uncomfortable truth
            </span>
            <h2 className="font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
              Your Reels Are Getting Views. Your OPD Isn&apos;t Getting Fuller.
            </h2>
            <p className="mt-4 max-w-[520px] text-[1.05rem] leading-[1.65] text-dim">
              Most clinics don&apos;t actually have a marketing problem. They
              have a patient-tracking problem — money goes into ads,
              &ldquo;engagement&rdquo; comes out, and nobody can tell you what a
              single rupee actually returned in booked patients.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {PAINS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-5 rounded-[16px] border border-line bg-surface p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(255,107,107,0.25)] bg-danger-wash text-danger">
                  <Icon className="h-[22px] w-[22px] shrink-0" />
                </div>
                <div>
                  <h3 className="mb-1.5 font-display text-[1.15rem] font-semibold leading-[1.12] tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="text-[0.98rem] leading-[1.6] text-dim">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
