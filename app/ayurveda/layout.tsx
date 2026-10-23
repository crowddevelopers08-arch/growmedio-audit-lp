import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Free Strategy Session for Ayurveda Clinics | Grow Medico",
  description:
    "Spending ₹5 Lakhs a month on ads? A free one-on-one strategy session to build your Ayurveda clinic.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

/* Mirrors the <body> of the standalone ayurveda funnel; tokens are the `ay-` set in app/globals.css. */
export default function AyurvedaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
        precedence="default"
      />
      <div
        data-ayurveda
        className="min-h-dvh overflow-x-clip bg-ay-bg bg-[radial-gradient(ellipse_at_50%_40%,#0C1D13_0%,#050A07_70%)] bg-fixed font-ay text-[17px] leading-[1.6] text-ay-fg antialiased max-[560px]:text-[16px]"
      >
        {children}
      </div>
    </>
  );
}
