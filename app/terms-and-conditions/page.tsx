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
  title: "Terms & Conditions — Grow Medico",
  description:
    "The terms that apply when you book and attend a Grow Medico Revenue Strategy Session.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={
        <>
          These terms apply when you book, pay for or attend the {SITE.price}{" "}
          Revenue Strategy Session offered by {SITE.name}. Booking a session
          means you accept them. Please read them before you pay.
        </>
      }
    >
      <Section title="1. Who we are">
        <p>
          This website and the Revenue Strategy Session are operated by{" "}
          <strong>
            <Fill value={LEGAL.entityName} label="registered business name" />
          </strong>
          , trading as {SITE.name}, with its registered address at{" "}
          <Fill value={LEGAL.address} label="registered address" />.
        </p>
        <p>
          In these terms, &ldquo;we&rdquo; and &ldquo;us&rdquo; means that
          business, and &ldquo;you&rdquo; means the person booking a session.
        </p>
      </Section>

      <Section title="2. Who can book">
        <p>
          Sessions are intended for doctors, clinic owners, hospital
          administrators and healthcare businesses. You must be at least 18
          years old and able to enter into a contract. If you book on behalf of
          a clinic or company, you confirm you are authorised to do so.
        </p>
      </Section>

      <Section title="3. What the session includes">
        <p>
          The session is a one-to-one consultation delivered remotely by phone
          or video call, covering a review of your current patient-acquisition
          activity, the revenue leaks we identify in it, and a practical
          roadmap for addressing them.
        </p>
        <ul>
          <li>
            After payment you select an available slot and receive a
            confirmation along with a short pre-call form.
          </li>
          <li>
            A strategist will contact you on the mobile number you provide, by
            call or WhatsApp, to confirm and conduct the session.
          </li>
          <li>
            Any figures, projections or benchmarks discussed are estimates based
            on the information you provide and on comparable campaigns. They are
            not a forecast of your results.
          </li>
        </ul>
      </Section>

      <Section title="4. Fees and payment">
        <p>
          The fee is the amount shown at checkout, payable in advance. Payments
          are processed by Razorpay; we do not receive or store your card
          number, CVV, UPI PIN or net-banking credentials. Your booking is
          confirmed only once payment succeeds.
        </p>
        {LEGAL.gstin && <p>GSTIN: {LEGAL.gstin}.</p>}
      </Section>

      <Section title="5. Rescheduling, cancellation and refunds">
        <p>
          You get {POLICY.freeReschedules === 1 ? "one" : POLICY.freeReschedules}{" "}
          free reschedule. Cancellation rights, the{" "}
          {SITE.price}-back guarantee and how refunds are processed are set out
          in full in our{" "}
          <Link
            href="/cancellation-and-refund-policy"
            className="text-brand underline underline-offset-4"
          >
            Cancellation &amp; Refund Policy
          </Link>
          , which forms part of these terms.
        </p>
      </Section>

      <Section title="6. What we do not promise">
        <p>
          We provide marketing advice, not a guaranteed outcome. We do not
          promise any particular number of enquiries, appointments, patients,
          revenue or return on ad spend. Results shown elsewhere on this site
          are from specific client campaigns and depend on specialty, market,
          offer, budget and execution — yours may differ.
        </p>
        <p>
          Nothing in the session is medical, legal, financial or tax advice.
          Decisions you take after the session, and compliance with advertising
          rules that apply to your practice, remain yours.
        </p>
      </Section>

      <Section title="7. Your responsibilities">
        <ul>
          <li>
            Give accurate contact and clinic information, so we can reach you
            and prepare properly.
          </li>
          <li>
            Share access or data only for accounts you own or are authorised to
            share.
          </li>
          <li>
            Attend at the agreed time, or reschedule in line with the refund
            policy.
          </li>
        </ul>
      </Section>

      <Section title="8. Confidentiality">
        <p>
          What you share with your strategist — campaign data, account figures,
          plans — stays between you and us. We will not publish it or pass it on
          outside your session, except where the law requires. We ask the same
          of you regarding the material we share with you.
        </p>
      </Section>

      <Section title="9. Intellectual property">
        <p>
          The audit, roadmap and any notes we prepare are for your clinic&apos;s
          own internal use. You may not resell them or publish them as your own.
          Everything on this website — text, design, logos and results data —
          belongs to us and may not be copied or reproduced without permission.
        </p>
      </Section>

      <Section title="10. Third parties">
        <p>
          Payments are handled by Razorpay under its own terms. This site is
          independently run and is not affiliated with, endorsed by or sponsored
          by Meta&trade;, Instagram&trade;, Google or any other platform we may
          discuss.
        </p>
      </Section>

      <Section title="11. Limitation of liability">
        <p>
          To the extent permitted by law, our total liability arising out of a
          session is limited to the fee you paid for it. We are not liable for
          indirect or consequential losses, including lost profits, lost
          bookings or business interruption. Nothing here limits liability that
          cannot be limited by law.
        </p>
      </Section>

      <Section title="12. Changes">
        <p>
          We may update these terms from time to time. The version published
          when you book is the one that applies to your booking; the &ldquo;Last
          updated&rdquo; date above shows when this version took effect.
        </p>
      </Section>

      <Section title="13. Governing law">
        <p>
          These terms are governed by and construed in accordance with the laws
          of India. Any dispute arising out of them is subject to the exclusive
          jurisdiction of the courts having jurisdiction over our registered
          address, as given in section 1.
        </p>
      </Section>

      <Section title="14. Contact us">
        <p>
          Questions about these terms, or about a booking:
          <br />
          Email: <EmailLink />
          <br />
          Phone: <PhoneLink />
        </p>
        <p>
          How we handle your personal data is covered separately in our{" "}
          <Link
            href="/privacy-policy"
            className="text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
