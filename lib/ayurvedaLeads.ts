import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Ayurveda funnel leads (the `AyurvedaLead` model, table `ayurveda_leads`).
 * Shared by app/api/ayurveda-lead, /dashboard/ayurveda and its CSV export.
 */

export type { AyurvedaLead } from "@/generated/prisma/client";

function where(q: string): Prisma.AyurvedaLeadWhereInput {
  if (!q) return {};
  const digits = q.replace(/\D/g, "");
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { clinic: { contains: q, mode: "insensitive" } },
      { occupation: { contains: q, mode: "insensitive" } },
      { pageUrl: { contains: q, mode: "insensitive" } },
      ...(digits ? [{ phone: { contains: digits } }] : []),
    ],
  };
}

export function listAyurvedaLeads(opts: { q: string; take: number; skip: number }) {
  return prisma.ayurvedaLead.findMany({
    where: where(opts.q),
    orderBy: { createdAt: "desc" },
    take: opts.take,
    skip: opts.skip,
  });
}

export function countAyurvedaLeads(q: string) {
  return prisma.ayurvedaLead.count({ where: where(q) });
}

/** Midnight in India, `daysAgo` days back, as a UTC instant. */
function startOfDayIST(daysAgo = 0) {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const ist = new Date(Date.now() + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS - daysAgo * 86_400_000);
}

/** Headline numbers for the dashboard tab. */
export async function ayurvedaLeadStats() {
  const [total, today, last7] = await Promise.all([
    prisma.ayurvedaLead.count(),
    prisma.ayurvedaLead.count({ where: { createdAt: { gte: startOfDayIST() } } }),
    prisma.ayurvedaLead.count({ where: { createdAt: { gte: startOfDayIST(6) } } }),
  ]);
  return { total, today, last7 };
}
