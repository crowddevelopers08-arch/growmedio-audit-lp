"use client";

import { useInView } from "../useInView";

const HIDDEN = {
  up: "[transform:translateY(30px)] opacity-0",
  scale: "[transform:translateY(18px)_scale(.94)] opacity-0",
  left: "[transform:translateX(-40px)] opacity-0",
  right: "[transform:translateX(40px)] opacity-0",
  // the blur only runs on desktop: animating a filter is costly on phones
  blur: "[transform:translateY(20px)] opacity-0 min-[761px]:blur-[8px]",
};

export type RevealVariant = keyof typeof HIDDEN;

type Props = {
  as?: "div" | "article";
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  children: React.ReactNode;
};

/**
 * Animates its content in once it scrolls into view. It also marks itself as the `rv` group
 * with `data-in`, so children can run their own entrance with `group-data-[in=true]/rv:` classes.
 */
export function Reveal({ as: Tag = "div", delay = 0, variant = "up", className = "", children }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      data-in={inView}
      style={{ transitionDelay: `${delay}s` }}
      className={`group/rv transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:[transform:none] motion-reduce:opacity-100 motion-reduce:blur-none ${
        inView ? "[transform:none] opacity-100 blur-none" : HIDDEN[variant]
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
