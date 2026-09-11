import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The ₹199 Revenue Strategy Session — Grow Medico",
  description:
    "A 45-minute 1:1 session for doctors and clinic owners: we audit where your ad spend is leaking, then hand you a 90-day roadmap and ROAS projection built for your clinic.",
  openGraph: {
    type: "website",
    title: "The ₹199 Revenue Strategy Session — Grow Medico",
    description:
      "For doctors & clinic owners: a Revenue Leak Audit + 90-Day Growth Roadmap + ROAS Projection, built around your clinic.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSans.variable}`}
    >
      <body className="min-h-full overflow-x-hidden bg-bg font-body text-base leading-[1.6] text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
