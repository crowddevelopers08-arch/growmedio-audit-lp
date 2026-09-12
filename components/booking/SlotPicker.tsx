"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SLOT_CONFIG,
  dateKeyLabel,
  dateKeyMonth,
  makeDateKey,
  monthLabel,
  slotRangeLabel,
} from "@/lib/booking";

/** "2026-09-15" → the times still open that day. */
type Availability = Record<string, string[]>;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * A month calendar beside a list of times — the pattern people already know
 * from every other booking tool, and it shows the whole month at a glance
 * instead of making them scroll a strip of dates sideways.
 */
export default function SlotPicker({
  date,
  time,
  onPick,
  disabled = false,
  /** Bumped by the parent to force a refresh after a slot is lost to someone else. */
  refreshKey = 0,
}: {
  date: string;
  time: string;
  onPick: (date: string, time: string) => void;
  disabled?: boolean;
  refreshKey?: number;
}) {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<{ year: number; month: number } | null>(null);

  useEffect(() => {
    let active = true;
    setFailed(false);

    fetch("/api/slots")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data: { availability: Availability }) => {
        if (!active) return;
        const next = data.availability ?? {};
        setAvailability(next);
        // Open on the month holding the first free day.
        const first = Object.keys(next)[0];
        if (first) setView((current) => current ?? dateKeyMonth(first));
      })
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const days = useMemo(() => Object.keys(availability ?? {}), [availability]);

  if (failed) {
    return (
      <p className="rounded-[12px] border border-[rgba(255,107,107,0.3)] bg-danger-wash px-4 py-3 text-[0.87rem] text-danger">
        We couldn&apos;t load available slots. Please refresh the page and try
        again.
      </p>
    );
  }

  if (!availability || !view) {
    return (
      <div className="grid gap-3 min-[680px]:grid-cols-[1fr_190px]">
        <div className="h-[248px] animate-pulse rounded-[14px] bg-surface-2" />
        <div className="h-[248px] animate-pulse rounded-[14px] bg-surface-2" />
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <p className="rounded-[12px] border border-line-strong bg-surface-2 px-4 py-3 text-[0.87rem] text-dim">
        Every slot in the next few weeks is booked. Complete your booking and
        we&apos;ll call you with the next available time.
      </p>
    );
  }

  // A previously chosen day can sell out while the form is open.
  const activeDate = availability[date] ? date : "";
  const times = activeDate ? availability[activeDate] : [];

  const firstMonth = dateKeyMonth(days[0]);
  const lastMonth = dateKeyMonth(days[days.length - 1]);
  const asIndex = (m: { year: number; month: number }) => m.year * 12 + m.month;
  const canGoBack = asIndex(view) > asIndex(firstMonth);
  const canGoForward = asIndex(view) < asIndex(lastMonth);

  const shiftMonth = (delta: number) => {
    const next = new Date(Date.UTC(view.year, view.month + delta, 1));
    setView({ year: next.getUTCFullYear(), month: next.getUTCMonth() });
  };

  // Blank cells so the 1st lands under its weekday.
  const leading = new Date(Date.UTC(view.year, view.month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate();

  return (
    <div className="grid min-w-0 gap-4 min-[680px]:grid-cols-[1fr_190px]">
      {/* Calendar */}
      <div className="min-w-0 rounded-[14px] border border-line-strong p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <MonthArrow
            direction="prev"
            onClick={() => shiftMonth(-1)}
            disabled={disabled || !canGoBack}
          />
          <span className="text-[0.88rem] font-semibold text-ink">
            {monthLabel(view.year, view.month)}
          </span>
          <MonthArrow
            direction="next"
            onClick={() => shiftMonth(1)}
            disabled={disabled || !canGoForward}
          />
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday} className="py-1 text-[0.68rem] text-faint">
              {weekday[0]}
            </span>
          ))}

          {Array.from({ length: leading }).map((_, i) => (
            <span key={`blank-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const key = makeDateKey(view.year, view.month, day);
            const open = Boolean(availability[key]);
            const selected = key === activeDate;

            return (
              <button
                key={key}
                type="button"
                disabled={disabled || !open}
                onClick={() => onPick(key, "")}
                aria-pressed={selected}
                aria-label={open ? `${dateKeyLabel(key)} — slots available` : undefined}
                className={`aspect-square rounded-[9px] text-[0.85rem] transition-colors ${
                  selected
                    ? "bg-brand font-semibold text-[#04160F]"
                    : open
                      ? "cursor-pointer bg-surface-2 text-ink hover:bg-brand-wash hover:text-brand"
                      : "cursor-not-allowed text-faint/40"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Times */}
      <div className="min-w-0">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="text-[0.82rem] font-medium text-dim">
            {activeDate ? dateKeyLabel(activeDate) : "Choose a time"}
          </span>
          <span className="text-[0.7rem] whitespace-nowrap text-faint">IST</span>
        </div>

        {activeDate ? (
          <div className="grid gap-2 min-[420px]:grid-cols-2 min-[680px]:grid-cols-1">
            {times.map((slot) => {
              const selected = slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(activeDate, slot)}
                  aria-pressed={selected}
                  className={`w-full cursor-pointer rounded-[10px] border px-2 py-2.5 text-center text-[0.85rem] whitespace-nowrap transition-colors disabled:cursor-not-allowed ${
                    selected
                      ? "border-brand bg-brand-wash font-semibold text-brand"
                      : "border-line-strong text-dim hover:border-brand/50 hover:text-ink"
                  }`}
                >
                  {slotRangeLabel(slot)}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-[10px] border border-dashed border-line-strong px-3 py-4 text-center text-[0.82rem] text-faint">
            Pick a date to see open times.
          </p>
        )}

        <p className="mt-2 text-[0.72rem] leading-snug text-faint">
          {SLOT_CONFIG.durationMinutes}-minute call. Greyed-out dates are fully
          booked or closed.
        </p>
      </div>
    </div>
  );
}

function MonthArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous month" : "Next month"}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong text-dim transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line-strong disabled:hover:text-dim"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
