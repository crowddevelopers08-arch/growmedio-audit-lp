"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { prefersReducedMotion } from "@/lib/ayurveda/motion";
import { borderDelay, cardBorder, cardLift } from "./ui/fx";

export type ReviewCard = { name: string; detail: string; quote: string };

const GAP = 18;
const STEP_MS = 3500;

/* Cards in view: 4 on desktop, 2 on tablets, 1 on phones. */
const TABLET = "(max-width: 1024px)";
const PHONE = "(max-width: 640px)";
const subscribe = (cb: () => void) => {
  const queries = [TABLET, PHONE].map((q) => window.matchMedia(q));
  queries.forEach((m) => m.addEventListener("change", cb));
  return () => queries.forEach((m) => m.removeEventListener("change", cb));
};
const getPerView = () => (window.matchMedia(PHONE).matches ? 1 : window.matchMedia(TABLET).matches ? 2 : 4);

function Card({ review, index, width }: { review: ReviewCard; index: number; width: string }) {
  return (
    <figure
      style={{ ...borderDelay(index), width }}
      className={`relative m-0 flex flex-none flex-col justify-between gap-5 rounded-[20px] border border-ay-line bg-ay-panel px-6 py-7 ${cardLift} ${cardBorder}`}
    >
      <blockquote className="m-0 text-[16px] leading-[1.6]">&ldquo;{review.quote}&rdquo;</blockquote>
      <figcaption>
        <b className="block text-[17px] font-semibold text-ay-brand">{review.name}</b>
        <span className="text-[15px] font-medium text-ay-muted">{review.detail}</span>      </figcaption>
    </figure>
  );
}

/**
 * Auto-advancing, endlessly looping row of reviews. The list is rendered twice so the row can keep
 * moving; once it reaches the copy it jumps back to the start without a transition, which looks seamless.
 * With fewer reviews than the screen fits, the row shows just that many wider cards, so it still moves.
 */
export function ReviewsCarousel({ reviews }: { reviews: ReviewCard[] }) {
  const n = reviews.length;
  const perView = Math.min(useSyncExternalStore(subscribe, getPerView, () => 4), n);
  const loops = n > 1;
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const shown = loops ? index : 0;

  const goTo = (i: number) => {
    setAnimate(true);
    setIndex(i);
  };

  useEffect(() => {
    if (!loops || paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      // Normally the transition's end resets this; the check covers a transition that never finished.
      if (index >= n) {
        setAnimate(false);
        setIndex(0);
      } else {
        goTo(index + 1);
      }
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [loops, paused, index, n]);

  const cardWidth = `calc((100% - ${(perView - 1) * GAP}px) / ${perView})`;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Client reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null || !loops) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) goTo((((shown % n) + (dx < 0 ? 1 : -1)) % n + n) % n);
        setTouchX(null);
      }}
    >
      {/* the vertical padding leaves room for the cards' hover lift and shadow inside the clipped row */}
      <div className="-my-3 overflow-hidden py-3">
        <div
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && index >= n) {
              setAnimate(false);
              setIndex(0);
            }
          }}
          style={{
            gap: GAP,
            transform: `translateX(calc((100% + ${GAP}px) / ${perView} * ${-shown}))`,
            transition: animate ? "transform 700ms cubic-bezier(.16,1,.3,1)" : "none",
          }}
          className={`flex items-stretch ${loops ? "" : "justify-center"}`}
        >
          {reviews.map((r, i) => (
            <Card key={r.name} review={r} index={i} width={cardWidth} />
          ))}
          {loops &&
            reviews.map((r, i) => (
              <div key={r.name} aria-hidden="true" className="contents">
                <Card review={r} index={i} width={cardWidth} />
              </div>
            ))}
        </div>
      </div>
      {loops && (
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((r, i) => {
            const active = shown % n === i;
            return (
              <button
                key={r.name}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show review from ${r.name}`}
                aria-current={active ? "true" : undefined}
                className={`h-2 cursor-pointer rounded-full border-0 p-0 transition-[width,background-color] duration-300 ${active ? "w-6 bg-ay-brand" : "w-2 bg-ay-line-2"}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
