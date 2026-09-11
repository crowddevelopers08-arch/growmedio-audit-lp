type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex max-w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent text-center font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-[#04160F] shadow-[0_10px_30px_-8px_rgba(22,212,146,0.55)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-8px_rgba(22,212,146,0.7)]",
  ghost:
    "border-line-strong bg-transparent text-ink hover:border-brand hover:text-brand",
};

// Long labels ("I Want Numbers Like These — Book For ₹199") may wrap on
// narrow phones instead of pushing past the screen edge; the compact size is
// only used for short labels, so it stays on one line.
const sizes: Record<Size, string> = {
  md: "px-[22px] py-[13px] text-[0.95rem] leading-snug min-[480px]:px-[26px] min-[480px]:py-[15px] min-[480px]:text-base",
  sm: "whitespace-nowrap px-[18px] py-[10px] text-[0.9rem]",
};

export interface CtaStyleProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
}

/**
 * CTA look shared by every booking button on the page (`BookNowButton`) and
 * the buttons inside the checkout modal.
 */
export function ctaClass({
  variant = "primary",
  size = "md",
  block = false,
  className = "",
}: CtaStyleProps) {
  return `js-book ${base} ${variants[variant]} ${sizes[size]} ${
    block ? "w-full" : ""
  } ${className}`;
}
