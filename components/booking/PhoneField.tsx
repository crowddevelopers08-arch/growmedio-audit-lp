"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { COUNTRIES, type Country } from "@/lib/countries";

/** Real flag images — emoji flags don't render on Windows. */
function Flag({ iso }: { iso: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${iso.toLowerCase()}.svg`}
      alt=""
      loading="lazy"
      width={20}
      height={15}
      className="inline-block h-[14px] w-[20px] shrink-0 rounded-[2px] object-cover"
    />
  );
}

/** Dial-code selector plus a number input, as one control. */
export default function PhoneField({
  country,
  onCountry,
  value,
  onValue,
  disabled = false,
  label = "WhatsApp / mobile number",
}: {
  country: Country;
  onCountry: (c: Country) => void;
  value: string;
  onValue: (v: string) => void;
  disabled?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    const digits = q.replace(/\D/g, "");
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (digits !== "" && c.dial.includes(digits)) ||
        c.iso.toLowerCase() === q
    );
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div>
      <label
        htmlFor="bk-phone"
        className="mb-1.5 block text-[0.82rem] font-medium text-dim"
      >
        {label}
      </label>

      <div className="flex items-center overflow-hidden rounded-[12px] border border-line-strong bg-bg focus-within:border-brand">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          aria-label="Select country code"
          className="flex shrink-0 cursor-pointer items-center gap-1.5 border-r border-line-strong py-3 pr-2.5 pl-3 text-[0.95rem] text-dim transition-colors hover:text-ink disabled:cursor-not-allowed"
        >
          <Flag iso={country.iso} />
          <span>+{country.dial}</span>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-faint" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <input
          id="bk-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={(e) => onValue(e.target.value.replace(/\D/g, "").slice(0, 14))}
          disabled={disabled}
          placeholder="98765 43210"
          className="w-full bg-transparent px-3 py-3 text-[0.95rem] text-ink outline-none placeholder:text-faint"
        />
      </div>

      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[rgba(3,4,6,0.78)] backdrop-blur-[6px]"
              onClick={close}
            />
            <div className="relative flex max-h-[80vh] w-full max-w-[420px] flex-col overflow-hidden rounded-[20px] border border-line-strong bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h4 className="font-display text-[1rem] font-semibold">Select country</h4>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="border-b border-line p-3">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country or code…"
                  className="w-full rounded-[10px] border border-line-strong bg-bg px-3 py-2.5 text-[0.88rem] text-ink outline-none placeholder:text-faint focus:border-brand"
                />
              </div>

              <ul className="overflow-y-auto py-1">
                {filtered.map((c) => {
                  const selected = c.iso === country.iso && c.dial === country.dial;
                  return (
                    <li key={`${c.iso}-${c.dial}`}>
                      <button
                        type="button"
                        onClick={() => {
                          onCountry(c);
                          close();
                        }}
                        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[0.9rem] transition-colors ${
                          selected
                            ? "bg-brand-wash font-semibold text-brand"
                            : "text-dim hover:bg-surface-2 hover:text-ink"
                        }`}
                      >
                        <Flag iso={c.iso} />
                        <span className="flex-1 truncate">{c.name}</span>
                        <span className="text-faint tabular-nums">+{c.dial}</span>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="px-4 py-4 text-center text-[0.85rem] text-faint">
                    No matches
                  </li>
                )}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
