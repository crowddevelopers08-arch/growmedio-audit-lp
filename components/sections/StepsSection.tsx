const STEPS = [
  {
    num: "1",
    title: "Book & lock your slot",
    body: "Secure checkout, takes under a minute — UPI, card, anything.",
  },
  {
    num: "2",
    title: "Pick your time",
    body: "Choose a convenient slot instantly. We study your clinic and current ads before the call.",
  },
  {
    num: "3",
    title: "Walk out with your roadmap",
    body: "Leave with your Revenue Leak Audit and 90-day plan — implement it yourself, or let us run it.",
  },
];

export default function StepsSection() {
  return (
    <section className="relative border-t border-line bg-bg-alt py-12 md:py-16 lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-6 md:mb-12">
          <span className="mb-2.5 inline-block text-[0.85rem] font-semibold text-brand md:mb-[14px]">
            Dead simple
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            From ₹199 To Your Growth Roadmap In 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-0 min-[800px]:mt-3 min-[800px]:grid-cols-3 min-[800px]:gap-[22px]">
          {STEPS.map((step) => (
            // On phones the number sits beside its step instead of above it.
            <div
              key={step.num}
              className="relative flex gap-4 border-t border-line py-5 min-[800px]:block min-[800px]:border-t-0 min-[800px]:py-0"
            >
              <div className="w-7 shrink-0 font-display text-[1.75rem] leading-none font-bold text-brand opacity-90 min-[800px]:w-auto min-[800px]:text-[2.1rem] min-[800px]:leading-normal">
                {step.num}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[1.1rem] font-semibold leading-[1.15] tracking-[-0.01em] min-[800px]:mt-2.5">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[0.92rem] text-dim min-[800px]:mt-2 min-[800px]:max-w-[280px]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
