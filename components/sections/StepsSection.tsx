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
    <section className="relative border-t border-line bg-bg-alt py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-12">
          <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
            Dead simple
          </span>
          <h2 className="max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            From ₹299 To Your Growth Roadmap In 3 Steps
          </h2>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-0 min-[800px]:grid-cols-3 min-[800px]:gap-[22px]">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative border-t border-line py-7 min-[800px]:border-t-0 min-[800px]:py-0"
            >
              <div className="font-display text-[2.1rem] font-bold text-brand opacity-90">
                {step.num}
              </div>
              <h3 className="mt-2.5 font-display text-[1.1rem] font-semibold leading-[1.12] tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[280px] text-[0.92rem] text-dim">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
