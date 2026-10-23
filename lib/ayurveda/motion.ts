export function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

/** Smoothstep between a and b. */
export function sm(x: number, a: number, b: number) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function store(k: string, v?: string) {
  try {
    if (v === undefined) return sessionStorage.getItem(k);
    sessionStorage.setItem(k, v);
  } catch {}
  return null;
}
