import Link from "next/link";
import Logo from "@/components/ui/Logo";

const FOOTER_LINKS = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-and-conditions", label: "Terms" },
  { href: "/cancellation-and-refund-policy", label: "Cancellation & Refunds" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-alt pt-10 pb-8 min-[900px]:pt-14 min-[900px]:pb-14">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="flex flex-wrap justify-between gap-7 pb-7">
          <div>
            <Logo height={52} />
            <p className="mt-3 max-w-[320px] text-[0.88rem] text-faint">
              Revenue-first marketing for clinics and hospitals across India.
            </p>
          </div>

          <div className="flex flex-wrap gap-[22px] text-[0.88rem] text-dim">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-[22px] text-[0.78rem] leading-[1.7] text-faint">
          Results shown are from Grow Medico client campaigns and are not a
          guarantee of results. Actual outcomes
          depend on your specialty, market, offer and execution. This page is
          independently run and is not affiliated with or endorsed by Meta™ or
          Instagram™.
          <br />
          <br />© 2026 Grow Medico. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
