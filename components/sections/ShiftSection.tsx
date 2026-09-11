import { CheckIcon, MinusIcon, XIcon } from "@/components/ui/Icons";

const DOING_NOW = [
  "Success measured in likes, reach and followers",
  "A monthly report full of impressions, not appointments",
  "No cost-per-enquiry or cost-per-patient tracking",
  "Ads boosted with no targeting or offer strategy",
  "No real idea what one new patient costs you",
];

const AUDIT_CHECKS = [
  "Whether success is measured in booked appointments — not just likes and reach",
  "Whether every rupee is tracked: Spend → Enquiry → Walk-in → Revenue",
  "Whether your offer and pricing were tested before ads went live",
  "Whether your creative is stale, or genuinely refreshed on a real cadence",
  "Whether you even have a tracker you could open and check today",
];

export default function ShiftSection() {
  return (
    <section className="relative border-t border-line bg-bg-alt py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-12">
          <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
            The shift
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            Stop Buying Reach. Start Buying Patients.
          </h2>
          <p className="mt-4 max-w-[600px] text-[1.05rem] leading-[1.65] text-dim">
            We&apos;re not pitching &ldquo;revenue-first marketing&rdquo; as a
            service — we audit your account against it. Every creative, every
            campaign and every rupee gets checked against one number: patients
            booked. It&apos;s the same checklist we run on your call.
          </p>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 min-[800px]:grid-cols-2">
          {/* What most clinics are doing */}
          <div className="rounded-[16px] border border-[rgba(255,107,107,0.2)] bg-danger-wash px-[26px] py-[30px]">
            <h4 className="mb-[18px] flex items-center gap-2 font-display text-base font-bold leading-[1.12] tracking-[-0.01em] text-danger">
              <XIcon className="inline h-4 w-4 align-[-2px]" /> What most clinics
              are doing
            </h4>
            <ul>
              {DOING_NOW.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 py-[9px] text-[0.95rem] text-dim"
                >
                  <MinusIcon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-danger" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What your audit checks for */}
          <div className="rounded-[16px] border border-[rgba(22,212,146,0.25)] bg-brand-wash px-[26px] py-[30px]">
            <h4 className="mb-[18px] flex items-center gap-2 font-display text-base font-bold leading-[1.12] tracking-[-0.01em] text-brand">
              <CheckIcon className="inline h-4 w-4 align-[-2px]" /> What your
              audit checks for
            </h4>
            <ul>
              {AUDIT_CHECKS.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 py-[9px] text-[0.95rem] text-ink"
                >
                  <CheckIcon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
