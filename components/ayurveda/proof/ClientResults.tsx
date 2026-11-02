import { Counters, type Counter } from "./Counters";
import { GrowthChart, inr, type ChartData } from "./GrowthChart";
import { Reveal } from "../ui/Reveal";

/* Figures come from the Grow Medico case study deck, except Ayush Ortho's counters and chart, which run later. */

function Heading({ client, title, desc }: { client: string; title: React.ReactNode; desc: string }) {
  return (
    <div className="text-center">
      <p className="text-[15px] font-bold uppercase tracking-[.2em] text-ay-brand max-[560px]:text-[14px]">{client}</p>
      <h3 className="mt-2 text-balance text-[clamp(23px,2.8vw,36px)] font-semibold leading-[1.15] tracking-[-0.025em]">{title}</h3>
      <p className="mt-2 text-[18px] text-ay-muted max-[560px]:text-[16px]">{desc}</p>
    </div>
  );
}

/** Simple figures table; the last row is the total. Scrolls sideways inside its card on narrow screens. */
function ResultsTable({ title, note, head, rows }: { title: string; note?: string; head: string[]; rows: string[][] }) {
  return (
    <Reveal className="mt-[18px]">
      <div className="rounded-[22px] border border-ay-line bg-ay-panel px-7 py-6 max-[560px]:px-4 max-[560px]:py-5">
        <b className="block text-[16px] font-semibold text-ay-fg">{title}</b>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15px] font-medium tabular-nums">
            <thead>
              <tr className="border-b border-ay-line-2 text-ay-muted">
                {head.map((h, i) => (
                  <th key={h} scope="col" className={`py-2.5 pr-4 font-semibold ${i ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={row[0]} className={r === rows.length - 1 ? "font-bold text-ay-brand" : "border-b border-ay-line"}>
                  {row.map((cell, i) => (
                    <td key={i} className={`py-2.5 pr-4 ${i ? "text-right" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {note && <p className="mt-3 text-[14px] font-medium text-ay-muted">{note}</p>}
      </div>
    </Reveal>
  );
}

const MADHAVBAUG: Counter[] = [
  { to: 1.57, decimals: 2, post: "L", label: "new patient footfalls" },
  { pre: "≈₹", to: 1900, label: "average cost per footfall" },
  { pre: "₹", to: 30, post: " Cr", label: "digital marketing budget managed" },
  { to: 2.5, decimals: 1, post: "×", label: "clinic footfall from the Heart Health Meter app" },
];

const MADHAVBAUG_CAMPAIGNS: Counter[] = [
  { to: 10, post: "L+", label: "heart-health assessments on the Heart Health Meter app" },
  { to: 14000, post: "+", label: "Madhavprash sales every month" },
  { to: 6000, label: "online Detox Therapy purchases every month" },
  { to: 2.5, decimals: 1, post: " Cr", label: "reach for Diabetes Harega, Madhya Pradesh Jeetega" },
];

const AVN: Counter[] = [
  { pre: "₹", to: 53, post: "L", label: "ad investment across Meta and Google" },
  { to: 20210, label: "patient inquiries" },
  { to: 2535, label: "confirmed consultations" },
  { pre: "₹", to: 2097, label: "cost per footfall" },
];

const AYUSH: Counter[] = [
  { to: 656, label: <>consultations last month, up from 25&ndash;30</> },
  { pre: "₹", to: 44, post: "L", label: <>monthly revenue, up from &#8377;1&nbsp;lakh</> },
  { to: 44, post: "×", label: "growth in monthly revenue" },
  { pre: "≈₹", to: 6700, label: "revenue per consultation" },
];

const lakhsInr = (v: number) => `₹${v / 1e5}L`;
const lakhs = (v: number) => (v >= 1e5 ? `${v / 1e5}L` : v.toLocaleString("en-IN"));
const count = (v: number) => v.toLocaleString("en-IN");

/** [FY, total footfall, new patients, packages sold], from Madhavbaug's annual performance table */
const MADHAVBAUG_YEARS: [string, number, number, number][] = [
  ["14-15", 326749, 45717, 5460],
  ["15-16", 271572, 41682, 6967],
  ["16-17", 297063, 51896, 9662],
  ["17-18", 431990, 78293, 14100],
  ["18-19", 548543, 98422, 20668],
  ["19-20", 659679, 97949, 18209],
  ["20-21", 470239, 40257, 11561],
  ["21-22", 607106, 58262, 17322],
  ["22-23", 779801, 81179, 24176],
  ["23-24", 810034, 107843, 22348],
];

const MADHAVBAUG_CHART: ChartData = {
  title: "Year by year, FY 14-15 to FY 23-24",
  ariaLabel: "Chart of Madhavbaug's yearly new patients, packages sold and total footfall from FY 14-15 to FY 23-24. Hover or tap a year for details.",
  note: "Hover or tap any year to see footfall, new patients and packages sold. Network-wide figures from Madhavbaug's annual performance reports.",
  barName: "Total footfall",
  formatBarAxis: lakhs,
  metrics: [
    { name: "New patients", formatAxis: lakhs },
    { name: "Packages sold", formatAxis: count },
  ],
  points: MADHAVBAUG_YEARS.map(([fy, footfall, patients, packages]) => ({
    label: fy,
    title: `FY ${fy}`,
    bar: footfall,
    values: [patients, packages],
  })),
  rows: (p) => [
    { label: "Total footfall", val: count(p.bar ?? 0) },
    { label: "New patients", val: count(p.values[0]), metric: 0 },
    { label: "Packages sold", val: count(p.values[1]), metric: 1 },
  ],
};

const AVN_CHART: ChartData = {
  title: "Meta Ads and Google Search, over 8 months",
  ariaLabel: "Chart comparing ad spend, consultations and inquiries for Meta Ads and Google Search over 8 months. Hover or tap a platform for details.",
  note: "Hover or tap a platform to see its ad spend, inquiries and consultations. Totals for the full 8 months.",
  barName: "Ad spend",
  formatBarAxis: lakhsInr,
  metrics: [
    { name: "Consultations", formatAxis: count },
    { name: "Inquiries", formatAxis: count },
  ],
  points: [
    { label: "Meta Ads", title: "Meta Ads", bar: 1010996, values: [341, 10753] },
    { label: "Google Search", title: "Google Search", bar: 4306222, values: [2194, 9457] },
  ],
  rows: (p) => [
    { label: "Ad spend", val: inr(p.bar ?? 0) },
    { label: "Consultations", val: count(p.values[0]), metric: 0 },
    { label: "Inquiries", val: count(p.values[1]), metric: 1 },
  ],
  details: (p) => [{ label: "Inquiry to consultation", val: p.title === "Meta Ads" ? "3.1%" : "23.2%" }],
  categories: true,
};

/** [month, ad spend, consultations, revenue]; spend is null where not yet provided */
const AYUSH_MONTHS: [string, number | null, number, number][] = [
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

const AYUSH_CHART: ChartData = {
  title: "Month by month, Aug 2025 to Sep 2026",
  ariaLabel: "Chart of monthly consultations, revenue and ad spend from August 2025 to September 2026. Hover or tap a month for details.",
  note: "Hover or tap any month to see ad spend, consultations and revenue. Revenue per ₹1 of ad spend is revenue divided by ad spend.",
  barName: "Ad spend",
  formatBarAxis: lakhsInr,
  metrics: [
    { name: "Consultations", formatAxis: String },
    { name: "Revenue", formatAxis: lakhsInr },
  ],
  points: AYUSH_MONTHS.map(([title, spend, consultations, revenue], i) => {
    const [label, year] = title.split(" ");
    return { label, sub: i === 0 || label === "Jan" ? year : undefined, title, bar: spend, values: [consultations, revenue] };
  }),
  rows: (p) => [
    { label: "Ad spend", val: p.bar == null ? "Not reported yet" : inr(p.bar) },
    { label: "Consultations", val: String(p.values[0]), metric: 0 },
    { label: "Revenue", val: (p.title === "Sep 2026" ? "≈ " : "") + inr(p.values[1]), metric: 1 },
  ],
  details: (p) =>
    p.bar == null
      ? []
      : [
          { label: "Revenue per ₹1 of ad spend", val: "₹" + (p.values[1] / p.bar).toFixed(1) },
          { label: "Ad spend per consultation", val: inr(p.bar / p.values[0]) },
        ],
};

export function MadhavbaugResults() {
  return (
    <>
      <Heading
        client="Madhavbaug"
        title={<>1.57&nbsp;lakh new patients, at about &#8377;1,900 each.</>}
        desc="End-to-end digital marketing over the last 3 financial years."
      />
      <Counters items={MADHAVBAUG} />
      <div className="mt-[18px]">
        <Counters items={MADHAVBAUG_CAMPAIGNS} flush />
      </div>
      <GrowthChart data={MADHAVBAUG_CHART} />
    </>
  );
}

export function AvnResults() {
  return (
    <>
      <Heading
        client="AVN Arogya Ayurvedic Hospital"
        title="2,535 consultations in 8 months."
        desc="Meta Ads for volume, Google Search for high-intent patients."
      />
      <Counters items={AVN} />
      <GrowthChart data={AVN_CHART} />
      <ResultsTable
        title="Where the consultations came from"
        head={["Platform", "Ad spend", "Inquiries", "Consultations", "Inquiry to consultation"]}
        rows={[
          ["Meta Ads", "₹10,10,996", "10,753", "341", "3.1%"],
          ["Google Search", "₹43,06,222", "9,457", "2,194", "23.2%"],
          ["Total", "₹53,17,218", "20,210", "2,535", "12.5%"],
        ]}
      />
    </>
  );
}

export function AyushResults() {
  return (
    <>
      <Heading client="Ayush Ortho Ayurveda Clinic" title={<>The numbers behind &#8377;44&nbsp;lakhs.</>} desc="One Ayurveda clinic, one steady climb." />
      <Counters items={AYUSH} />
      <GrowthChart data={AYUSH_CHART} />
      <ResultsTable
        title="Across three branches"
        note="Branch campaign figures up to June 2026."
        head={["Branch", "Period", "Ad spend", "Inquiries", "Consultations", "Cost per consultation"]}
        rows={[
          ["Tambaram", "6 months", "₹11,58,600", "5,740", "783", "₹1,480"],
          ["Ambattur", "4 months", "₹1,72,500", "1,174", "135", "₹1,278"],
          ["Pondicherry", "4 months", "₹1,51,864", "1,074", "175", "₹868"],
          ["Total", "", "₹14,82,964", "7,988", "1,093", "₹1,357"],
        ]}
      />
    </>
  );
}
