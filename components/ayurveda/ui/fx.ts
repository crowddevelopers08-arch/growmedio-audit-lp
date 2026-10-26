import type { CSSProperties } from "react";

/*
 * Shared card effects (Tailwind class strings), applied inline on every card.
 *  - cardLift:  rises 6px with a soft neutral shadow on hover, settles back with a gentle ease-out
 *  - cardShine: kept as a hook for the card markup; the light sweep was removed for a calmer, professional look
 */
export const cardLift =
  "shadow-[0_1px_2px_rgba(77,78,80,.06),0_8px_24px_-16px_rgba(77,78,80,.25)] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:[transform:translateY(-6px)] hover:border-ay-brand/40 hover:shadow-[0_1px_2px_rgba(77,78,80,.06),0_22px_40px_-22px_rgba(77,78,80,.4)] motion-reduce:hover:[transform:none]";

export const cardShine = "";

/*
 * cardBorder: two logo-blue + logo-green lights, opposite each other, that keep travelling around the
 * card's border; they turn fully opaque on hover. Solid colour segments with hard stops (no blended
 * gradient). Drawn on the card's ::after as a 1.5px ring (a conic fill masked to its edge), so the card
 * needs `relative`. Set `--bd` (a negative delay, e.g. "-2s") on the card to start each one at a different point.
 */
export const cardBorder =
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-[1.5px] after:opacity-80 after:transition-opacity after:duration-500 after:content-[''] after:[background:conic-gradient(from_var(--border-angle),transparent_0%_30%,#1C8FBE_30%_37%,#0E8E75_37%_47%,transparent_47%_80%,#1C8FBE_80%_87%,#0E8E75_87%_97%,transparent_97%_100%)] after:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] after:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] after:[-webkit-mask-composite:xor] min-[761px]:after:animate-border-spin after:[animation-delay:var(--bd,0s)] hover:after:opacity-100 transition-colors duration-300 hover:border-ay-brand/40";
// The travelling light repaints every visible card on every frame (an animated custom property can't
// run on the GPU), which is what made phones stutter, so on phones the light holds still.

/** Staggered start for cardBorder, so neighbouring cards don't move in sync. */
export const borderDelay = (i: number) => ({ "--bd": `${-i * 1.5}s` }) as CSSProperties;

/** Primary call-to-action: a crisp green ring that pulses outward (desktop only; an animated shadow repaints every frame). */
export const ctaPulse = "min-[761px]:animate-pulse-ring";
