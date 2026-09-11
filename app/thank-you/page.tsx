import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import PageShell from "@/components/layout/PageShell";
import { ctaClass } from "@/components/ui/CtaButton";
import { ClockIcon } from "@/components/ui/Icons";
import { formatIST, formatPaise } from "@/lib/format";
import { isPaid, syncOrderFromRazorpay } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { SESSION_PRICE_LABEL, SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank you — Grow Medico",
  robots: { index: false, follow: false },
};

type PaymentWithLead = Prisma.PaymentGetPayload<{ include: { lead: true } }>;

const findPayment = (orderId: string) =>
  prisma.payment.findUnique({ where: { razorpayOrderId: orderId }, include: { lead: true } });

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string | string[] }>;
}) {
  const { order } = await searchParams;
  const orderId = typeof order === "string" ? order.slice(0, 64) : "";

  let payment = orderId ? await findPayment(orderId) : null;

  // There's no webhook, so if the browser's verify call never landed, ask
  // Razorpay directly before showing "confirming".
  if (payment && !isPaid(payment.status)) {
    const synced = await syncOrderFromRazorpay(payment.razorpayOrderId).catch((err) => {
      console.error("[thank-you] Razorpay sync failed:", err instanceof Error ? err.message : err);
      return null;
    });
    if (synced) payment = await findPayment(orderId);
  }

  return (
    <PageShell>
      <section className="relative overflow-hidden pt-8 pb-16 min-[860px]:pt-12 min-[860px]:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[220px] left-1/2 h-[480px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(22,212,146,0.14),transparent_72%)]"
        />
        <div className="relative mx-auto w-full max-w-[640px] px-6 text-center">
          {payment && isPaid(payment.status) ? (
            <Confirmed payment={payment} />
          ) : payment ? (
            <Pending payment={payment} />
          ) : (
            <Generic />
          )}
        </div>
      </section>
    </PageShell>
  );
}

const NEXT_STEPS = (phone: string) => [
  {
    title: "We call you to fix your slot",
    body: `Our strategist will reach you on WhatsApp or a call at +91 ${phone} within one working day.`,
  },
  {
    title: "We study your clinic",
    body: "Before the call we review your clinic, specialty and current ads, so the session starts with answers.",
  },
  {
    title: "You walk out with your roadmap",
    body: "Your Revenue Leak Audit, 90-day growth roadmap and ROAS projection.",
  },
];

function Confirmed({ payment }: { payment: PaymentWithLead }) {
  const receipt: [string, string][] = [
    ["Amount paid", formatPaise(payment.amount, payment.currency)],
    ["Payment ID", payment.razorpayPaymentId ?? "—"],
    ["Order ID", payment.razorpayOrderId],
    ["Paid on", formatIST(payment.paidAt ?? payment.updatedAt)],
  ];

  return (
    <>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(22,212,146,0.35)] bg-brand-wash text-brand">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>

      <span className="mt-5 inline-block text-[0.85rem] font-semibold text-brand">
        Booking confirmed
      </span>
      <h1 className="mt-2 font-display text-[clamp(1.9rem,3vw_+_1rem,2.7rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
        Thank you, {payment.lead.name}!
      </h1>
      <p className="mx-auto mt-3 max-w-[520px] text-[1.02rem] leading-[1.65] text-dim">
        Your {SESSION_PRICE_LABEL} payment is received and your Revenue Strategy
        Session is locked in.
      </p>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line text-left min-[520px]:grid-cols-2">
        {receipt.map(([label, value]) => (
          <div key={label} className="bg-surface px-5 py-4">
            <dt className="text-[0.75rem] text-faint">{label}</dt>
            <dd className="mt-0.5 break-all text-[0.92rem] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-[18px] border border-line bg-surface p-6 text-left">
        <h2 className="font-display text-[1.05rem] font-semibold">What happens next</h2>
        <ol className="mt-4 grid gap-4">
          {NEXT_STEPS(payment.lead.phone).map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="font-display text-[1.4rem] leading-none font-bold text-brand">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold text-ink">{step.title}</div>
                <p className="mt-1 text-[0.9rem] text-dim">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 text-[0.84rem] text-faint">
        Questions? Email{" "}
        <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
          {SITE.email}
        </a>{" "}
        with your payment ID.
      </p>

      <Link href="/" className={ctaClass({ variant: "ghost", size: "sm", className: "mt-6" })}>
        Back to home
      </Link>
    </>
  );
}

function Pending({ payment }: { payment: PaymentWithLead }) {
  const failed = payment.status === "FAILED";

  return (
    <>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(242,184,75,0.35)] bg-gold-wash text-gold">
        <ClockIcon className="h-8 w-8" />
      </div>

      <h1 className="mt-6 font-display text-[clamp(1.8rem,2.6vw_+_1rem,2.4rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
        {failed ? "Your payment didn't go through" : "We're confirming your payment"}
      </h1>
      <p className="mx-auto mt-3 max-w-[520px] text-[1rem] leading-[1.65] text-dim">
        {failed
          ? `${payment.errorReason ?? "The payment failed."} If any amount was deducted, it is refunded to you automatically. You can try again below.`
          : "This usually takes under a minute. If money was deducted from your account, your booking is confirmed automatically — refresh this page shortly."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {!failed && (
          <Link
            href={`/thank-you?order=${encodeURIComponent(payment.razorpayOrderId)}`}
            className={ctaClass({})}
          >
            Refresh status
          </Link>
        )}
        <Link
          href={`/payment/${payment.leadId}`}
          className={ctaClass({ variant: failed ? "primary" : "ghost" })}
        >
          {failed ? "Try payment again" : "Back to payment"}
        </Link>
      </div>

      <p className="mt-6 text-[0.84rem] text-faint">
        Order ID: <span className="font-mono text-dim">{payment.razorpayOrderId}</span>
        <br />
        Need help? Email{" "}
        <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
          {SITE.email}
        </a>
        .
      </p>
    </>
  );
}

function Generic() {
  return (
    <>
      <h1 className="font-display text-[clamp(1.9rem,3vw_+_1rem,2.7rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
        Thank you!
      </h1>
      <p className="mx-auto mt-3 max-w-[520px] text-[1.02rem] leading-[1.65] text-dim">
        If you&apos;ve just booked your session, our team will be in touch within
        one working day. For anything else, email{" "}
        <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
          {SITE.email}
        </a>
        .
      </p>
      <Link href="/" className={ctaClass({ size: "sm", className: "mt-8" })}>
        Back to home
      </Link>
    </>
  );
}
