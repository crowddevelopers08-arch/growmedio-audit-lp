import type { Metadata } from "next";
import { ThankYou } from "@/components/ayurveda/ThankYou";

export const metadata: Metadata = {
  title: "Session reserved | Grow Medico",
  robots: { index: false, follow: false },
};

/** Same pixel as the root layout — needed here for the noscript fallback. */
const META_PIXEL_ID = "757838743050832";

export default function AyurvedaThankYouPage() {
  return (
    <>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=SubmitApplication&noscript=1`}
        />
      </noscript>
      <ThankYou />
    </>
  );
}
