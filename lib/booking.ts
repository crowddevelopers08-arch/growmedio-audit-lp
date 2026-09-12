/**
 * Booking slots and the qualification questions behind the ₹199 session.
 *
 * Slots are defined in India time and stored as real UTC instants, so they stay
 * correct whatever timezone the server runs in.
 */

// ── Slot configuration ───────────────────────────────────────────────────────
export const SLOT_CONFIG = {
  /** First call of the day starts at 1:00 pm IST. */
  dayStart: "13:00",
  /** No call may run past 5:00 pm IST. */
  dayEnd: "17:00",
  /** Minutes on the call. */
  durationMinutes: 45,
  /** Minutes between one call ending and the next starting. */
  breakMinutes: 5,
  /** 0 = Sunday. Mon–Sat are bookable. */
  closedWeekdays: [0],
  /** Earliest bookable day, counted from today (1 = tomorrow). */
  leadTimeDays: 1,
  /** How many days ahead the calendar opens. */
  horizonDays: 21,
} as const;

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Start times, as "HH:MM" in IST. A slot is offered only if the whole call
 * finishes by `dayEnd` — with 45-minute calls and 5-minute breaks from 1:00 pm
 * that yields 1:00, 1:50, 2:40 and 3:30, the last ending at 4:15 pm.
 */
export const SLOT_TIMES: string[] = (() => {
  const { dayStart, dayEnd, durationMinutes, breakMinutes } = SLOT_CONFIG;
  const end = toMinutes(dayEnd);
  const times: string[] = [];
  for (
    let start = toMinutes(dayStart);
    start + durationMinutes <= end;
    start += durationMinutes + breakMinutes
  ) {
    times.push(`${pad(Math.floor(start / 60))}:${pad(start % 60)}`);
  }
  return times;
})();

// ── IST date helpers ─────────────────────────────────────────────────────────
/** "2026-09-15" for the given instant, in India time. */
export function istDateKey(date: Date): string {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  return `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())}`;
}

/** The UTC instant of an IST wall-clock slot, e.g. ("2026-09-15", "13:50"). */
export function slotToDate(dateKey: string, time: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - IST_OFFSET_MS);
}

/** Day of week (0 = Sunday) for a "2026-09-15" key. */
export function dateKeyWeekday(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export const isClosedDay = (dateKey: string) =>
  (SLOT_CONFIG.closedWeekdays as readonly number[]).includes(dateKeyWeekday(dateKey));

/** Every date key the calendar may offer, earliest first. */
export function bookableDateKeys(now = new Date()): string[] {
  const todayKey = istDateKey(now);
  const [y, m, d] = todayKey.split("-").map(Number);
  const start = Date.UTC(y, m - 1, d);
  const keys: string[] = [];

  for (let i = SLOT_CONFIG.leadTimeDays; i < SLOT_CONFIG.horizonDays; i++) {
    const day = new Date(start + i * DAY_MS);
    const key = `${day.getUTCFullYear()}-${pad(day.getUTCMonth() + 1)}-${pad(day.getUTCDate())}`;
    if (!isClosedDay(key)) keys.push(key);
  }
  return keys;
}

/** True if the chosen date and time are a slot we actually offer. */
export function isValidSlot(dateKey: string, time: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return false;
  if (!SLOT_TIMES.includes(time)) return false;
  return bookableDateKeys(now).includes(dateKey);
}

// ── Display ──────────────────────────────────────────────────────────────────
const DATE_LABEL = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** "Mon, 15 Sep" */
export function dateKeyLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return DATE_LABEL.format(new Date(Date.UTC(y, m - 1, d)));
}

/** "1:50 pm" from "13:50". */
export function timeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
}

/** "1:00 – 1:45 pm" — start and end of a slot, for the time buttons. */
export function slotRangeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const end = h * 60 + m + SLOT_CONFIG.durationMinutes;
  const endTime = `${pad(Math.floor(end / 60))}:${pad(end % 60)}`;
  const start = timeLabel(time);
  const finish = timeLabel(endTime);
  // Drop the repeated meridiem: "1:00 – 1:45 pm" rather than "1:00 pm – 1:45 pm".
  const [startClock, startMeridiem] = start.split(" ");
  return startMeridiem === finish.split(" ")[1] ? `${startClock} – ${finish}` : `${start} – ${finish}`;
}

/** Month a date key falls in, as { year, month } with month 0-indexed. */
export function dateKeyMonth(dateKey: string): { year: number; month: number } {
  const [year, month] = dateKey.split("-").map(Number);
  return { year, month: month - 1 };
}

const MONTH_LABEL = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "September 2026" */
export const monthLabel = (year: number, month: number) =>
  MONTH_LABEL.format(new Date(Date.UTC(year, month, 1)));

/** Build the "2026-09-15" key for a calendar cell. */
export const makeDateKey = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

/** "Mon, 15 Sep · 1:50 pm – 2:35 pm IST" for a stored slot instant. */
export function slotLabel(slot: Date): string {
  const key = istDateKey(slot);
  const ist = new Date(slot.getTime() + IST_OFFSET_MS);
  const start = `${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}`;
  const finish = new Date(slot.getTime() + SLOT_CONFIG.durationMinutes * MINUTE_MS);
  const finishIst = new Date(finish.getTime() + IST_OFFSET_MS);
  const endTime = `${pad(finishIst.getUTCHours())}:${pad(finishIst.getUTCMinutes())}`;
  return `${dateKeyLabel(key)} · ${timeLabel(start)} – ${timeLabel(endTime)} IST`;
}

// ── Qualification questions ──────────────────────────────────────────────────
export const SPECIALTY_OPTIONS = [
  "Dental",
  "Dermatology / Aesthetics",
  "Hair restoration",
  "IVF / Gynaecology",
  "Orthopaedics",
  "Ophthalmology",
  "Multispeciality",
  "Other",
] as const;

export const ENQUIRY_HANDLER_OPTIONS = [
  "I handle them personally",
  "Receptionist",
  "Clinic / Hospital Manager",
  "One dedicated tele-caller",
  "Two or more tele-callers",
  "External call centre",
  "We do not have a structured calling team",
] as const;

export const AD_SPEND_OPTIONS = [
  "Not currently spending on ads",
  "Below ₹1 lakh per month",
  "₹1–2 lakh per month",
  "₹2–3 lakh per month",
  "₹3–5 lakh per month",
  "More than ₹5 lakh per month",
] as const;

export const MONTHLY_REVENUE_OPTIONS = [
  "Below ₹5 lakh",
  "₹5–10 lakh",
  "₹10–25 lakh",
  "₹25–50 lakh",
  "₹50 lakh–₹1 crore",
  "More than ₹1 crore",
  "Prefer not to disclose",
] as const;

export const DECISION_MAKER_OPTIONS = [
  "Yes",
  "Yes, along with a business partner",
  "No, but the decision-maker can attend the call",
  "No, and the decision-maker will not attend",
] as const;

/** Every choice the API will accept for a given field. */
export const CHOICES = {
  specialty: SPECIALTY_OPTIONS,
  enquiryHandler: ENQUIRY_HANDLER_OPTIONS,
  adSpend: AD_SPEND_OPTIONS,
  monthlyRevenue: MONTHLY_REVENUE_OPTIONS,
  decisionMaker: DECISION_MAKER_OPTIONS,
} as const;
