export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { SLOT_CONFIG, SLOT_TIMES } from "@/lib/booking";
import { loadAvailability } from "@/lib/slots";

/**
 * Open slots for the booking calendar. Called when the slot step opens, and
 * again if the chosen slot is taken between picking and paying.
 */
export async function GET() {
  try {
    const availability = await loadAvailability();
    return NextResponse.json(
      {
        availability,
        times: SLOT_TIMES,
        durationMinutes: SLOT_CONFIG.durationMinutes,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[slots] Could not load availability:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not load available slots." }, { status: 500 });
  }
}
