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
    <section id="team" className="relative border-t border-line py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-12">
          <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-gold">
            Who&apos;s behind this
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            Meet Soma Arunagiri — Founder, Grow Medico
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 min-[820px]:grid-cols-[280px_1fr]">
          <div>
            <div className="mx-auto flex h-[180px] w-[180px] items-center justify-center rounded-full bg-[linear-gradient(160deg,var(--color-brand),var(--color-gold))] font-display text-[3rem] font-bold text-[#08110D]">
              SA
            </div>
            <div className="mt-5 text-center font-display text-[1.4rem] font-semibold leading-[1.12] tracking-[-0.01em]">
              Soma Arunagiri
            </div>
            <div className="mt-0.5 text-center text-[0.9rem] text-faint">
              Founder, Grow Medico
            </div>
          </div>

          <div>
            <p className="text-base leading-[1.7] text-dim">
              Soma Arunagiri built Grow Medico on one rule: healthcare marketing
              should be judged the way a doctor judges treatment — by outcomes,
              not activity. Working only with clinics, hospitals and healthcare
              brands across India, Grow Medico has seen every version of
              &ldquo;we post reels but nobody&apos;s booking appointments&rdquo;
              — and built a process specifically to fix it.
            </p>

            <ul className="mt-[22px] grid gap-[11px]">
              {CREDENTIALS.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.94rem] text-ink">
                  <CheckIcon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>

            <blockquote className="mt-[26px] rounded-r-xl border-l-[3px] border-gold bg-gold-wash px-[22px] py-5 text-base leading-[1.6] text-ink italic">
              &ldquo;Doctors don&apos;t need another agency promising more
              followers. They need someone who can point at a number and say,
              &lsquo;here&apos;s what your ad spend actually produced.&rsquo;
              That&apos;s the only thing we&apos;ve built here.&rdquo;
              <footer className="mt-2.5 text-[0.85rem] text-faint not-italic">
                — Soma Arunagiri, Founder
              </footer>
            </blockquote>

            <div className="mt-9 grid grid-cols-3 gap-[14px]">
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
    <div className="rounded-[10px] border border-line px-2 py-[18px] text-center">
      <div className="font-display text-[1.5rem] font-bold text-gold">
        {children}
      </div>
      <div className="mt-1 text-[0.75rem] text-faint">{label}</div>
    </div>
  );
}
