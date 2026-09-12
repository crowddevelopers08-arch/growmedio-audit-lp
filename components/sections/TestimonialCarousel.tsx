"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StarIcon } from "@/components/ui/Icons";
import type { Testimonial } from "@/lib/testimonials";

const AUTOPLAY_MS = 6000;
// A quote takes longer to read than a thumbnail takes to look at, so a swipe
// or button press buys more reading time here than in the video carousel.
const RESUME_AFTER_MS = 12000;

/**
 * One horizontal row of quote cards at every width — one card per view on a
 * phone, two from 760px, three from 1100px — with prev/next buttons, dots and
 * auto-advance. Unlike VideoCarousel this never becomes a grid: eight quotes
 * stacked two-up would be four screens of scrolling.
 */
export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedUntil = useRef(0);
  const hovered = useRef(false);
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

  // Track the card nearest the middle of the viewport rather than the one
  // nearest the left edge: with three cards visible the track runs out of
  // scroll before the last cards ever reach the left edge, which would leave
  // the final dots permanently unlit.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      const distance = (card: HTMLElement) =>
        Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      let nearest = 0;
      cards.forEach((card, i) => {
        if (distance(card) < distance(cards[nearest])) nearest = i;
      });
      activeRef.current = nearest;
      setActive(nearest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

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
      if (!el || el.scrollWidth <= el.clientWidth + 1) return;
      if (!inView.current || document.hidden || hovered.current) return;
      if (Date.now() < pausedUntil.current) return;
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
    <div aria-roledescription="carousel" aria-label="Client testimonials">
      <div
        ref={track}
        onPointerDown={pause}
        onTouchStart={pause}
        onWheel={pause}
        onFocus={pause}
        onMouseEnter={() => {
          hovered.current = true;
        }}
        onMouseLeave={() => {
          hovered.current = false;
        }}
        className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${t.name}`}
            className="w-[86%] shrink-0 snap-center min-[760px]:w-[calc((100%-0.75rem)/2)] min-[760px]:snap-start min-[1100px]:w-[calc((100%-2rem)/3)]"
          >
            <figure className="flex h-full flex-col rounded-[16px] border border-line bg-surface p-5 md:p-[26px]">
              <div className="mb-3 flex gap-[3px] text-gold md:mb-[14px]">
                {Array.from({ length: 5 }).map((_, star) => (
                  <StarIcon key={star} className="h-[15px] w-[15px]" />
                ))}
              </div>
              <blockquote className="text-[0.98rem] leading-[1.65] text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              {/* Pushed to the bottom so credits line up across cards of
                  different quote lengths. */}
              <figcaption className="mt-auto pt-4 text-[0.85rem]">
                <div className="font-semibold text-dim">— {t.name}</div>
                <div className="mt-0.5 text-faint">
                  {t.specialty}
                  {t.city && `, ${t.city}`}
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous testimonial"
          className={arrowClass}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex gap-2">
          {items.map((t, i) => (
            <button
              key={`${t.name}-${i}`}
              type="button"
              onClick={() => {
                pause();
                goTo(i);
              }}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === active ? "true" : undefined}
              className={`h-2 cursor-pointer rounded-full transition-[width,background-color] duration-200 ${
                i === active ? "w-6 bg-brand" : "w-2 bg-line-strong"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next testimonial"
          className={arrowClass}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
