"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/ayurveda/motion";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Counts from 0 to `to` (ease-out cubic, 2.2s) once `start` turns true. */
export function CountUp({ to, start }: { to: number; start: boolean }) {
  const [text, setText] = useState(fmt(to));

  useEffect(() => {
    if (!start || prefersReducedMotion()) return;
    const dur = 2200;
    let s0: number | null = null, raf = 0;
    const step = (ts: number) => {
      if (s0 === null) s0 = ts;
      const k = Math.min((ts - s0) / dur, 1);
      setText(fmt(k < 1 ? Math.round(to * (1 - Math.pow(1 - k, 3))) : to));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    setText("0");
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);

  return <span>{text}</span>;
}
