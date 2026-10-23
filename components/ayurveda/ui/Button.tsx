import { ArrowIcon } from "./Icons";

type Variant = "gold" | "ghost";
type Size = "md" | "nav" | "lg" | "block";

const base =
  "group inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-xl border border-solid font-semibold leading-none no-underline transition-[transform,box-shadow,border-color,background] duration-[250ms] ease-[ease]";

const variants: Record<Variant, string> = {
  gold: "border-transparent bg-ay-gold text-ay-ink shadow-[0_0_0_1px_rgba(242,181,61,.5),0_10px_40px_-10px_rgba(242,181,61,.55)] hover:[transform:translateY(-2px)] hover:shadow-[0_0_0_1px_rgba(242,181,61,.8),0_16px_50px_-8px_rgba(242,181,61,.75)]",
  ghost: "border-ay-line-2 bg-white/[.03] text-ay-fg hover:border-ay-gold hover:bg-ay-gold/[.08]",
};

const sizes: Record<Size, string> = {
  md: "px-[26px] py-4 text-[15px]",
  nav: "whitespace-nowrap px-[18px] py-[11px] text-[14px] max-[560px]:px-[14px] max-[560px]:py-[10px] max-[560px]:text-[13px] max-[380px]:px-3 max-[380px]:text-[12px]",
  lg: "px-[34px] py-[19px] text-[16px]",
  block: "w-full p-[18px] text-[16px]",
};

type Common = { variant?: Variant; size?: Size; arrow?: boolean; className?: string; children: React.ReactNode };

export function buttonClass(variant: Variant = "gold", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

function Arrow() {
  return <ArrowIcon className="h-[15px] w-[15px] transition-transform duration-[250ms] ease-[ease] group-hover:[transform:translateX(4px)]" />;
}

export function Button({
  variant = "gold",
  size = "md",
  arrow,
  className,
  children,
  ...rest
}: Common & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button type="button" className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

export function ButtonLink({
  variant = "gold",
  size = "md",
  arrow,
  className,
  children,
  ...rest
}: Common & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </a>
  );
}
