import type { CSSProperties } from "react";

const DIGITS = "0123456789";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";

/* The characters a reel spins through before landing on `ch`. Fixed (not random) so the server and
   client render the same markup. Digits run 0-9 once, then count up to the target; letters run
   through 8 letters of the same case, offset per position so neighbouring reels don't match. */
function reel(ch: string, i: number): string[] | null {
  if (DIGITS.includes(ch)) return [...DIGITS, ...DIGITS.slice(0, DIGITS.indexOf(ch) + 1)];
  const set = UPPER.includes(ch) ? UPPER : LOWER.includes(ch) ? LOWER : null;
  if (!set) return null;
  const from = (set.indexOf(ch) + 7 + i * 5) % set.length;
  const spin = Array.from({ length: 8 }, (_, k) => set[(from + k * 3) % set.length]);
  return [...spin, ch];
}

/**
 * Slot-machine counter: every digit and letter of `text` rolls up and lands in turn, left to right.
 * Pure CSS (the `reel` keyframes in globals.css), so the settled text is what renders without JS or
 * with reduced motion. Each reel is an inline-block sized by an invisible copy of its final character,
 * which keeps the baseline and spacing identical to plain text.
 */
export function RollText({ text, delay = 0.3, stagger = 0.09, className = "" }: { text: string; delay?: number; stagger?: number; className?: string }) {
  let n = 0;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) => {
          const items = reel(ch, i);
          if (!items) return <span key={i}>{ch}</span>;
          const style = {
            "--to": `${-(items.length - 1) * 1.08}em`,
            animationDelay: `${delay + n++ * stagger}s`,
          } as CSSProperties;
          return (
            <span key={i} className="relative inline-block leading-[1.08]">
              <span className="invisible">{ch}</span>
              <span className="absolute inset-0 overflow-hidden">
                <span style={style} className="absolute left-1/2 top-0 flex flex-col items-center [transform:translate(-50%,var(--to))] animate-reel">
                  {items.map((c, k) => (
                    <span key={k} className="block h-[1.08em] leading-[1.08]">
                      {c}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
