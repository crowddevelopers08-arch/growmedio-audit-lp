import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, {
  EmailLink,
  Fill,
  PhoneLink,
  Section,
} from "@/components/legal/LegalPage";
import { LEGAL, LEGAL_LAST_UPDATED, POLICY } from "@/lib/legal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — Grow Medico",
  description:
    "How to cancel or reschedule a Grow Medico Revenue Strategy Session, how the ₹199-back guarantee works, and how refunds are processed.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={
        <>
          This policy covers the {SITE.price} Revenue Strategy Session: how to
          cancel or reschedule, when you are entitled to your money back, and
          how long a refund takes to reach you. It forms part of our{" "}
          <Link
            href="/terms-and-conditions"
            className="text-brand underline underline-offset-4"
          >
            Terms &amp; Conditions
          </Link>
          .
        </>
      }
    >
      <Section title={`1. The ${SITE.price}-back guarantee`}>
        <p>
          If you finish your session without at least{" "}
          {POLICY.guaranteedOpportunities} concrete revenue opportunities for
          your clinic, tell us and we refund your fee in full. No forms, no
          back-and-forth.
        </p>
        <ul>
          <li>
            Say so on the call itself, or write to us within{" "}
            {POLICY.guaranteeWindowDays} days of your session.
          </li>
          <li>
            You do not need to justify the decision. We may ask what fell short,
            but only so we can improve — the refund does not depend on your
            answer.
          </li>
        </ul>
      </Section>

      <Section title="2. Rescheduling">
        <p>
          You get {POLICY.freeReschedules === 1 ? "one" : POLICY.freeReschedules}{" "}
          free reschedule, no questions asked, and the guarantee above still
          applies to the rescheduled session. Let us know before your slot
          begins and we will move it to a time that suits you.
        </p>
      </Section>

      <Section title="3. Cancelling before your session">
        <p>
          Cancel at least {POLICY.cancellationNoticeHours} hours before your
          booked slot and we refund your fee in full.
        </p>
        <p>
          Inside {POLICY.cancellationNoticeHours} hours, your strategist has
          usually already done the preparation work, so we would normally move
          you to a new slot rather than refund. If you would still prefer a
          refund, ask — we would rather settle it than argue over{" "}
          {SITE.price}.
        </p>
      </Section>

      <Section title="4. If we cancel or reschedule">
        <p>
          If we have to move your session, we will offer you the next available
          slot. If that does not work for you, or if we cannot deliver your
          session at all, you get a full refund without needing to ask.
        </p>
      </Section>

      <Section title="5. How to request a refund">
        <p>
          Email <EmailLink /> or call <PhoneLink /> from the number you booked
          with. Include the name and mobile number used at
          booking so we can find your payment.
        </p>
        <p>
          We acknowledge refund requests within 2 working days and approve or
          respond to them within 5 working days.
        </p>
      </Section>

      <Section title="6. How refunds are processed">
        <p>
          Approved refunds are returned through Razorpay to the original payment
          method — the same card, UPI ID or account you paid from. We cannot
          refund to a different method.
        </p>
        <p>
          Once approved, the amount typically reaches you within{" "}
          {POLICY.refundProcessingDays} working days, depending on your bank.
          The full fee is refunded; we do not deduct a processing charge.
        </p>
      </Section>

      <Section title="7. Contact us">
        <p>
          <Fill value={LEGAL.entityName} label="registered business name" />,{" "}
          <Fill value={LEGAL.address} label="registered address" />
          <br />
          Email: <EmailLink />
          <br />
          Phone: <PhoneLink />
        </p>
      </Section>
    </LegalPage>
  );
}
