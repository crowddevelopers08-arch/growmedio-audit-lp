"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "../useInView";
import { Reveal } from "../ui/Reveal";

/** [month, ad spend, consultations, revenue]; spend is null where not yet provided */
const D: [string, number | null, number, number][] = [
  ["Aug 2025", 58740.26, 35, 172935],
  ["Sep 2025", 85312.57, 48, 168411],
  ["Oct 2025", 61494.29, 48, 235570],
  ["Nov 2025", 87314.61, 54, 342685],
  ["Dec 2025", 101983.04, 105, 657503],
  ["Jan 2026", 111762.81, 90, 448429],
  ["Feb 2026", 90921.19, 66, 336016],
  ["Mar 2026", 81335.72, 66, 461788],
  ["Apr 2026", 87749.1, 101, 475532],
  ["May 2026", 101829.8, 167, 905993],
  ["Jun 2026", 178556.54, 240, 2128892],
  ["Jul 2026", 236787.9, 520, 3194278],
  ["Aug 2026", 220651.23, 564, 3659396],
  ["Sep 2026", null, 656, 4400000],
];

type Metric = "cons" | "rev";
const MT = 16, MB = 44;

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
function nice(max: number) {
  const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

function Row({ label, val, hi }: { label: string; val: string; hi?: boolean }) {
  return (
    <div className="flex justify-between gap-[18px] py-[3px] text-ay-muted">
      <span>{label}</span>
      <span className={`text-right font-semibold tabular-nums ${hi ? "text-ay-gold" : "text-ay-fg"}`}>{val}</span>
    </div>
  );
}

/** Interactive month-by-month chart: consultations or revenue as a line, ad spend as bars. */
export function GrowthChart() {
  const [boxRef, inView] = useInView<HTMLDivElement>();
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(800);
  const [metric, setMetric] = useState<Metric>("cons");
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
  const iw = W - ML - MR, ih = H - MT - MB, n = D.length, step = iw / n, bw = Math.min(34, step * 0.58);
  const key = metric === "cons" ? 2 : 3;
  const ls = nice(Math.max(...D.map((d) => d[key] as number)));
  const rs = nice(Math.max(...D.flatMap((d) => (d[1] == null ? [] : [d[1]]))));
  const X = (i: number) => ML + step * (i + 0.5);
  const YL = (v: number) => MT + ih - (v / (ls * 4)) * ih;
  const YR = (v: number) => MT + ih - (v / (rs * 4)) * ih;

  const pts = D.map((d, j) => [X(j), YL(d[key] as number)] as const);
  let path = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6, MT, MT + ih), c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6, MT, MT + ih);
    path += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${c1y},${p2[0] - (p3[0] - p1[0]) / 6} ${c2y},${p2[0]} ${p2[1]}`;
  }
  const area = `${path} L${pts[n - 1][0]} ${MT + ih} L${pts[0][0]} ${MT + ih} Z`;

  const dd = D[sel], cx = X(sel), cy = YL(dd[key] as number);

  // keep the tooltip beside the selected month, inside the chart
  useLayoutEffect(() => {
    const tip = tipRef.current!;
    const tw = tip.offsetWidth || 220, th = tip.offsetHeight || 150;
    let left = cx + 16;
    if (left + tw > W - 4) left = cx - 16 - tw;
    if (left < 4) left = 4;
    const top = clamp(cy - th / 2, 4, H - MB - th);
    tip.style.transform = `translate(${left}px,${top}px)`;
  }, [cx, cy, W, H, metric]);

  const idxFrom = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width);
    return clamp(Math.floor((x - ML) / step), 0, n - 1);
  };

  const animating = inView && !settled;

  return (
    <Reveal className="mt-[18px]">
      <div
        ref={boxRef}
        className="rounded-[22px] border border-ay-line bg-[rgba(246,250,223,.86)] px-7 pb-[18px] pt-7 backdrop-blur-[6px] max-[560px]:px-[10px] max-[560px]:pb-3 max-[560px]:pt-[18px]"
      >
        <div className="mb-2 flex flex-wrap justify-between gap-x-6 gap-y-[10px] text-[14px] text-ay-muted">
          <span>
            <b className="text-[16px] font-semibold text-ay-fg">Month by month, Aug 2025 to Sep 2026</b>
          </span>
          <div role="group" aria-label="Chart metric" className="inline-flex rounded-full border border-ay-line-2 bg-white/[.04] p-1">
            {(
              [
                ["cons", "Consultations"],
                ["rev", "Revenue"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                aria-pressed={metric === m}
                onClick={() => setMetric(m)}
                className={`cursor-pointer rounded-full border-0 px-4 py-[9px] text-[13px] font-semibold leading-none transition-[background,color] duration-200 ${
                  metric === m ? "bg-ay-gold text-ay-ink" : "bg-transparent text-ay-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-1.5 mt-1 flex flex-wrap gap-x-[22px] gap-y-2 text-[13px] text-ay-muted">
          <span className="inline-flex items-center gap-2">
            <i className="h-[3px] w-[22px] rounded-[3px] bg-ay-gold" />
            {metric === "cons" ? "Consultations" : "Revenue"}
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="h-3 w-3 rounded-[3px] bg-[rgba(63,154,82,.55)]" />
            Ad spend
          </span>
        </div>

        <div
          ref={hostRef}
          role="img"
          aria-label="Chart of monthly consultations, revenue and ad spend from August 2025 to September 2026. Hover or tap a month for details."
          className="relative touch-pan-y"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            className="block h-auto w-full overflow-visible text-[12px] [&_text]:fill-ay-muted"
            onPointerMove={(e) => {
              if ((e.target as Element).hasAttribute("data-hit")) setSel(idxFrom(e));
            }}
            onPointerDown={(e) => setSel(idxFrom(e))}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") setSel(n - 1);
            }}
          >
            <defs>
              <linearGradient id="ay-icg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#00602f" stopOpacity=".38" />
                <stop offset="1" stopColor="#00602f" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3, 4].map((k) => {
              const gy = MT + ih - (ih * k) / 4;
              return (
                <g key={k}>
                  <line x1={ML} x2={W - MR} y1={gy} y2={gy} stroke="rgba(0,58,28,.08)" />
                  <text x={ML - 8} y={gy + 4} textAnchor="end" style={{ fill: "rgba(63,154,82,.85)" }}>
                    ₹{(k * rs) / 1e5}L
                  </text>
                  <text x={W - MR + 8} y={gy + 4}>
                    {metric === "cons" ? String(k * ls) : `₹${(k * ls) / 1e5}L`}
                  </text>
                </g>
              );
            })}

            {D.map((d, i) => {
              if (d[1] == null) return null;
              const by = YR(d[1]);
              return (
                <rect
                  key={i}
                  data-hit
                  x={X(i) - bw / 2}
                  y={by}
                  width={bw}
                  height={MT + ih - by}
                  rx={3}
                  fill={i === sel ? "rgba(63,154,82,.85)" : "rgba(63,154,82,.45)"}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "bottom",
                    transform: inView ? "none" : "scaleY(0)",
                    transition: `fill .2s, transform .9s cubic-bezier(.2,.7,.2,1) ${i * 0.05 + 0.2}s`,
                  }}
                />
              );
            })}

            <path d={area} fill="url(#ay-icg)" className={`${inView ? "opacity-100" : "opacity-0"} ${animating ? "animate-fade-area" : ""}`} />
            <path
              d={path}
              pathLength={1}
              fill="none"
              stroke="var(--color-ay-gold)"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1}
              strokeDashoffset={inView ? 0 : 1}
              className={`[filter:drop-shadow(0_0_8px_rgba(0,96,47,.7))] ${animating ? "animate-draw" : ""}`}
            />
            <g className={`${inView ? "opacity-100" : "opacity-0"} ${animating ? "animate-fade-pts" : ""}`}>
              {pts.map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={small ? 3 : 4} fill="var(--color-ay-bg)" stroke="var(--color-ay-gold)" strokeWidth={2.2} />
              ))}
            </g>

            {D.map((d, i) => {
              const [mon, yr] = d[0].split(" ");
              if (small && i % 2 !== 0 && i !== n - 1) return null;
              return (
                <g key={i}>
                  <text x={X(i)} y={MT + ih + 18} textAnchor="middle">
                    {mon}
                  </text>
                  {(i === 0 || mon === "Jan") && (
                    <text x={X(i)} y={MT + ih + 33} textAnchor="middle" style={{ fill: "rgba(74,79,74,.7)", fontSize: 11 }}>
                      {yr}
                    </text>
                  )}
                </g>
              );
            })}

            <line x1={cx} x2={cx} y1={MT} y2={MT + ih} stroke="rgba(0,58,28,.35)" strokeDasharray="3 4" />
            <circle cx={cx} cy={cy} r={7} fill="var(--color-ay-gold)" stroke="var(--color-ay-bg)" strokeWidth={3} />
            <rect data-hit x={ML} y={MT} width={iw} height={ih} fill="transparent" />
          </svg>

          <div
            ref={tipRef}
            className="pointer-events-none absolute left-0 top-0 z-[3] min-w-[220px] rounded-[14px] border border-ay-gold/50 bg-[rgba(246,250,223,.96)] px-4 py-[14px] text-[13.5px] shadow-[0_18px_50px_-10px_rgba(0,0,0,.8)] transition-transform duration-[140ms] ease-[ease] max-[560px]:min-w-[190px] max-[560px]:px-3 max-[560px]:py-[11px] max-[560px]:text-[12.5px]"
          >
            <b className="mb-2 block text-[15px]">{dd[0]}</b>
            <Row label="Ad spend" val={dd[1] == null ? "Not reported yet" : inr(dd[1])} />
            <Row label="Consultations" val={String(dd[2])} hi={metric === "cons"} />
            <Row label="Revenue" val={(dd[0] === "Sep 2026" ? "≈ " : "") + inr(dd[3])} hi={metric === "rev"} />
            {dd[1] != null && (
              <>
                <hr className="my-2 border-0 border-t border-ay-line" />
                <Row label="Revenue per ₹1 of ad spend" val={"₹" + (dd[3] / dd[1]).toFixed(1)} />
                <Row label="Ad spend per consultation" val={inr(dd[1] / dd[2])} />
              </>
            )}
          </div>
        </div>

        <p className="mt-[10px] px-2 text-[12.5px] text-ay-muted">
          Hover or tap any month to see ad spend, consultations and revenue. Revenue per &#8377;1 of ad spend is revenue divided by ad
          spend.
        </p>
      </div>
    </Reveal>
  );
}
