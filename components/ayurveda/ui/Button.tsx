import { ArrowIcon } from "./Icons";

type Variant = "brand" | "ghost";
type Size = "md" | "nav" | "lg" | "block";

const base =
  "group inline-flex cursor-pointer items-center justify-center gap-[10px] rounded-xl border border-solid font-bold leading-none no-underline transition-[transform,box-shadow,border-color,background] duration-[250ms] ease-[ease]";

const variants: Record<Variant, string> = {
  brand: "border-transparent bg-ay-brand text-ay-ink shadow-[0_6px_16px_-8px_rgba(77,78,80,.35)] hover:[transform:translateY(-2px)] active:[transform:translateY(0)_scale(.98)] active:duration-100 hover:shadow-[0_10px_22px_-10px_rgba(77,78,80,.4)]",
  ghost: "border-ay-line-2 bg-ay-fg/[.03] text-ay-fg hover:border-ay-brand hover:bg-ay-brand/[.08]",
};

const sizes: Record<Size, string> = {
  md: "px-[26px] py-4 text-[15px]",
  nav: "whitespace-nowrap px-[18px] py-[11px] text-[15px] max-[560px]:px-[14px] max-[560px]:py-[10px] max-[560px]:text-[14.5px] max-[380px]:px-3 max-[380px]:text-[13.5px]",
  lg: "px-[34px] py-[19px] text-[16px]",
  block: "w-full p-[18px] text-[16px]",
};

type Common = { variant?: Variant; size?: Size; arrow?: boolean; className?: string; children: React.ReactNode };

export function buttonClass(variant: Variant = "brand", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

function Arrow() {
  return <ArrowIcon className="h-[15px] w-[15px] transition-transform duration-[250ms] ease-[ease] group-hover:[transform:translateX(4px)]" />;
}

export function Button({
  variant = "brand",
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
  variant = "brand",
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
