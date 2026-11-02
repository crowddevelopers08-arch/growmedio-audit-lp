"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/ayurveda/motion";

const fmt = (n: number, decimals: number) => n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Counts from 0 to `to` (ease-out cubic, 2.2s) once `start` turns true. */
export function CountUp({ to, decimals = 0, start }: { to: number; decimals?: number; start: boolean }) {
  const [text, setText] = useState(fmt(to, decimals));

  useEffect(() => {
    if (!start || prefersReducedMotion()) return;
    const dur = 2200;
    let s0: number | null = null, raf = 0;
    const step = (ts: number) => {
      if (s0 === null) s0 = ts;
      const k = Math.min((ts - s0) / dur, 1);
      const v = to * (1 - Math.pow(1 - k, 3));
      setText(fmt(k < 1 ? (decimals ? v : Math.round(v)) : to, decimals));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    setText(fmt(0, decimals));
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, to, decimals]);

  return <span>{text}</span>;
}
