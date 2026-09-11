"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Fades a stat number up 6px the first time it scrolls into view.
 *
 * Content renders visible by default and is only touched once the observer
 * fires, so the numbers are never hidden when JS is unavailable — same
 * behaviour as the original page's IntersectionObserver block.
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          observer.unobserve(target);

          target.style.transition = "opacity .5s ease, transform .5s ease";
          target.style.opacity = "0";
          target.style.transform = "translateY(6px)";
          requestAnimationFrame(() => {
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
          });
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
