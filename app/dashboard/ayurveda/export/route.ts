export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { listAyurvedaLeads } from "@/lib/ayurvedaLeads";
import { formatIST, sourceOf } from "@/lib/leads";

/** CSV of the Ayurveda leads tab's current search. */

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  // Stop spreadsheet apps executing a value as a formula.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 100);
  const leads = await listAyurvedaLeads({ q, take: 50000, skip: 0 });

  const header = ["Submitted (IST)", "Name", "Phone", "Email", "Clinic / Hospital", "Occupation", "Source", "Page URL"];
  const rows = leads.map((l) => [
    formatIST(l.createdAt),
    l.name,
    l.phone,
    l.email,
    l.clinic,
    l.occupation,
    sourceOf(l.pageUrl),
    l.pageUrl,
  ]);

  const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="growmedico-ayurveda-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
