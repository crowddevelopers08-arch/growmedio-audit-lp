import { TOTALS, count, crores, roasOf } from "@/lib/results";
import { CheckIcon } from "@/components/ui/Icons";

const CREDENTIALS = [
  "Every audit benchmarked against a live spend → patient dashboard, not guesswork",
  "Creative, targeting and offer reviewed against what's actually working right now — not a template from last year",
  "Strategy built around your specialty, city and patient journey — never a copy-paste template",
  "The tracker you saw above is our real scoreboard, not a highlight reel",
];

export default function FounderSection() {
  return (
    <section id="team" className="relative border-t border-line py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-6 md:mb-12">
          <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-gold md:mb-[14px]">
            Who&apos;s behind this
          </span>
          {/* Phones break the line after the name rather than mid-title, and
              "Co-Founder" is kept whole so it never splits at its hyphen. */}
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            <span className="block min-[640px]:inline">Meet Soma Arunagiri</span>
            <span className="hidden min-[640px]:inline"> — </span>
            <span className="block min-[640px]:inline">
              <span className="whitespace-nowrap">Co-Founder</span>, Grow Medico
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 min-[820px]:grid-cols-[400px_1fr] min-[820px]:gap-8 min-[1024px]:grid-cols-[480px_1fr] min-[1024px]:gap-10">
          {/* Portrait with the name centred below it at every width; from
              820px it becomes the left column beside the bio. */}
          <div className="pt-2 min-[820px]:pt-0">
            {/* No fixed aspect ratio and no crop — the portrait keeps its own
                proportions so the whole photo is visible at every width. */}
            <img
              src="/soma-new.png"
              alt="Soma Arunagiri, Co-Founder of Grow Medico"
              className="mx-auto block h-auto w-full max-w-[400px] rounded-2xl min-[820px]:max-w-none min-[820px]:w-[340px] min-[1024px]:w-[420px]"
            />
            <div className="mt-4 text-center min-[820px]:mt-5">
              <div className="font-display text-[1.25rem] font-semibold leading-[1.12] tracking-[-0.01em] min-[820px]:text-[1.4rem]">
                Soma Arunagiri
              </div>
              <div className="mt-0.5 text-[0.9rem] text-faint">
                Co-Founder, Grow Medico
              </div>
            </div>
          </div>

          <div>
            <p className="text-[0.98rem] leading-[1.7] text-dim md:text-base">
              Soma Arunagiri built Grow Medico on one rule: healthcare marketing
              should be judged the way a doctor judges treatment — by outcomes,
              not activity. Working only with clinics, hospitals and healthcare
              brands across India, Grow Medico has seen every version of
              &ldquo;we post reels but nobody&apos;s booking appointments&rdquo;
              — and built a process specifically to fix it.
            </p>

            <ul className="mt-4 grid gap-2.5 md:mt-[22px] md:gap-[11px]">
              {CREDENTIALS.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.94rem] text-ink">
                  <CheckIcon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>

            <blockquote className="mt-5 rounded-r-xl border-l-[3px] border-gold bg-gold-wash px-4 py-4 text-[0.98rem] leading-[1.6] text-ink italic md:mt-[26px] md:px-[22px] md:py-5 md:text-base">
              &ldquo;Doctors don&apos;t need another agency promising more
              followers. They need someone who can point at a number and say,
              &lsquo;here&apos;s what your ad spend actually produced.&rsquo;
              That&apos;s the only thing we&apos;ve built here.&rdquo;
              <footer className="mt-2 text-[0.85rem] text-faint not-italic md:mt-2.5">
                — Soma Arunagiri, Co-Founder
              </footer>
            </blockquote>

            <div className="mt-5 grid grid-cols-3 gap-2 min-[400px]:gap-3 md:mt-9 md:gap-[14px]">
              <FounderStat label="Patient enquiries generated">
                {count(TOTALS.enquiries)}
              </FounderStat>
              <FounderStat label="Average ROAS delivered">
                {roasOf(TOTALS).toFixed(1)}x
              </FounderStat>
              <FounderStat label="Patient revenue generated">
                ₹{Math.floor(crores(TOTALS.revenue))} Cr+
              </FounderStat>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderStat({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="min-w-0 rounded-[10px] border border-line px-1.5 py-3 text-center md:px-2 md:py-[18px]">
      <div className="font-display text-[1.2rem] font-bold text-gold min-[400px]:text-[1.35rem] md:text-[1.5rem]">
        {children}
      </div>
      <div className="mt-1 text-[0.72rem] leading-snug text-faint md:text-[0.75rem]">{label}</div>
    </div>
  );
}