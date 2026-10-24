"use client";

import { Children, useEffect, useRef } from "react";

const TOP = 110, OFFSET = 26;

/**
 * Cards that pin under the navbar one after another while the page scrolls; each new card slides
 * up over the last, which shrinks and dims slightly so the stack reads as a deck.
 */
export function StickyStack({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  // every card takes the tallest card's height, so a covered card never peeks out below the next
  useEffect(() => {
    const els = refs.current.filter((e): e is HTMLDivElement => !!e);
    const fit = () => {
      els.forEach((e) => (e.style.minHeight = ""));
      const h = Math.max(...els.map((e) => e.offsetHeight));
      els.forEach((e) => (e.style.minHeight = `${h}px`));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(els[0].parentElement!.parentElement!);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = refs.current, vh = innerHeight;
      for (let i = 0; i < els.length - 1; i++) {
        const el = els[i], next = els[i + 1]?.parentElement;
        if (!el || !next) continue;
        // 0 while the next card is a screen away, 1 once it has pinned on top of this one
        const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - TOP - (i + 1) * OFFSET) / (vh * 0.7)));
        el.style.transform = `scale(${1 - p * 0.06})`;
        el.style.filter = `brightness(${1 - p * 0.35})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // bottom room lets the finished stack hold before it scrolls away
    <div className="pb-[25vh] max-[560px]:pb-[18vh]">
      {items.map((child, i) => (
        <div
          key={i}
          style={{ top: TOP + i * OFFSET, zIndex: i + 1 }}
          // the gap sits above each later card: a margin below a sticky card would cut its pinned run short
          className={`sticky ${i ? "mt-[45vh] max-[560px]:mt-[30vh]" : ""}`}
        >
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="grid origin-top will-change-transform"
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
