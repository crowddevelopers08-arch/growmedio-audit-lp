"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Ph from "@/components/ui/Ph";
import { PlayIcon } from "@/components/ui/Icons";

const AUTOPLAY_MS = 4000;
// After a swipe or button press, hold off long enough to actually watch.
const RESUME_AFTER_MS = 8000;

/**
 * Phones: a swipeable carousel showing one video at a time, with prev/next
 * buttons, dots and auto-advance.
 * 640px and up: the same track becomes a 4-column grid, so every video is
 * visible and the carousel controls are hidden.
 */
export default function VideoCarousel({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedUntil = useRef(0);
  const inView = useRef(false);

  const goTo = useCallback((index: number) => {
    const el = track.current;
    if (!el) return;
    const count = el.children.length;
    const card = el.children[((index % count) + count) % count] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, []);

  const pause = () => {
    pausedUntil.current = Date.now() + RESUME_AFTER_MS;
  };

  // Keep the dots in sync with swipes and programmatic scrolls.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      let nearest = 0;
      cards.forEach((card, i) => {
        if (Math.abs(card.offsetLeft - el.scrollLeft) < Math.abs(cards[nearest].offsetLeft - el.scrollLeft)) {
          nearest = i;
        }
      });
      activeRef.current = nearest;
      setActive(nearest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Only auto-advance while the carousel is on screen, so visitors arrive at
  // the first video rather than somewhere mid-cycle.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = track.current;
      // On 640px+ the track is a grid with nothing to scroll.
      if (!el || el.scrollWidth <= el.clientWidth + 1) return;
      if (!inView.current || document.hidden || Date.now() < pausedUntil.current) return;
      goTo(activeRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [goTo]);

  const step = (delta: number) => {
    pause();
    goTo(activeRef.current + delta);
  };

  const arrowClass =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line-strong text-dim transition-colors hover:border-brand hover:text-brand";

  return (
    <div aria-roledescription="carousel" aria-label="Campaign videos">
      <div
        ref={track}
        onPointerDown={pause}
        onTouchStart={pause}
        onWheel={pause}
        onFocus={pause}
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {items.map((specialty, i) => (
          <div
            key={specialty}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${specialty}`}
            className="w-full shrink-0 snap-center overflow-hidden rounded-[16px] border border-line bg-surface sm:w-auto"
          >
            <div className="relative flex aspect-[9/16] items-center justify-center bg-[linear-gradient(160deg,#161C22,#0C0F12_70%)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/[0.12] text-white backdrop-blur-[6px] md:h-[52px] md:w-[52px]">
                <PlayIcon className="ml-0.5 h-5 w-5" />
              </div>
              <Ph
                title="Add real video clip"
                className="absolute right-3 bottom-3 left-3 text-[0.72rem] text-faint"
              >
                Video testimonial — add clip
              </Ph>
            </div>
            <div className="px-3.5 py-3 text-[0.85rem] text-dim sm:px-3 sm:py-2.5 sm:text-[0.8rem] md:px-[14px] md:py-3 md:text-[0.82rem]">
              {specialty} clinic
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
        <button type="button" onClick={() => step(-1)} aria-label="Previous video" className={arrowClass}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex gap-2">
          {items.map((specialty, i) => (
            <button
              key={specialty}
              type="button"
              onClick={() => {
                pause();
                goTo(i);
              }}
              aria-label={`Show ${specialty} video`}
              aria-current={i === active ? "true" : undefined}
              className={`h-2 cursor-pointer rounded-full transition-[width,background-color] duration-200 ${
                i === active ? "w-6 bg-brand" : "w-2 bg-line-strong"
              }`}
            />
          ))}
        </div>

        <button type="button" onClick={() => step(1)} aria-label="Next video" className={arrowClass}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
