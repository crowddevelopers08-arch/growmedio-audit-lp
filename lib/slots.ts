import { PAID_STATUSES } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { bookableDateKeys, istDateKey, slotToDate, SLOT_TIMES } from "@/lib/booking";

/**
 * Which slots are still free.
 *
 * A slot counts as taken when either:
 *  - a lead has paid for it, permanently, or
 *  - an unpaid lead picked it within the last HOLD_MINUTES.
 *
 * The hold is what stops two people paying for the same time while one of them
 * is inside Razorpay's checkout; letting it expire is what stops every
 * abandoned checkout burning a slot for good.
 */
export const HOLD_MINUTES = 20;

export interface Availability {
  /** "2026-09-15" → the times still free that day, e.g. ["13:00", "14:40"]. */
  [dateKey: string]: string[];
}

const holdCutoff = (now: Date) => new Date(now.getTime() - HOLD_MINUTES * 60 * 1000);

/**
 * Leads occupying a slot in the given window — paid at any age, unpaid only
 * while their hold is still live.
 */
function takenWhere(from: Date, to: Date, now: Date) {
  return {
    slotAt: { gte: from, lte: to },
    OR: [
      { payments: { some: { status: { in: PAID_STATUSES } } } },
      { createdAt: { gte: holdCutoff(now) } },
    ],
  };
}

/** Every bookable day with the times still open on it. */
export async function loadAvailability(now = new Date()): Promise<Availability> {
  const dateKeys = bookableDateKeys(now);
  if (dateKeys.length === 0) return {};

  const from = slotToDate(dateKeys[0], SLOT_TIMES[0]);
  const to = slotToDate(dateKeys[dateKeys.length - 1], SLOT_TIMES[SLOT_TIMES.length - 1]);

  const taken = await prisma.lead.findMany({
    where: takenWhere(from, to, now),
    select: { slotAt: true },
  });

  const takenKeys = new Set(
    taken.flatMap((lead) => (lead.slotAt ? [lead.slotAt.toISOString()] : []))
  );

  const availability: Availability = {};
  for (const dateKey of dateKeys) {
    const free = SLOT_TIMES.filter(
      (time) => !takenKeys.has(slotToDate(dateKey, time).toISOString())
    );
    if (free.length > 0) availability[dateKey] = free;
  }
  return availability;
}

/**
 * Whether one specific slot is still free. Checked again server-side at lead
 * creation, since the browser's copy of availability may be minutes old.
 */
export async function isSlotFree(slot: Date, now = new Date()): Promise<boolean> {
  const clash = await prisma.lead.findFirst({
    where: takenWhere(slot, slot, now),
    select: { id: true },
  });
  return !clash;
}

/** Convenience for the dashboard: today's date key in IST. */
export const todayKey = () => istDateKey(new Date());
