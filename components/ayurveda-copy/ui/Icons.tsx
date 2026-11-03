type P = { className?: string; width?: number; height?: number };

export function ArrowIcon({ className = "", width, height }: P) {
  return (
    <svg viewBox="0 0 16 16" className={className} width={width} height={height} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  );
}

export function LotusIcon({ className = "" }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M32 8c7 7 10 14 10 22s-4 14-10 20c-6-6-10-12-10-20S25 15 32 8z" />
        <path d="M10 22c10 0 18 6 22 28-12 2-20-4-24-14-1-5 0-10 2-14z" />
        <path d="M54 22c-10 0-18 6-22 28 12 2 20-4 24-14 1-5 0-10-2-14z" />
        <path d="M6 40c8 2 16 6 26 12-10 4-20 4-26-2z" opacity=".7" />
        <path d="M58 40c-8 2-16 6-26 12 10 4 20 4 26-2z" opacity=".7" />
      </g>
    </svg>
  );
}

/** 16-petal mandala used behind the final call to action. */
export function MandalaIcon({ className = "" }: P) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle r="96" />
        <circle r="78" />
        <circle r="40" />
        <circle r="12" />
        {Array.from({ length: 16 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-58" rx="13" ry="30" transform={i ? `rotate(${i * 22.5})` : undefined} />
        ))}
      </g>
    </svg>
  );
}

export function LeafIcon({ className = "" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M20 4C10 4 4 9 4 16c0 2 .6 3.4 1.4 4.6C6 14 10 10 16 8c-4 3-7 6-8.4 12.4C9 20.8 10.5 21 12 21c6 0 8-6 8-17z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2zm5.8 14.1c-.25.7-1.4 1.3-1.95 1.35-.5.05-1.1.07-1.8-.12-.4-.13-.95-.3-1.6-.6-2.8-1.2-4.6-4-4.75-4.2-.14-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.25-.25.55-.3.75-.3h.55c.17 0 .4-.05.62.5l.85 2.1c.07.15.1.3 0 .5l-.3.45-.4.45c-.13.14-.27.3-.12.58.15.27.7 1.15 1.5 1.85 1.05.9 1.9 1.2 2.2 1.33.27.13.43.1.6-.07.17-.2.7-.8.9-1.08.2-.28.4-.23.65-.14l2 .95c.27.14.45.2.5.32.07.1.07.65-.18 1.3z" />
    </svg>
  );
}

export function TickIcon({ className = "" }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}
