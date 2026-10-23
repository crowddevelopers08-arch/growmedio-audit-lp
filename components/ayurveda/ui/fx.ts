import type { CSSProperties } from "react";

/*
 * Shared card effects (Tailwind class strings), applied inline on every card.
 *  - cardLift:  rises 6px with a soft gold glow on hover
 *  - cardShine: a light sweep that crosses the card on hover (card needs `relative overflow-hidden`)
 */
export const cardLift =
  "transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:[transform:translateY(-6px)] hover:border-ay-gold/45 hover:shadow-[0_22px_44px_-20px_rgba(242,181,61,.45)] motion-reduce:hover:[transform:none]";

export const cardShine =
  "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,.07)_50%,transparent_75%)] before:transition-transform before:duration-700 before:ease-out before:content-[''] hover:before:translate-x-full";

/*
 * cardBorder: a gold-to-green light that keeps travelling around the card's border, brighter on hover.
 * Drawn on the card's ::after as a 1px ring (a conic gradient masked to its edge), so the card needs
 * `relative`. Set `--bd` (a negative delay, e.g. "-2s") on the card to start each one at a different point.
 */
export const cardBorder =
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-[1.5px] after:opacity-85 after:transition-opacity after:duration-300 after:content-[''] after:[background:conic-gradient(from_var(--border-angle),transparent_0%,transparent_55%,rgba(242,181,61,.95)_76%,rgba(94,224,138,.95)_88%,transparent_100%)] after:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] after:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] after:[-webkit-mask-composite:xor] min-[761px]:after:animate-border-spin after:[animation-delay:var(--bd,0s)] hover:after:opacity-100";
// The travelling light repaints every visible card on every frame (an animated custom property can't
// run on the GPU), which is what made phones stutter, so on phones the light holds still.

/** Staggered start for cardBorder, so neighbouring cards don't move in sync. */
export const borderDelay = (i: number) => ({ "--bd": `${-i * 1.5}s` }) as CSSProperties;

/** Primary call-to-action: a slow breathing glow (desktop only; an animated shadow repaints every frame). */
export const ctaGlow = "min-[761px]:animate-glow";
