type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-[#04160F] shadow-[0_10px_30px_-8px_rgba(22,212,146,0.55)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-8px_rgba(22,212,146,0.7)]",
  ghost:
    "border-line-strong bg-transparent text-ink hover:border-brand hover:text-brand",
};

const sizes: Record<Size, string> = {
  md: "px-[26px] py-[15px] text-base",
  sm: "px-[18px] py-[10px] text-[0.9rem]",
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
