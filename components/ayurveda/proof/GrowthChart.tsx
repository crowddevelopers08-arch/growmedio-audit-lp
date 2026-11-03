"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "../useInView";
import { Reveal } from "../ui/Reveal";

export type ChartPoint = {
  /** Axis label, e.g. "Aug" */
  label: string;
  /** Optional second axis line, e.g. "2025" */
  sub?: string;
  /** Tooltip heading, e.g. "Aug 2025" */
  title: string;
  /** Bar height; null where not reported */
  bar: number | null;
  /** The line metrics, in the same order as ChartData.metrics */
  values: number[];
};

type TipRow = { label: string; val: string; metric?: number };

export type ChartData = {
  title: string;
  ariaLabel: string;
  note: string;
  /** Leave out for a chart with no bars and no left axis. */
  bars?: { name: string; formatAxis: (v: number) => string };
  /** One or two; the tabs only appear with two. */
  metrics: { name: string; formatAxis: (v: number) => string }[];
  points: ChartPoint[];
  /** Tooltip rows; `metric` highlights a row while that metric is selected. */
  rows: (p: ChartPoint) => TipRow[];
  /** Optional rows under a divider in the tooltip. */
  details?: (p: ChartPoint) => TipRow[];
  /** Separate categories rather than a time series: no trend line, wider bars. */
  categories?: boolean;
};

const MT = 16, MB = 44;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
function nice(max: number) {
  const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

function Row({ label, val, hi }: { label: string; val: string; hi?: boolean }) {
  return (
    <div className="flex justify-between gap-[18px] py-[3px] text-ay-muted">
      <span>{label}</span>
      <span className={`text-right font-semibold tabular-nums ${hi ? "text-ay-brand" : "text-ay-fg"}`}>{val}</span>
    </div>
  );
}

/** Interactive chart: one of two metrics as a line (or points, for categories), a third figure as bars. */
export function GrowthChart({ data }: { data: ChartData }) {
  const D = data.points;
  const [boxRef, inView] = useInView<HTMLDivElement>();
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(800);
  const [metric, setMetric] = useState(0);
  const [sel, setSel] = useState(D.length - 1);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const host = hostRef.current!;
    const measure = () => setW(host.clientWidth || 800);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  // after the entrance animation, switching metric just morphs instead of replaying it
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSettled(true), 4600);
    return () => clearTimeout(t);
  }, [inView]);

  const small = W < 520;
  const H = small ? 300 : W < 800 ? 340 : 380;
  const ML = small ? 40 : 54, MR = small ? 42 : 60;
  const iw = W - ML - MR, ih = H - MT - MB, n = D.length, step = iw / n;
  const bw = Math.min(data.categories ? 110 : 34, step * 0.58);
  const ls = nice(Math.max(...D.map((d) => d.values[metric])));
  const rs = data.bars ? nice(Math.max(...D.flatMap((d) => (d.bar == null ? [] : [d.bar])))) : 1;
  const X = (i: number) => ML + step * (i + 0.5);
  const YL = (v: number) => MT + ih - (v / (ls * 4)) * ih;
  const YR = (v: number) => MT + ih - (v / (rs * 4)) * ih;

  const pts = D.map((d, j) => [X(j), YL(d.values[metric])] as const);
  let path = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6, MT, MT + ih), c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6, MT, MT + ih);
    path += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${c1y},${p2[0] - (p3[0] - p1[0]) / 6} ${c2y},${p2[0]} ${p2[1]}`;
  }
  const area = `${path} L${pts[n - 1][0]} ${MT + ih} L${pts[0][0]} ${MT + ih} Z`;

  const dd = D[sel], cx = X(sel), cy = YL(dd.values[metric]);
  const details = data.details?.(dd) ?? [];

  // keep the tooltip beside the selected point, inside the chart
  useLayoutEffect(() => {
    const tip = tipRef.current!;
    const tw = tip.offsetWidth || 220, th = tip.offsetHeight || 150;
    let left = cx + 16;
    if (left + tw > W - MR) left = cx - 16 - tw;
    if (left < 4) left = 4;
    const top = clamp(cy - th / 2, 4, H - MB - th);
    tip.style.transform = `translate(${left}px,${top}px)`;
  }, [cx, cy, W, H, MR, metric]);

  const idxFrom = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width);
    return clamp(Math.floor((x - ML) / step), 0, n - 1);
  };

  const animating = inView && !settled;

  return (
    <Reveal className="mt-[18px]">
      <div
        ref={boxRef}
        className="rounded-[22px] border border-ay-line bg-ay-panel px-7 pb-[18px] pt-7 backdrop-blur-[6px] max-[560px]:px-[10px] max-[560px]:pb-3 max-[560px]:pt-[18px]"
      >
        <div className="mb-2 flex flex-wrap justify-between gap-x-6 gap-y-[10px] text-[15px] font-medium text-ay-muted">
          <span>
            <b className="text-[16px] font-semibold text-ay-fg">{data.title}</b>
          </span>
          {data.metrics.length > 1 && (
            <div role="group" aria-label="Chart metric" className="inline-flex rounded-full border border-ay-line-2 bg-ay-fg/[.04] p-1">
              {data.metrics.map((m, i) => (
                <button
                  key={m.name}
                  type="button"
                  aria-pressed={metric === i}
                  onClick={() => setMetric(i)}
                  className={`cursor-pointer rounded-full border-0 px-4 py-[9px] text-[14.5px] font-bold leading-none transition-[background,color] duration-200 ${
                    metric === i ? "bg-ay-brand text-ay-ink" : "bg-transparent text-ay-muted"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-1.5 mt-1 flex flex-wrap gap-x-[22px] gap-y-2 text-[14.5px] font-medium text-ay-muted">
          <span className="inline-flex items-center gap-2">
            {data.categories ? <i className="h-3 w-3 rounded-full bg-ay-brand" /> : <i className="h-[3px] w-[22px] rounded-[3px] bg-ay-brand" />}
            {data.metrics[metric].name}
          </span>
          {data.bars && (
            <span className="inline-flex items-center gap-2">
              <i className="h-3 w-3 rounded-[3px] bg-[rgba(22,212,146,.55)]" />
              {data.bars.name}
            </span>
          )}
        </div>

        <div ref={hostRef} role="img" aria-label={data.ariaLabel} className="relative touch-pan-y">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            className="block h-auto w-full overflow-visible text-[13.5px] font-medium [&_text]:fill-ay-muted"
            onPointerMove={(e) => {
              if ((e.target as Element).hasAttribute("data-hit")) setSel(idxFrom(e));
            }}
            onPointerDown={(e) => setSel(idxFrom(e))}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") setSel(n - 1);
            }}
          >

            {[0, 1, 2, 3, 4].map((k) => {
              const gy = MT + ih - (ih * k) / 4;
              return (
                <g key={k}>
                  <line x1={ML} x2={W - MR} y1={gy} y2={gy} stroke="rgba(243,245,247,.1)" />
                  {data.bars && (
                    <text x={ML - 8} y={gy + 4} textAnchor="end" style={{ fill: "rgba(243,245,247,.65)" }}>
                      {data.bars.formatAxis(k * rs)}
                    </text>
                  )}
                  <text x={W - MR + 8} y={gy + 4}>
                    {data.metrics[metric].formatAxis(k * ls)}
                  </text>
                </g>
              );
            })}

            {D.map((d, i) => {
              if (d.bar == null) return null;
              const by = YR(d.bar);
              return (
                <rect
                  key={i}
                  data-hit
                  x={X(i) - bw / 2}
                  y={by}
                  width={bw}
                  height={MT + ih - by}
                  rx={3}
                  fill={i === sel ? "rgba(22,212,146,.85)" : "rgba(22,212,146,.45)"}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "bottom",
                    transform: inView ? "none" : "scaleY(0)",
                    transition: `fill .2s, transform .9s cubic-bezier(.2,.7,.2,1) ${i * 0.05 + 0.2}s`,
                  }}
                />
              );
            })}

            {!data.categories && (
              <>
                <path d={area} fill="rgba(22,212,146,.08)" className={`${inView ? "opacity-100" : "opacity-0"} ${animating ? "animate-fade-area" : ""}`} />
                <path
                  d={path}
                  pathLength={1}
                  fill="none"
                  stroke="var(--color-ay-brand)"
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={1}
                  strokeDashoffset={inView ? 0 : 1}
                  className={` ${animating ? "animate-draw" : ""}`}
                />
              </>
            )}
            <g className={`${inView ? "opacity-100" : "opacity-0"} ${animating ? "animate-fade-pts" : ""}`}>
              {pts.map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={small ? 3 : 4} fill="var(--color-ay-bg)" stroke="var(--color-ay-brand)" strokeWidth={2.2} />
              ))}
            </g>

            {D.map((d, i) => {
              // phones label every other point, always ending on the last one without crowding it
              if (small && !data.categories && ((i % 2 !== 0 && i !== n - 1) || i === n - 2)) return null;
              return (
                <g key={i}>
                  <text x={X(i)} y={MT + ih + 18} textAnchor="middle">
                    {d.label}
                  </text>
                  {d.sub && (
                    <text x={X(i)} y={MT + ih + 33} textAnchor="middle" style={{ fill: "rgba(243,245,247,.65)", fontSize: 13 }}>
                      {d.sub}
                    </text>
                  )}
                </g>
              );
            })}

            <line x1={cx} x2={cx} y1={MT} y2={MT + ih} stroke="rgba(242,184,75,.35)" strokeDasharray="3 4" />
            <circle cx={cx} cy={cy} r={7} fill="var(--color-ay-brand)" stroke="var(--color-ay-bg)" strokeWidth={3} />
            <rect data-hit x={ML} y={MT} width={iw} height={ih} fill="transparent" />
          </svg>

          <div
            ref={tipRef}
            className="pointer-events-none absolute left-0 top-0 z-[3] min-w-[220px] rounded-[14px] border border-ay-brand/50 bg-ay-panel px-4 py-[14px] text-[15px] font-medium shadow-[0_18px_40px_-16px_rgba(0,0,0,.3)] transition-transform duration-[140ms] ease-[ease] max-[560px]:min-w-[190px] max-[560px]:px-3 max-[560px]:py-[11px] max-[560px]:text-[14px]"
          >
            <b className="mb-2 block text-[15px] font-medium">{dd.title}</b>
            {data.rows(dd).map((r) => (
              <Row key={r.label} label={r.label} val={r.val} hi={r.metric === metric} />
            ))}
            {details.length > 0 && (
              <>
                <hr className="my-2 border-0 border-t border-ay-line" />
                {details.map((r) => (
                  <Row key={r.label} label={r.label} val={r.val} />
                ))}
              </>
            )}
          </div>
        </div>

        <p className="mt-[10px] px-2 text-[14px] font-medium text-ay-muted">{data.note}</p>
      </div>
    </Reveal>
  );
}
