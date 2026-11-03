import type { Metadata, Viewport } from "next";

const SHARE_TITLE = "India’s Biggest Ayurveda Brands Don’t Hire Generalists. They Hire Us.";
const SHARE_DESCRIPTION = "Award-winning marketing agency, built exclusively for Ayurveda. Reserve your free one-on-one strategy session.";
const SHARE_IMAGE = { url: "/ayurveda-copy/og-image.png", width: 1200, height: 630, alt: SHARE_TITLE };

/* Open Graph and Twitter are set in full here: WhatsApp and other apps read these tags for link previews,
   and without them this page inherits the main page's preview from app/layout.tsx. */
export const metadata: Metadata = {
  metadataBase: new URL("https://audit.growmedico.in"),
  title: "Marketing Agency for Ayurveda Brands | Grow Medico",
  description: SHARE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/ayurveda-copy",
    siteName: "Grow Medico",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#ffffff",
};

/* Mirrors the <body> of the standalone ayurveda funnel; tokens are the `ay-` set in app/globals.css. */
export default function AyurvedaCopyLayout({ children }: { children: React.ReactNode }) {
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
        {/* The page background, pinned to the viewport. A fixed layer instead of `background-attachment: fixed`,
            which makes phones repaint the whole background on every scroll step. */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-ay-bg [transform:translateZ(0)]" />
        {children}
      </div>
    </>
  );
}
