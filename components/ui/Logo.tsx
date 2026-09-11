import Image from "next/image";

import logoLockup from "@/public/gm-logo-dark.png";
import logoMark from "@/public/gm-fav-icon.png";

/**
 * Brand lockup for the dark theme.
 *
 * `gm-logo-dark.png` is derived from the high-res master (gm-black-logo.jpeg):
 * background un-matted to transparency and the grey wordmark repainted in ink,
 * matching the brand's own dark treatment. The two other files in /public are
 * deliberately unused here — gmlogo.webp bakes in a #1d1d1d box that shows as a
 * lighter rectangle against the page, and gmlogo1.png is a degraded export.
 *
 * `variant="mark"` is the G on its own, for spaces too tight for the wordmark.
 */
export default function Logo({
  variant = "lockup",
  height = 36,
  className = "",
  priority = false,
}: {
  variant?: "lockup" | "mark";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "mark" ? logoMark : logoLockup;
  const width = Math.round((src.width / src.height) * height);

  return (
    <Image
      src={src}
      alt="Grow Medico"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}
