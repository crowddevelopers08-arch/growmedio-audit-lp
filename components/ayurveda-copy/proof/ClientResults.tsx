import { Counters, type Counter } from "./Counters";
import { GrowthChart, type ChartData } from "./GrowthChart";
import { Reveal } from "../ui/Reveal";

/* Figures come from the Grow Medico case study deck, except Ayush Ortho's monthly consultations, which run later.
   AVN and Ayush Ortho deliberately show no rupee amounts. */

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
  { to: 2.5, decimals: 1, post: "×", label: "clinic footfall from the Heart Health Meter app" },
  { to: 10, post: "L+", label: "heart-health assessments on the Heart Health Meter app" },
  { to: 2.5, decimals: 1, post: " Cr", label: "reach for Diabetes Harega, Madhya Pradesh Jeetega" },
];

const AVN: Counter[] = [
  { to: 20210, label: "patient inquiries" },
  { to: 2535, label: "confirmed consultations" },
  { to: 23.2, decimals: 1, post: "%", label: "of Google Search inquiries became consultations" },
  { to: 3884, label: "patients who called directly from Google" },
];

const AYUSH: Counter[] = [
  { to: 656, label: <>consultations last month, up from 25&ndash;30</> },
  { to: 20, post: "×+", label: "growth in monthly consultations" },
  { to: 7988, label: "patient inquiries across 3 branches, up to June 2026" },
  { to: 1093, label: "confirmed consultations across 3 branches, up to June 2026" },
];

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
  bars: { name: "Total footfall", formatAxis: lakhs },
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
  ariaLabel: "Chart comparing inquiries, consultations and form leads for Meta Ads and Google Search over 8 months. Hover or tap a platform for details.",
  note: "Hover or tap a platform to see its inquiries, consultations and form leads. Totals for the full 8 months.",
  bars: { name: "Total inquiries", formatAxis: count },
  metrics: [
    { name: "Consultations", formatAxis: count },
    { name: "Form leads", formatAxis: count },
  ],
  points: [
    { label: "Meta Ads", title: "Meta Ads", bar: 10753, values: [341, 9422] },
    { label: "Google Search", title: "Google Search", bar: 9457, values: [2194, 5573] },
  ],
  rows: (p) => [
    { label: "Total inquiries", val: count(p.bar ?? 0) },
    { label: "Consultations", val: count(p.values[0]), metric: 0 },
    { label: "Form leads", val: count(p.values[1]), metric: 1 },
  ],
  details: (p) => [{ label: "Inquiry to consultation", val: p.title === "Meta Ads" ? "3.1%" : "23.2%" }],
  categories: true,
};

/** [month, consultations] */
const AYUSH_MONTHS: [string, number][] = [
  ["Aug 2025", 35],
  ["Sep 2025", 48],
  ["Oct 2025", 48],
  ["Nov 2025", 54],
  ["Dec 2025", 105],
  ["Jan 2026", 90],
  ["Feb 2026", 66],
  ["Mar 2026", 66],
  ["Apr 2026", 101],
  ["May 2026", 167],
  ["Jun 2026", 240],
  ["Jul 2026", 520],
  ["Aug 2026", 564],
  ["Sep 2026", 656],
];

const AYUSH_CHART: ChartData = {
  title: "Month by month, Aug 2025 to Sep 2026",
  ariaLabel: "Chart of monthly consultations from August 2025 to September 2026. Hover or tap a month for details.",
  note: "Hover or tap any month to see its consultations.",
  metrics: [{ name: "Consultations", formatAxis: String }],
  points: AYUSH_MONTHS.map(([title, consultations], i) => {
    const [label, year] = title.split(" ");
    return { label, sub: i === 0 || label === "Jan" ? year : undefined, title, bar: null, values: [consultations] };
  }),
  rows: (p) => [{ label: "Consultations", val: String(p.values[0]), metric: 0 }],
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
        head={["Platform", "Form leads", "Phone calls", "WhatsApp", "Total inquiries", "Consultations", "Inquiry to consultation"]}
        rows={[
          ["Meta Ads", "9,422", "—", "1,331", "10,753", "341", "3.1%"],
          ["Google Search", "5,573", "3,884", "—", "9,457", "2,194", "23.2%"],
          ["Total", "14,995", "3,884", "1,331", "20,210", "2,535", "12.5%"],
        ]}
      />
    </>
  );
}

export function AyushResults() {
  return (
    <>
      <Heading client="Ayush Ortho Ayurveda Clinic" title={<>From 25&ndash;30 consultations a month to 656.</>} desc="One Ayurveda clinic, one steady climb." />
      <Counters items={AYUSH} />
      <GrowthChart data={AYUSH_CHART} />
      <ResultsTable
        title="Across three branches"
        note="Branch campaign figures up to June 2026."
        head={["Branch", "Period", "Inquiries", "Consultations", "Inquiry to consultation"]}
        rows={[
          ["Tambaram", "6 months", "5,740", "783", "13.6%"],
          ["Ambattur", "4 months", "1,174", "135", "11.5%"],
          ["Pondicherry", "4 months", "1,074", "175", "16.3%"],
          ["Total", "", "7,988", "1,093", "13.7%"],
        ]}
      />
    </>
  );
}
