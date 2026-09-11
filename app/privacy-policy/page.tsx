import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageShell from "@/components/layout/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Grow Medico",
  description:
    "How Grow Medico collects, uses and protects the information you share when booking a Revenue Strategy Session.",
};

const LAST_UPDATED = "11 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-[760px] px-6 pt-8 pb-[72px] min-[860px]:pt-12">
        <span className="mb-[14px] inline-block text-[0.85rem] font-semibold text-brand">
          Legal
        </span>
        <h1 className="font-display text-[clamp(1.9rem,3vw_+_1rem,2.8rem)] font-semibold leading-[1.12] tracking-[-0.01em]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-[0.9rem] text-faint">Last updated: {LAST_UPDATED}</p>

        <p className="mt-8 text-[1.02rem] leading-[1.75] text-dim">
          {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs this website and the
          ₹299 Revenue Strategy Session. This policy explains what information we
          collect when you book a session, why we collect it, who we share it
          with, and the choices you have.
        </p>

        <Section title="1. Information we collect">
          <p>When you book a session, we collect:</p>
          <ul>
            <li>
              <strong>Booking details you enter</strong> — your name, mobile
              number, email address (optional), city (optional) and medical
              specialty.
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
            <li>
              To contact you by phone, WhatsApp or email about your session.
            </li>
            <li>To prepare for your call with a strategist.</li>
            <li>
              To process payments and refunds, including our ₹299-back
              guarantee.
            </li>
            <li>
              To keep records required for accounting, tax and legal purposes,
              and to prevent fraud.
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
              <strong>Razorpay</strong>, to process your payment securely. Razorpay
              handles your payment data under its own privacy policy.
            </li>
            <li>
              <strong>Our hosting and database providers</strong>, which store
              booking records on our behalf and may not use them for any other
              purpose.
            </li>
            <li>
              <strong>Authorities</strong>, where we are required to by law.
            </li>
          </ul>
        </Section>

        <Section title="4. How we store and protect it">
          <p>
            Booking and payment records are stored in a secure cloud database.
            Our website uses HTTPS, and payments
            run through Razorpay&apos;s PCI-DSS compliant checkout. No method of
            storage or transmission is completely secure, but we take reasonable
            steps to protect your information.
          </p>
        </Section>

        <Section title="5. How long we keep it">
          <p>
            We keep booking details for as long as needed to deliver your session
            and any follow-up you ask for. Payment records are kept for as long
            as Indian tax and accounting laws require. You can ask us to delete
            information we are not legally required to keep.
          </p>
        </Section>

        <Section title="6. Your rights">
          <p>
            Under India&apos;s Digital Personal Data Protection Act, 2023, you can
            ask to access, correct, update or erase your personal data, withdraw
            your consent, and raise a grievance about how your data is handled.
            To make a request, email us at the address below. We will respond as
            soon as reasonably possible and within the time the law requires.
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
            Our sessions are for doctors, clinic owners and healthcare
            businesses. The site is not intended for anyone under 18.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            We may update this policy from time to time. The &ldquo;Last
            updated&rdquo; date at the top shows when it last changed.
          </p>
        </Section>

        <Section title="10. Contact us">
          <p>
            For privacy questions, data requests or grievances, email{" "}
            <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
              {SITE.email}
            </a>
            .
          </p>
        </Section>
      </article>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.01em]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.98rem] leading-[1.75] text-dim [&_li]:mt-2 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
