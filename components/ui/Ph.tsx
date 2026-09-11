import type { ReactNode } from "react";

/**
 * Placeholder token (the original page's `.ph` class).
 *
 * Every number, quote, clip and credential that still needs a real, verified
 * figure is wrapped in this. The dashed underline makes it impossible for a
 * half-finished page to go live looking like a real claim.
 */
export default function Ph({
  children,
  title,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={`cursor-help border-b-[1.5px] border-dashed border-white/35 px-[2px] opacity-[0.92] ${className}`}
    >
      {children}
    </span>
  );
}
