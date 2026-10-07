export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { formatIST, listLeads, parseFilter, sourceOf } from "@/lib/leads";

/** CSV of the dashboard's current filter + search. */

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  // Stop spreadsheet apps executing a value as a formula.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filter = parseFilter(sp.get("filter") || "");
  const q = (sp.get("q") || "").trim().slice(0, 100);

  const leads = await listLeads({ filter, q, take: 50000, skip: 0 });

  const header = [
    "Submitted (IST)", "Name", "Phone", "Country", "Payment status",
    "Amount (INR)", "Method", "Razorpay payment ID", "Source", "Page URL",
  ];
  const rows = leads.map((l) => [
    formatIST(l.createdAt),
    l.name,
    l.phone,
    l.country,
    l.paymentStatus,
    l.amountPaise != null ? (l.amountPaise / 100).toFixed(2) : "",
    l.paymentMethod,
    l.razorpayPaymentId,
    sourceOf(l.pageUrl),
    l.pageUrl,
  ]);

  const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="growmedico-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
