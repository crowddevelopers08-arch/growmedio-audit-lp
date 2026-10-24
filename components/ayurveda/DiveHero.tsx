"use client";

import { useEffect, useRef } from "react";
import { useLanding } from "./LandingProvider";
import { Button } from "./ui/Button";
import { borderDelay, cardBorder, ctaGlow } from "./ui/fx";
import { Kicker } from "./ui/Kicker";
import { TwoLine } from "./ui/SectionHead";
import { prefersReducedMotion, sm } from "@/lib/ayurveda/motion";

const stats = [
  { value: "50+", name: "Ayurveda clinics", tag: "benefited across India" },
  { value: "300+", name: "Healthcare clients", tag: "worked with" },
  { value: "4", name: "Branches", tag: "across India" },
  { value: "5", name: "Years", tag: "of experience" },
];

const layerPad = "px-[max(16px,env(safe-area-inset-left,0px))]";
const layerBase = `pointer-events-none absolute inset-0 grid place-items-center ${layerPad} will-change-[opacity,transform] [&>*]:pointer-events-auto`;

/**
 * Pinned "dive" hero: 340svh of scroll while the stage sticks (220svh on phones, so the story
 * moves on with less thumb travel). Scrolling blooms the lotus
 * (see LotusCanvas) and cross-fades three story layers.
 */
export function DiveHero() {
  const { openModal, heroFrameRef } = useLanding();
  const la = useRef<HTMLDivElement>(null);
  const lb = useRef<HTMLDivElement>(null);
  const lbSub = useRef<HTMLParagraphElement>(null);
  const lc = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const prog = useRef<HTMLElement>(null);
  const pcs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      la.current!.style.opacity = "1";
      lc.current!.style.visibility = "hidden";
      lb.current!.style.visibility = "visible";
      lb.current!.style.opacity = "1";
      lb.current!.style.position = "relative";
      lbSub.current!.style.opacity = "1";
      pcs.current.forEach((e) => e && (e.style.opacity = "1"));
      return;
    }

    heroFrameRef.current = (p, P) => {
      const A = la.current!, B = lb.current!, C = lc.current!;
      const a = 1 - sm(p, 0.22, 0.38);
      const b = sm(p, 0.38, 0.48) * (1 - sm(p, 0.76, 0.86));
      const c = sm(p, 0.86, 0.97);
      A.style.opacity = String(a);
      // translate3d keeps the layers on the GPU, so the cross-fades don't repaint while scrolling
      A.style.transform = `translate3d(0,${-(1 - a) * 40}px,0) scale(${1 - (1 - a) * 0.06})`;
      A.style.visibility = a < 0.02 ? "hidden" : "visible";
      B.style.opacity = b > 0 ? "1" : "0";
      B.style.visibility = b < 0.02 ? "hidden" : "visible";
      pcs.current.forEach((el, i) => {
        if (!el) return;
        const s = sm(p, 0.38 + i * 0.045, 0.46 + i * 0.045) * (1 - sm(p, 0.76, 0.86));
        el.style.opacity = String(s);
        el.style.transform = `translate3d(0,${(1 - s) * 26}px,0)`;
      });
      lbSub.current!.style.opacity = String(b);
      C.style.opacity = String(c);
      C.style.transform = `translate3d(0,${(1 - c) * 30}px,0)`;
      C.style.visibility = c < 0.02 ? "hidden" : "visible";
      hint.current!.style.opacity = String(1 - sm(p, 0, 0.1));
      prog.current!.style.transform = `scaleY(${P})`;
    };
    return () => {
      heroFrameRef.current = null;
    };
  }, [heroFrameRef]);

  return (
    <section
      id="dive"
      className="relative h-[340svh] max-[560px]:h-[220svh] motion-reduce:h-auto max-[560px]:motion-reduce:h-auto"
    >
      <div className="sticky top-0 grid h-svh place-items-center overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-svh">
        {/* Layer A: headline */}
        <div
          ref={la}
          className={`${layerBase} content-start justify-items-center bg-[radial-gradient(ellipse_75%_60%_at_50%_32%,rgba(237,244,204,.6),transparent_78%)] pb-20 pt-[clamp(40px,9vh,110px)] text-center`}
        >
          <Kicker>Ayurveda owners!!</Kicker>
          <h1 className="mt-[18px] max-w-[24ch] text-balance text-[clamp(28px,4.5vw,64px)] font-semibold leading-[1.08] tracking-[-0.025em] [text-shadow:0_4px_40px_rgba(237,244,204,.85),0_0_8px_rgba(237,244,204,.6)]">
            Spending <span className="text-ay-gold">&#8377;5&nbsp;Lakhs</span> a month on ads? Your revenue should match it.
          </h1>
          <p className="mt-5 max-w-[58ch] text-[clamp(16px,1.5vw,19px)] text-[#1f2a22] [text-shadow:0_2px_20px_rgba(237,244,204,.95),0_0_6px_rgba(237,244,204,.8)]">
            A <strong className="font-semibold text-ay-fg">free one-on-one strategy session</strong> to build your Ayurveda clinic.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button arrow onClick={openModal} className={`${ctaGlow} max-[560px]:w-full`}>
              Reserve My Free Session
            </Button>
          </div>
        </div>

        {/* Layer B: four stages */}
        <div
          ref={lb}
          style={{ opacity: 0, visibility: "hidden" }}
          className={`${layerBase} content-end justify-items-center pb-[clamp(36px,9vh,90px)] pt-[70px]`}
        >
          <p
            ref={lbSub}
            className="mb-[18px] rounded-full border border-ay-gold/45 bg-[rgba(237,244,204,.82)] px-[18px] py-[10px] text-center text-[12.5px] font-semibold uppercase tracking-[.22em] text-[#00602f] backdrop-blur-[6px]"
          >
            Grow Medico
          </p>
          <div className="grid w-full max-w-[780px] grid-cols-2 gap-3 max-[560px]:grid-cols-1 max-[560px]:gap-2">
            {stats.map((s, i) => (
              <div
                key={s.name}
                ref={(el) => {
                  pcs.current[i] = el;
                }}
                style={{ opacity: 0, ...borderDelay(i) }}
                className={`relative flex flex-col items-start justify-center gap-1 rounded-[14px] border border-ay-line-2 bg-[rgba(246,250,223,.78)] px-[22px] py-[18px] backdrop-blur-[8px] ${cardBorder} max-[560px]:px-4 max-[560px]:py-[13px]`}
              >
                <b className="text-[22px] font-semibold leading-[1.3] tracking-[-.02em] max-[560px]:text-[18px]">
                  <i className="mr-1.5 not-italic text-ay-gold">{s.value}</i>
                  {s.name}
                </b>
                <span className="text-right text-[11px] uppercase tracking-[.16em] text-ay-leaf">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer C: closing call to action */}
        <div
          ref={lc}
          style={{ opacity: 0, visibility: "hidden" }}
          className={`${layerBase} content-center justify-items-center bg-[radial-gradient(ellipse_70%_52%_at_50%_50%,rgba(237,244,204,.78),transparent_78%)] pb-20 pt-[70px] text-center`}
        >
          <h2 className="max-w-[30ch] text-balance text-[clamp(26px,4.2vw,58px)] font-semibold leading-[1.08] tracking-[-0.025em] [text-shadow:0_4px_40px_rgba(237,244,204,.9),0_0_8px_rgba(237,244,204,.7)]">
            <TwoLine first="Stop funding leaks." second="Start building revenue." />
          </h2>
          <p className="mt-[18px] max-w-[48ch] text-[#1f2a22] [text-shadow:0_2px_18px_rgba(237,244,204,1),0_0_6px_rgba(237,244,204,.9)]">
            We find where your ad money is leaking and build a plan to turn it into real revenue.
          </p>
          <Button arrow onClick={openModal} className="mt-7">
            Reserve My Free Session
          </Button>
        </div>

        <div
          ref={hint}
          className="pointer-events-none absolute bottom-[max(22px,env(safe-area-inset-bottom,0px))] left-1/2 grid -translate-x-1/2 justify-items-center gap-[10px] text-[11.5px] uppercase tracking-[.26em] text-ay-muted"
        >
          <span>Scroll to dive in</span>
          <i className="h-[38px] w-px origin-top animate-hint bg-[linear-gradient(var(--color-ay-gold),transparent)]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[max(14px,env(safe-area-inset-right,0px))] top-1/2 h-[120px] w-0.5 -translate-y-1/2 rounded-[2px] bg-ay-line max-[560px]:hidden"
        >
          <i ref={prog} style={{ transform: "scaleY(0)" }} className="block h-full w-full origin-top rounded-[2px] bg-ay-gold" />
        </div>
      </div>
    </section>
  );
}
