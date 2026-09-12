import type { Metadata } from "next";
import LegalPage, { Section } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Grow Medico",
  description:
    "How Grow Medico collects, uses and protects the information you share when booking a Revenue Strategy Session.",
};

const LAST_UPDATED = "11 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <>
          {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs this website and
          the ₹199 Revenue Strategy Session. This policy explains what
          information we collect when you book a session, why we collect it, who
          we share it with, and the choices you have.
        </>
      }
    >
      <Section title="1. Information we collect">
        <p>When you book a session, we collect:</p>
        <ul>
          <li>
            <strong>Booking details you enter</strong> — your name and your
            WhatsApp / mobile number. That is all the booking form asks for.
          </li>
          <li>
            <strong>Payment information</strong> — payments are processed by
            Razorpay. We receive the order and payment IDs, amount, payment
            status, payment method type (for example UPI or card) and the email
            and phone number used at checkout. We never see or store your full
            card number, CVV, UPI PIN or net-banking credentials.
          </li>
          <li>
            <strong>Technical information</strong> — the page you booked from,
            and standard server logs (such as IP address and browser type) kept
            by our hosting provider for security.
          </li>
        </ul>
      </Section>

      <Section title="2. How we use your information">
        <ul>
          <li>To confirm your booking and schedule your session.</li>
          <li>To contact you by phone, WhatsApp or email about your session.</li>
          <li>To prepare for your call with a strategist.</li>
          <li>
            To process payments and refunds, including our ₹199-back guarantee.
          </li>
          <li>
            To keep records required for accounting, tax and legal purposes, and
            to prevent fraud.
          </li>
        </ul>
        <p>
          We do not sell your personal information, and we do not use it for
          unrelated marketing without your consent.
        </p>
      </Section>

      <Section title="3. Who we share it with">
        <ul>
          <li>
            <strong>Razorpay</strong>, to process your payment securely.
            Razorpay handles your payment data under its own privacy policy.
          </li>
          <li>
            <strong>TeleCRM</strong>, the customer-management system where your
            enquiry is stored so our team can contact you about your session.
          </li>
          <li>
            <strong>Calendly</strong>, which runs the booking calendar you use
            to pick your session time, under its own privacy policy.
          </li>
          <li>
            <strong>Our hosting provider</strong>, which serves this website and
            may not use your information for any other purpose.
          </li>
          <li>
            <strong>Authorities</strong>, where we are required to by law.
          </li>
        </ul>
      </Section>

      <Section title="4. How we store and protect it">
        <p>
          Your enquiry is held in TeleCRM, accessible only to our team; we keep
          no separate database of our own. Our website uses HTTPS, and payments
          run through Razorpay&apos;s PCI-DSS compliant checkout. No method of storage or transmission is completely
          secure, but we take reasonable steps to protect your information.
        </p>
      </Section>

      <Section title="5. How long we keep it">
        <p>
          We keep booking details for as long as needed to deliver your session
          and any follow-up you ask for. Payment records are kept for as long as
          Indian tax and accounting laws require. You can ask us to delete
          information we are not legally required to keep.
        </p>
      </Section>

      <Section title="6. Your rights">
        <p>
          Under India&apos;s Digital Personal Data Protection Act, 2023, you can
          ask to access, correct, update or erase your personal data, withdraw
          your consent, and raise a grievance about how your data is handled. To
          make a request, raise it with the {SITE.name} strategist who contacts
          you about your session. We will respond as soon as reasonably possible
          and within the time the law requires.
        </p>
      </Section>

      <Section title="7. Cookies">
        <p>
          This site does not use advertising or analytics cookies. Razorpay may
          set cookies during checkout under its own policy.
        </p>
      </Section>

      <Section title="8. Who this service is for">
        <p>
          Our sessions are for doctors, clinic owners and healthcare businesses.
          The site is not intended for anyone under 18.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          We may update this policy from time to time. The &ldquo;Last
          updated&rdquo; date at the top shows when it last changed.
        </p>
      </Section>
    </LegalPage>
  );
}
