"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadCalendlyWidget, type CalendlyPrefill } from "@/lib/calendly";
import { CALENDLY_URL } from "@/lib/site";

/** Fallback path only: Calendly also accepts name/email as query params. */
function iframeUrl(prefill?: CalendlyPrefill) {
  const url = new URL(CALENDLY_URL);
  if (prefill?.name) url.searchParams.set("name", prefill.name);
  if (prefill?.email) url.searchParams.set("email", prefill.email);
  return url.toString();
}

export default function CalendlyModal({
  open,
  onClose,
  prefill,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: CalendlyPrefill;
}) {
  const [mounted, setMounted] = useState(false);
  // Start on the official widget; drop to a plain iframe if it can't init.
  const [mode, setMode] = useState<"widget" | "iframe">("widget");
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /**
   * Calendly posts a message to the parent window at each step of its flow.
   * `calendly.event_scheduled` is the booking actually completing, which is the
   * moment we send people to /thank-you — where the conversion pixel fires.
   */
  useEffect(() => {
    if (!open) return;

    const onMessage = (e: MessageEvent) => {
      if (typeof e.origin === "string" && !e.origin.includes("calendly.com")) return;
      const data = e.data as { event?: string } | undefined;
      if (data?.event === "calendly.event_scheduled") {
        // Full navigation, so the pixel's PageView fires fresh on the page.
        window.location.href = "/thank-you";
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open]);

  useEffect(() => {
    if (!open || !mounted || mode !== "widget") return;

    let cancelled = false;

    loadCalendlyWidget()
      .then(() => {
        const parent = container.current;
        if (cancelled || !parent) return;

        // Guard the method, not just the namespace — a partially initialised
        // Calendly object is truthy but unusable.
        if (typeof window.Calendly?.initInlineWidget !== "function") {
          throw new Error("Calendly widget unavailable");
        }

        parent.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: parent,
          prefill: {
            ...(prefill?.name ? { name: prefill.name } : {}),
            ...(prefill?.email ? { email: prefill.email } : {}),
          },
        });
      })
      .catch(() => {
        // They have already paid by this point — always show a calendar.
        if (!cancelled) setMode("iframe");
      });

    return () => {
      cancelled = true;
      if (container.current) container.current.innerHTML = "";
    };
  }, [open, mounted, mode, prefill]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[350] bg-white">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-[#2B2B2B] shadow-md transition-colors hover:bg-[#f4f4f4]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {mode === "widget" ? (
        /* No `calendly-inline-widget` class on purpose: widget.js auto-scans for
           that class on load and reads the URL off `data-url`. With no such
           attribute it throws before window.Calendly is fully assigned, leaving
           the modal blank. We init manually instead. */
        <div ref={container} className="h-full w-full" style={{ minWidth: 320 }} />
      ) : (
        <iframe
          src={iframeUrl(prefill)}
          title="Select a date and time"
          className="h-full w-full border-0"
        />
      )}
    </div>,
    document.body
  );
}
