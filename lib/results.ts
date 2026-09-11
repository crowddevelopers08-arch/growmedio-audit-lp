/**
 * Client results shown in the hero, ticker, proof tracker and founder stats.
 *
 * Every total, ROAS and cost-per-enquiry on the page is derived from RESULTS,
 * so editing a row updates them all.
 */
export interface SpecialtyResult {
  name: string;
  clinic: string;
  adSpend: number;
  revenue: number;
  enquiries: number;
  appointments: number;
}

/**
 * Grow Medico's overall figures across all clients — drives the hero headline
 * and its revenue / ROAS stats. RESULTS below is the per-specialty breakdown
 * used for the ticker and proof tracker.
 */
export const OVERALL = {
  adSpend: 1_29_00_000,
  revenue: 12_30_00_000,
};

/** Campaigns behind the RESULTS breakdown (proof tracker). */
export const CAMPAIGNS = 32;

export const RESULTS: SpecialtyResult[] = [
  {
    name: "Dermatology",
    clinic: "Dermatology & Skin Clinic",
    adSpend: 13_42_854,
    revenue: 1_57_40_000,
    enquiries: 641,
    appointments: 641,
  },
  // Dental, Ortho, IVF and Multi-Specialty are marked as dummy figures in the
  // source dashboard — replace them with verified numbers before launch.
  {
    name: "Dental",
    clinic: "Dental Clinic",
    adSpend: 6_00_000,
    revenue: 49_20_000,
    enquiries: 420,
    appointments: 160,
  },
  {
    name: "Ortho",
    clinic: "Orthopedic Clinic",
    adSpend: 4_50_000,
    revenue: 33_30_000,
    enquiries: 300,
    appointments: 120,
  },
  {
    name: "IVF",
    clinic: "IVF & Fertility Center",
    adSpend: 8_00_000,
    revenue: 72_80_000,
    enquiries: 180,
    appointments: 90,
  },
  {
    name: "Multi-Specialty",
    clinic: "Multi-Specialty Hospital",
    adSpend: 7_00_000,
    revenue: 53_20_000,
    enquiries: 500,
    appointments: 200,
  },
  {
    name: "Pain / Ayurveda",
    clinic: "Pain & Ayurveda Clinic",
    adSpend: 4_05_692,
    revenue: 44_00_000,
    enquiries: 850,
    appointments: 850,
  },
];

type Metric = "adSpend" | "revenue" | "enquiries" | "appointments";
const sum = (key: Metric) => RESULTS.reduce((total, r) => total + r[key], 0);

export const TOTALS = {
  adSpend: sum("adSpend"),
  revenue: sum("revenue"),
  enquiries: sum("enquiries"),
  appointments: sum("appointments"),
};

export const roasOf = (r: { revenue: number; adSpend: number }) => r.revenue / r.adSpend;
export const costPerEnquiry = (r: { adSpend: number; enquiries: number }) =>
  r.adSpend / r.enquiries;

/** ₹17,48,546 — Indian digit grouping. */
export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
/** 1,491 */
export const count = (n: number) => n.toLocaleString("en-IN");
/** 17.49 (lakh), trailing zeros dropped. */
export const lakhs = (n: number) => +(n / 1e5).toFixed(2);
/** 2.01 (crore), trailing zeros dropped. */
export const crores = (n: number) => +(n / 1e7).toFixed(2);
/** ₹1.57 Cr / ₹44 Lakh */
export const shortInr = (n: number) =>
  n >= 1e7 ? `₹${crores(n)} Cr` : `₹${lakhs(n)} Lakh`;
