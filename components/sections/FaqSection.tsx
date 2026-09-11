import { ChevronDownIcon } from "@/components/ui/Icons";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Why ₹299 and not free?",
    a: "Because clinic owners who invest even ₹299 show up serious, and serious conversations are where real progress happens. Some attendees later work with us on the full 90-day rollout — most just take the roadmap and run with it. Either way, you walk out ahead.",
  },
  {
    q: "Is this secretly a sales pitch for your agency?",
    a: "No. We mainly work as ad-account auditors — the session is built around a Revenue Leak Audit, a 90-day roadmap, and a ROAS projection for your account specifically. We're not on the call to sign you up for anything. If a deeper engagement genuinely fits your clinic, we'll mention it briefly at the end. If it doesn't, we'll tell you that too.",
  },
  {
    q: "I already have a marketing person or agency — is this still useful?",
    a: "Usually, yes. We'll audit your real numbers against what similar clinics in your specialty and city are achieving. Most owners find at least two or three leaks in the first twenty minutes.",
  },
  {
    q: "Do you only work with certain specialties?",
    a: "We work across dermatology, dental, ortho, IVF & fertility, cosmetic and aesthetic, diagnostics, multi-specialty hospitals and more. If patients search for you online, revenue-first marketing applies to your specialty.",
  },
  {
    q: "What happens right after I book?",
    a: "You'll pick a slot instantly on the booking page, then get a confirmation with a short pre-call form — so we arrive on the call already familiar with your clinic, not learning about it live.",
  },
  {
    q: "Is my clinic's data and ad account information confidential?",
    a: "Yes. Anything you share with your strategist stays between you and Grow Medico — we don't share client data, campaigns or numbers outside your session.",
  },
  {
    q: "What if I need to reschedule?",
    a: "One free reschedule, no questions asked — and the ₹299-back guarantee still applies.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="relative border-t border-line py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mx-auto mb-12 text-center">
          <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
            Before you ask
          </span>
          <h2 className="mx-auto max-w-[720px] font-display text-[clamp(1.7rem,3.2vw_+_0.9rem,2.6rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
            Questions Every Doctor Asks Before Booking
          </h2>
        </div>

        <div className="mx-auto max-w-[760px]">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border-b border-line">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-1 py-[22px] text-[1.02rem] font-semibold">
                {faq.q}
                <ChevronDownIcon className="h-[19px] w-[19px] shrink-0 text-faint transition-transform duration-200 group-open:rotate-180 group-open:text-brand" />
              </summary>
              <div className="max-w-[640px] px-1 pb-6 text-[0.96rem] leading-[1.65] text-dim">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
