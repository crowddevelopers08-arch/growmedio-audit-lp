"use client";

export interface CalendlyPrefill {
  name?: string;
  email?: string;
}

interface CalendlyGlobal {
  initInlineWidget: (options: {
    url: string;
    parentElement: HTMLElement;
    prefill?: CalendlyPrefill;
    utm?: Record<string, string>;
  }) => void;
}

declare global {
  interface Window {
    Calendly?: CalendlyGlobal;
  }
}

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

let loader: Promise<void> | null = null;

/**
 * Loads Calendly's inline widget on demand. The calendar only appears after
 * payment, so there is no reason to ship this script on first paint.
 */
export function loadCalendlyWidget(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Calendly) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      loader = null;
      reject(new Error("Could not load the booking calendar."));
    });

    if (!existing) {
      script.src = WIDGET_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return loader;
}
