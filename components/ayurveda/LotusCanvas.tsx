"use client";

import { useEffect, useRef } from "react";
import { useLanding } from "./LandingProvider";
import { clamp, prefersReducedMotion, sm, store } from "@/lib/ayurveda/motion";

type Particle = { x: number; y: number; r: number; v: number; ph: number; g: boolean };
type Stop = { y: number; x: number; yy: number; size: number; a: number };

/** Opacity multiplier for the lotus once it leaves the hero (1 = original strength). */
const SCROLL_DIM = 0.55;

const ROWS = [
  { n: 11, len: 1.0, w: 0.3, spread: 1.52 },
  { n: 9, len: 0.88, w: 0.29, spread: 1.15 },
  { n: 7, len: 0.74, w: 0.28, spread: 0.8 },
  { n: 5, len: 0.58, w: 0.26, spread: 0.46 },
];

/**
 * Full-screen glowing lotus. It blooms while the pinned hero scrolls, then drifts beside each
 * section down to the final call to action. It also drives the hero's layer cross-fades every frame.
 */
export function LotusCanvas() {
  const { heroFrameRef, openModal, modalOpenRef } = useLanding();
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current!;
    const ctx = cv.getContext("2d")!;
    const $ = (id: string) => document.getElementById(id)!;
    const dive = $("dive");
    const reduce = prefersReducedMotion();

    let W = 0, H = 0, DPR = 1, parts: Particle[] = [], P = 0, p = 0, inView = true;
    const t0 = performance.now();
    const S = { x: 0.5, yy: 0.54, size: 0.2, alpha: 1, bloom: 0, rot: 0, hero: true };
    let stops: Stop[] = [], inited = false, lastT = performance.now(), tick = 0, popped = false, raf = 0;
    /** Phone mode: 1x resolution, no glow shadows, fewer particles, 30fps redraws. */
    let lite = false, lastDraw = performance.now();

    /* the lotus follows the reader: one waypoint per section, eased between them, all the way to the end */
    function buildStops() {
      const narrow = W < 900, vh = H, f = narrow ? 0.27 : 0.31;
      const at = (id: string) => {
        const e = document.getElementById(id);
        if (!e) return -1;
        const r = e.getBoundingClientRect();
        return r.top + window.pageYOffset + r.height / 2 - vh / 2;
      };
      const side = (x: number, yy: number, size: number, a: number) =>
        narrow ? { x: 0.5, yy: 0.5, size: 0.22, a: 0.16 } : { x, yy, size, a };
      const heroEnd = dive.getBoundingClientRect().top + window.pageYOffset + dive.offsetHeight - vh;
      stops = [
        { y: heroEnd, x: 0.5, yy: narrow ? 0.56 : 0.54, size: f * 1.24, a: 0.65 },
        { y: at("problem"), ...(narrow ? { x: 0.5, yy: 0.5, size: 0.22, a: 0.2 } : { x: 0.2, yy: 0.8, size: 0.17, a: 0.5 }) },
        { y: at("leaks"), x: 0.5, yy: 0.5, size: narrow ? 0.24 : 0.24, a: narrow ? 0.16 : 0.24 },
        { y: at("session"), ...side(0.12, 0.46, 0.2, 0.3) },
        { y: at("outcomes"), ...side(0.88, 0.42, 0.2, 0.3) },
        { y: at("fit"), ...side(0.1, 0.5, 0.19, 0.28) },
        { y: at("about"), ...side(0.88, 0.55, 0.2, 0.3) },
        { y: at("proof"), ...side(0.9, 0.42, 0.2, 0.3) },
        { y: at("process"), ...side(0.1, 0.5, 0.19, 0.28) },
        { y: at("faq"), ...side(0.88, 0.5, 0.19, 0.28) },
        { y: at("book"), x: 0.5, yy: narrow ? 0.74 : 0.8, size: narrow ? 0.26 : 0.3, a: 0.5 },
      ].filter((s) => s.y >= 0);
      // past the hero the lotus is a quiet backdrop, so dim it
      for (let i = 1; i < stops.length; i++) stops[i].a *= SCROLL_DIM;
      for (let i = 1; i < stops.length; i++) if (stops[i].y <= stops[i - 1].y) stops[i].y = stops[i - 1].y + 1;
    }

    function target() {
      const y = window.pageYOffset, narrow = W < 900, f = narrow ? 0.27 : 0.31;
      const base = narrow ? 0.56 : 0.54;
      const tg = {
        x: 0.5,
        yy: 0.88 + (base - 0.88) * sm(p, 0.04, 0.5),
        size: f * (0.62 + 0.62 * sm(p, 0.04, 0.78)),
        a: 0.4 + 0.6 * sm(p, 0.08, 0.42) - 0.35 * sm(p, 0.8, 0.95),
        b: sm(p, 0.04, 0.78),
        hero: true,
      };
      if (stops.length < 2 || y <= stops[0].y) return tg;
      let i = 0;
      while (i < stops.length - 2 && y >= stops[i + 1].y) i++;
      const a = stops[i], b = stops[i + 1], k = sm(y, a.y, b.y);
      const L = (u: number, v: number) => u + (v - u) * k;
      return { x: L(a.x, b.x), yy: L(a.yy, b.yy), size: L(a.size, b.size), a: L(a.a, b.a), b: 1, hero: false };
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      lite = W < 761;
      // phones have 3x screens but small GPUs; at 1x the soft glow still reads well
      DPR = lite ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
      buildStops();
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = W < 600 ? 32 : lite ? 55 : 110;
      parts = [];
      for (let i = 0; i < n; i++)
        parts.push({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.8, v: 0.12 + Math.random() * 0.45, ph: Math.random() * 6.28, g: Math.random() < 0.35 });
    }

    function petal(L: number, w: number) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-w * L, -0.28 * L, -w * 0.85 * L, -0.82 * L, 0, -L);
      ctx.bezierCurveTo(w * 0.85 * L, -0.82 * L, w * L, -0.28 * L, 0, 0);
      ctx.closePath();
    }

    function draw(now: number) {
      const t = (now - t0) / 1000;
      const step = Math.min((now - lastDraw) / (1000 / 60), 3);
      lastDraw = now;
      ctx.clearRect(0, 0, W, H);
      const bloom = S.bloom, cx = W * S.x, cy = H * S.yy, R = Math.min(W, H) * S.size;
      const sway = S.hero ? 0 : Math.sin(t * 0.5) * 0.035;

      // ambient glow
      ctx.globalAlpha = Math.min(1, S.alpha + 0.15);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.8);
      g.addColorStop(0, "rgba(242,181,61," + (0.14 + 0.26 * bloom) + ")");
      g.addColorStop(0.45, "rgba(94,224,138," + (0.04 + 0.07 * bloom) + ")");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = S.alpha;

      // mandala rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(242,181,61," + (0.35 + 0.4 * bloom) + ")";
      ctx.shadowColor = "rgba(242,181,61,.9)";
      ctx.shadowBlur = lite ? 0 : 18;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.42, 0, 6.2832);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.save();
      ctx.rotate(t * 0.06 + S.rot);
      // ticks batched into two paths (major / minor) instead of 96 separate strokes
      for (const major of [true, false]) {
        ctx.strokeStyle = major ? "rgba(242,181,61,.55)" : "rgba(242,181,61,.25)";
        ctx.beginPath();
        for (let i = major ? 0 : 1; i < 96; i += major ? 4 : 1) {
          if (!major && i % 4 === 0) continue;
          const a = (i / 96) * 6.2832, l = major ? 14 : 6;
          ctx.moveTo(Math.cos(a) * R * 1.5, Math.sin(a) * R * 1.5);
          ctx.lineTo(Math.cos(a) * (R * 1.5 + l), Math.sin(a) * (R * 1.5 + l));
        }
        ctx.stroke();
      }
      ctx.restore();
      ctx.save();
      ctx.rotate(-t * 0.09 - S.rot * 1.4);
      ctx.setLineDash([3, 10]);
      ctx.strokeStyle = "rgba(94,224,138,.45)";
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.75, 0, 6.2832);
      ctx.stroke();
      ctx.restore();
      // petal-shaped mandala arcs
      ctx.save();
      ctx.rotate(t * 0.035);
      ctx.strokeStyle = "rgba(242,181,61," + (0.08 + 0.12 * bloom) + ")";
      ctx.lineWidth = 1;
      // one path for all 16 arcs (each ellipse rotated about the centre via its own rotation argument)
      ctx.beginPath();
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * 6.2832;
        ctx.moveTo(Math.sin(a) * R * 1.05 + Math.cos(a) * R * 0.22, -Math.cos(a) * R * 1.05 + Math.sin(a) * R * 0.22);
        ctx.ellipse(Math.sin(a) * R * 1.05, -Math.cos(a) * R * 1.05, R * 0.22, R * 0.5, a, 0, 6.2832);
      }
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      // ripples
      ctx.save();
      ctx.translate(cx, cy + R * 0.52);
      for (let r2 = 0; r2 < 3; r2++) {
        const ph = (t * 0.22 + r2 / 3) % 1;
        ctx.strokeStyle = "rgba(94,224,138," + 0.35 * (1 - ph) + ")";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, R * (0.5 + ph * 1.3), R * (0.12 + ph * 0.28), 0, 0, 6.2832);
        ctx.stroke();
      }
      ctx.restore();

      // lotus
      ctx.save();
      ctx.translate(cx, cy + R * 0.42);
      ctx.rotate(sway);
      const breathe = 1 + Math.sin(t * 1.1) * 0.012;
      ROWS.forEach((row, ri) => {
        for (let i = 0; i < row.n; i++) {
          const f = row.n === 1 ? 0 : (i / (row.n - 1) - 0.5) * 2;
          const ang = f * (0.05 + row.spread * bloom);
          const L = R * row.len * (0.5 + 0.5 * bloom) * breathe;
          ctx.save();
          ctx.rotate(ang + Math.sin(t * 0.8 + i + ri) * 0.008);
          const gr = ctx.createLinearGradient(0, 0, 0, -L);
          gr.addColorStop(0, "rgba(214,120,28," + (0.55 + 0.1 * ri) + ")");
          gr.addColorStop(0.55, "rgba(242,181,61," + (0.38 + 0.08 * ri) + ")");
          gr.addColorStop(1, "rgba(255,236,190," + (0.55 + 0.08 * ri) + ")");
          petal(L, row.w);
          ctx.fillStyle = gr;
          ctx.shadowColor = "rgba(242,181,61,.65)";
          // per-petal blur is the costliest part of a frame, so phones skip it (the ambient glow stays)
          ctx.shadowBlur = lite ? 0 : S.hero ? 16 + 10 * bloom : 4;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.lineWidth = 1.1;
          ctx.strokeStyle = "rgba(255,226,150," + (0.55 + 0.1 * ri) + ")";
          ctx.stroke();
          // vein
          ctx.beginPath();
          ctx.moveTo(0, -L * 0.12);
          ctx.lineTo(0, -L * 0.82);
          ctx.strokeStyle = "rgba(255,240,200,.18)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      });
      // diya-like core flame
      const fl = 1 + Math.sin(t * 5) * 0.06;
      const fg = ctx.createRadialGradient(0, -R * 0.08, 0, 0, -R * 0.08, R * 0.32);
      fg.addColorStop(0, "rgba(255,248,220,.95)");
      fg.addColorStop(0.4, "rgba(255,200,90," + (0.5 + 0.4 * bloom) + ")");
      fg.addColorStop(1, "rgba(242,181,61,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.ellipse(0, -R * 0.1, R * 0.16 * fl, R * 0.3 * fl * (0.6 + 0.4 * bloom), 0, 0, 6.2832);
      ctx.fill();
      ctx.restore();

      // pollen / embers
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "lighter";
      for (const q of parts) {
        // `step` scales motion to the time since the last draw (phones draw at 30fps)
        q.y -= q.v * (1 + bloom) * step;
        q.x += Math.sin(t * 0.6 + q.ph) * 0.25 * step;
        if (q.y < -10) {
          q.y = H + 10;
          q.x = Math.random() * W;
        }
        const al = (0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.6 + q.ph))) * (0.5 + 0.5 * bloom);
        ctx.fillStyle = q.g ? "rgba(94,224,138," + al + ")" : "rgba(242,181,61," + al + ")";
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function setP() {
      const r = dive.getBoundingClientRect(), total = dive.offsetHeight - window.innerHeight;
      P = total > 0 ? clamp(-r.top / total, 0, 1) : 1;
      inView = r.bottom > 0 && r.top < window.innerHeight;
    }

    function autoPop() {
      if (popped || store("popped") === "1") return;
      popped = true;
      store("popped", "1");
      setTimeout(() => {
        if (!modalOpenRef.current) openModal();
      }, 700);
    }

    function frame(now: number) {
      setP();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      // time-based easing (≈ the old 0.1 per frame at 60Hz), so 120Hz phones glide at the same pace
      p += (P - p) * (1 - Math.exp(-dt * 6.3));
      if (Math.abs(P - p) < 0.0005) p = P;
      if (++tick % 40 === 1) buildStops();
      const tg = target(), k = inited ? 1 - Math.exp(-dt * 5.5) : 1;
      inited = true;
      S.x += (tg.x - S.x) * k;
      S.yy += (tg.yy - S.yy) * k;
      S.size += (tg.size - S.size) * k;
      S.alpha += (tg.a - S.alpha) * k;
      S.bloom += ((tg.hero ? tg.b : 0.9 + 0.1 * Math.sin(now / 1800)) - S.bloom) * Math.max(k, 0.12);
      S.hero = tg.hero;
      S.rot = window.pageYOffset * 0.0014;
      // phones redraw the canvas at ~30fps, the hero's text fades still update every frame
      if (!lite || now - lastDraw >= 30) draw(now);
      if (inView) heroFrameRef.current?.(p, P);
      if (p > 0.985) autoPop();
      raf = requestAnimationFrame(frame);
    }

    resize();
    let lastW = W, lastH = H;
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastW) < 2 && Math.abs(window.innerHeight - lastH) < 140) return;
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      resize();
      if (reduce) {
        p = 1;
        S.bloom = 1;
        S.size = 0.38;
        draw(performance.now());
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", buildStops);

    if (reduce) {
      p = 1;
      P = 1;
      S.bloom = 1;
      S.size = (W < 900 ? 0.27 : 0.31) * 1.24;
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", buildStops);
    };
  }, [heroFrameRef, openModal, modalOpenRef]);

  return <canvas ref={cvRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 block h-full w-full" />;
}
