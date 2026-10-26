"use client";

import { useEffect, useRef } from "react";
import { cardBorder } from "./ui/fx";

/* site palette (the ay- gold, leaf and muted tokens): gold for money going out, green for what lands as revenue */
const COL = { brass: "#f2b53d", lit: "#5ee08a", brand: "#1f7a45", muted: "#bac9bf" };

/** f: how far down the pipe, s: side it spills to, p: chance a passing drop leaks there */
const LEAKS = [
  { f: 0.16, s: -1, p: 0.2, t: "Wrong audience" },
  { f: 0.32, s: 1, p: 0.18, t: "Weak offer" },
  { f: 0.48, s: -1, p: 0.22, t: "Slow follow-up" },
  { f: 0.64, s: 1, p: 0.2, t: "Poor tracking" },
  { f: 0.8, s: -1, p: 0.15, t: "Early scaling" },
];

type Drop = { x: number; y: number; vx: number; vy: number; r: number; st: 0 | 1 | 2; k: number; a: number };

/** Animated pipe: a month of ad spend falls through five leaks; what reaches the bottom fills the revenue bar. */
export function FlowCard() {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current!, ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(cv).fontFamily;
    let W = 0, H = 0, cx = 0, y0 = 0, y1 = 0, acc = 0, spent = 1, done = 0, fill = 0, running = false, last = 0, raf = 0;
    const parts: Drop[] = [];

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      y0 = 56;
      y1 = H - 92;
    };
    const spawn = () => {
      parts.push({ x: cx + (Math.random() - 0.5) * 14, y: y0, vx: 0, vy: (62 + Math.random() * 34) * (H / 520), r: 1.8 + Math.random() * 1.5, st: 0, k: 0, a: 1 });
      spent++;
    };
    const step = (dt: number) => {
      acc += dt * 13;
      while (acc >= 1) {
        if (parts.length < 220) spawn();
        acc -= 1;
      }
      const decay = 1 - dt * 0.12;
      spent *= decay;
      done *= decay;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (p.st === 0) {
          p.y += p.vy * dt;
          p.x += (cx - p.x) * Math.min(1, dt * 4);
          while (p.k < LEAKS.length && p.y >= y0 + (y1 - y0) * LEAKS[p.k].f) {
            const L = LEAKS[p.k++];
            if (Math.random() < L.p) {
              p.st = 1;
              p.vx = L.s * (48 + Math.random() * 40) * (W / 480);
              p.vy *= 0.45;
              break;
            }
          }
          if (p.st === 0 && p.y >= y1) {
            p.st = 2;
            p.y = y1;
            done++;
          }
        } else if (p.st === 1) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 1 - dt * 0.7;
          p.a -= dt * 0.85;
          if (p.a <= 0) parts.splice(i, 1);
        } else {
          p.a -= dt * 2.2;
          if (p.a <= 0) parts.splice(i, 1);
        }
      }
      const target = spent > 0 ? Math.min(1, done / spent) : 0;
      fill += (target - fill) * Math.min(1, dt * 2);
    };
    // one pipe wall, broken by a gap at every leak on its side
    const wall = (x: number, side: number) => {
      const ys = [y0];
      LEAKS.forEach((L) => {
        if (L.s === side) {
          const y = y0 + (y1 - y0) * L.f;
          ys.push(y - 9, y + 9);
        }
      });
      ys.push(y1);
      for (let i = 0; i < ys.length; i += 2) {
        ctx.moveTo(x, ys[i]);
        ctx.lineTo(x, ys[i + 1]);
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.textBaseline = "middle";
      ctx.font = `500 ${W < 420 ? 11.5 : 13.5}px ${font}`;
      (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "1.2px";

      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, COL.brass);
      g.addColorStop(1, COL.lit);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      wall(cx - 13, -1);
      wall(cx + 13, 1);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = COL.muted;
      LEAKS.forEach((L) => {
        const y = y0 + (y1 - y0) * L.f;
        ctx.textAlign = L.s < 0 ? "left" : "right";
        ctx.fillText(L.t.toUpperCase(), L.s < 0 ? 14 : W - 14, y);
      });

      ctx.textAlign = "center";
      ctx.fillStyle = COL.brass;
      ctx.fillText("AD SPEND · ₹5,00,000 / MONTH", cx, 24);

      for (const p of parts) {
        const col = p.st === 2 ? COL.lit : COL.brass;
        ctx.globalAlpha = Math.max(0, p.a);
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      const bx = 28, bw = W - 56, by = H - 46;
      ctx.fillStyle = "rgba(255,255,255,.08)";
      ctx.fillRect(bx, by, bw, 10);
      const fg = ctx.createLinearGradient(bx, 0, bx + bw, 0);
      fg.addColorStop(0, COL.brand);
      fg.addColorStop(1, COL.lit);
      ctx.fillStyle = fg;
      ctx.fillRect(bx, by, Math.max(2, bw * fill), 10);
      ctx.textAlign = "left";
      ctx.fillStyle = COL.lit;
      ctx.fillText("REVENUE", bx, H - 22);
    };
    const frame = (t: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    size();
    // pre-run so the pipe is already flowing (and the bar part-filled) on first paint
    for (let w = 0; w < (reduce ? 420 : 240); w++) step(1 / 60);
    draw();
    document.fonts?.ready.then(draw);

    const ro = new ResizeObserver(() => {
      size();
      if (!running) draw();
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    if (!reduce) io.observe(cv);
    const onVis = () => document.hidden && stop();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <figure
      className={`relative m-0 min-w-0 overflow-hidden rounded-[20px] border border-ay-line-2 bg-[rgba(9,18,13,.8)] backdrop-blur-[6px] ${cardBorder}`}
    >
      <canvas
        ref={cvRef}
        role="img"
        aria-label="Animated diagram: ad spend falls through a pipe with five leaks, and only a part of it reaches revenue at the bottom"
        className="block h-[clamp(400px,calc(100svh-230px),540px)] w-full max-[980px]:h-[clamp(430px,90vw,520px)]"
      />
      <figcaption className="border-t border-ay-line px-5 py-[14px] text-[12.5px] font-medium uppercase leading-[1.5] tracking-[.1em] text-ay-muted">
        Illustrative · a month of ad spend, and what leaks before it becomes revenue
      </figcaption>
    </figure>
  );
}
