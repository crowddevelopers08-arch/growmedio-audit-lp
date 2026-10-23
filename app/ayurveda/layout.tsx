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
        className="relative isolate min-h-dvh overflow-x-clip bg-ay-bg font-ay text-[17px] leading-[1.6] text-ay-fg antialiased max-[560px]:text-[16px]"
      >
        {/* The page glow, pinned to the viewport. A fixed layer instead of `background-attachment: fixed`,
            which makes phones repaint the whole background on every scroll step. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,#0C1D13_0%,#050A07_70%)] [transform:translateZ(0)]"
        />
        {children}
      </div>
    </>
  );
}
