"use client";

import type { ReactNode } from "react";
import { ctaClass, type CtaStyleProps } from "@/components/ui/CtaButton";
import { useBooking } from "@/components/booking/BookingProvider";

/** A CTA that opens the ₹299 checkout modal instead of navigating. */
export default function BookNowButton({
  children,
  ...style
}: CtaStyleProps & { children: ReactNode }) {
  const { openBooking } = useBooking();

  return (
    <button
      type="button"
      data-book=""
      onClick={openBooking}
      className={ctaClass(style)}
    >
      {children}
    </button>
  );
}
