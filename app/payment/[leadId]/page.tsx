import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import PayButton from "@/components/payment/PayButton";
import { CheckIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";
import { PAID_STATUSES } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { SESSION_PRICE_LABEL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete your booking — Grow Medico",
  robots: { index: false, follow: false },
};

const INCLUDED = [
  "45-minute 1:1 Revenue Strategy Session",
  "Revenue Leak Audit of your ad account",
  "Your 90-Day Growth Roadmap",
  "ROAS projection for your clinic",
];

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { payments: { where: { status: { in: PAID_STATUSES } }, take: 1 } },
  });
  if (!lead) notFound();

  // Already paid — e.g. they came back with the browser's back button.
  const paid = lead.payments[0];
  if (paid) redirect(`/thank-you?order=${encodeURIComponent(paid.razorpayOrderId)}`);

  const details: [string, string][] = [
    ["Name", lead.name],
    ["Mobile", `+91 ${lead.phone}`],
    ["Email", lead.email || "—"],
    ["Specialty", lead.specialty || "—"],
    ["City", lead.city || "—"],
  ];

  return (
    <PageShell>
      <section className="relative overflow-hidden pt-8 pb-12 md:pb-16 min-[860px]:pt-12 lg:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[220px] left-1/2 h-[480px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(22,212,146,0.12),transparent_72%)]"
        />

        <div className="relative mx-auto grid w-full max-w-[1000px] items-start gap-6 px-6 min-[860px]:grid-cols-[minmax(0,1fr)_390px] min-[860px]:gap-8">
          <div>
            <span className="text-[0.85rem] font-semibold text-brand">
              Step 2 of 2 · Payment
            </span>
            <h1 className="mt-2 font-display text-[clamp(1.8rem,2.6vw_+_1rem,2.5rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
              Almost there, {lead.name}
            </h1>
            <p className="mt-3 max-w-[520px] text-[1rem] leading-[1.65] text-dim">
              Your details are saved. Complete the {SESSION_PRICE_LABEL} payment to
              lock in your Revenue Strategy Session — our strategist will call you
              within one working day to fix your slot.
            </p>

            <div className="mt-6 rounded-[18px] border border-line bg-surface p-5 md:mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-[1rem] font-semibold">
                  Your booking details
                </h2>
                <Link href="/" className="text-[0.82rem] text-dim hover:text-brand">
                  Wrong details? Start again
                </Link>
              </div>
              <dl className="grid gap-x-6 gap-y-3 min-[520px]:grid-cols-2">
                {details.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[0.75rem] text-faint">{label}</dt>
                    <dd className="mt-0.5 break-words text-[0.95rem] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="mt-6 grid gap-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.94rem] text-ink">
                  <CheckIcon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-[22px] border border-line-strong bg-surface p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] md:p-6 min-[860px]:sticky min-[860px]:top-[96px]">
            <div className="border-b border-dashed border-line-strong pb-4 text-[0.75rem] tracking-[0.04em] text-faint">
              GROW MEDICO — ORDER SUMMARY
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-[0.95rem] text-dim">
              <span>Revenue Strategy Session</span>
              <span className="font-[family-name:'Courier_New',monospace] text-faint line-through">
                ₹13,996
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[1.05rem] font-bold">Pay today</span>
              <span className="font-[family-name:'Courier_New',monospace] text-[1.8rem] font-bold text-brand">
                {SESSION_PRICE_LABEL}
              </span>
            </div>

            <div className="mt-6">
              <PayButton leadId={lead.id} />
            </div>

            <div className="mt-4 grid gap-2 border-t border-line pt-4 text-[0.8rem] text-faint">
              <span className="inline-flex items-center gap-2">
                <LockIcon className="h-[14px] w-[14px] shrink-0 text-brand" />
                Secure checkout by Razorpay · UPI, cards, net banking
              </span>
              <span className="inline-flex items-start gap-2">
                <ShieldIcon className="mt-0.5 h-[14px] w-[14px] shrink-0 text-brand" />
                3 concrete revenue opportunities, or your {SESSION_PRICE_LABEL} back.
              </span>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
