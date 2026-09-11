"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ctaClass } from "@/components/ui/CtaButton";
import { LockIcon, ShieldIcon } from "@/components/ui/Icons";
import { SESSION_PRICE_LABEL, SITE, SPECIALTIES } from "@/lib/site";

/*
 * Booking flow
 * ------------
 * 1. This form          → POST /api/lead (saves the lead in the database)
 * 2. /payment/[leadId]  → Razorpay checkout (components/payment/PayButton)
 * 3. /thank-you?order=  → confirmation, read back from the database
 */

// ── Context ──────────────────────────────────────────────────────────────────
const BookingContext = createContext<{ openBooking: () => void } | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal open={open} onClose={closeBooking} />
    </BookingContext.Provider>
  );
}

// ── Form helpers ─────────────────────────────────────────────────────────────
interface FormValues {
  name: string;
  phone: string;
  email: string;
  city: string;
  specialty: string;
}

const EMPTY: FormValues = { name: "", phone: "", email: "", city: "", specialty: "" };

// Mirrors the checks in app/api/lead/route.ts so most mistakes are caught
// before a round-trip.
function validate(v: FormValues) {
  if (v.name.trim().length < 2) return "Please enter your name.";
  if (!/^[a-zA-Z\s'.-]+$/.test(v.name.trim())) return "Name should contain letters only.";
  if (!/^[6-9]\d{9}$/.test(v.phone)) return "Please enter a valid 10-digit Indian mobile number.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    return "Please enter a valid email address.";
  if (!v.specialty) return "Please pick your specialty.";
  return "";
}

const inputClass =
  "w-full rounded-[12px] border border-line-strong bg-bg px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-faint focus:border-brand";

// ── Modal ────────────────────────────────────────────────────────────────────
function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const firstField = useRef<HTMLInputElement>(null);

  // Lock the page behind the dialog and focus the first field.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting, onClose]);

  const set = (key: keyof FormValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = validate(values);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone,
          email: values.email.trim(),
          city: values.city.trim(),
          specialty: values.specialty,
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.leadId) {
        throw new Error(data.error || "We couldn't save your details. Please try again.");
      }
      // Stays in the submitting state until the payment page takes over.
      router.push(`/payment/${data.leadId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't save your details. Please try again.");
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center bg-[rgba(3,4,6,0.78)] p-4 backdrop-blur-[6px] min-[560px]:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative max-h-[calc(100dvh-32px)] w-full max-w-[460px] overflow-y-auto rounded-[22px] border border-line-strong bg-surface p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] min-[560px]:p-7"
      >
        {!submitting && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-faint transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}

        <div className="pr-8">
          <span className="text-[0.8rem] font-semibold text-brand">
            Step 1 of 2 · Your details
          </span>
          <h2
            id="booking-title"
            className="mt-1.5 font-display text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.01em]"
          >
            Book your {SESSION_PRICE_LABEL} Strategy Session
          </h2>
          <p className="mt-2 text-[0.9rem] text-dim">
            Tell us about your clinic, then complete a secure {SESSION_PRICE_LABEL}{" "}
            payment on the next step.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-3">
          <Field label="Your name" htmlFor="bk-name">
            <input
              ref={firstField}
              id="bk-name"
              autoComplete="name"
              placeholder="Dr. Priya Sharma"
              value={values.name}
              onChange={(e) => set("name")(e.target.value)}
              disabled={submitting}
              className={inputClass}
            />
          </Field>

          <Field label="WhatsApp / mobile number" htmlFor="bk-phone">
            <div className="flex">
              <span className="flex items-center rounded-l-[12px] border border-r-0 border-line-strong bg-surface-2 px-3 text-[0.95rem] text-dim">
                +91
              </span>
              <input
                id="bk-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="98765 43210"
                value={values.phone}
                onChange={(e) =>
                  set("phone")(e.target.value.replace(/\D/g, "").replace(/^91(?=\d{10})/, "").slice(0, 10))
                }
                disabled={submitting}
                className={`${inputClass} rounded-l-none`}
              />
            </div>
          </Field>

          <Field label="Email" optional htmlFor="bk-email">
            <input
              id="bk-email"
              type="email"
              autoComplete="email"
              placeholder="you@clinic.com"
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              disabled={submitting}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-3 min-[420px]:grid-cols-2">
            <Field label="Specialty" htmlFor="bk-specialty">
              <select
                id="bk-specialty"
                value={values.specialty}
                onChange={(e) => set("specialty")(e.target.value)}
                disabled={submitting}
                className={`${inputClass} [color-scheme:dark] ${values.specialty ? "" : "text-faint"}`}
              >
                <option value="" disabled>
                  Select…
                </option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s} className="text-ink">
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="City" optional htmlFor="bk-city">
              <input
                id="bk-city"
                autoComplete="address-level2"
                placeholder="Chennai"
                value={values.city}
                onChange={(e) => set("city")(e.target.value)}
                disabled={submitting}
                className={inputClass}
              />
            </Field>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-[12px] border border-[rgba(255,107,107,0.3)] bg-danger-wash px-4 py-3 text-[0.87rem] text-danger"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={ctaClass({ block: true, className: "mt-2" })}
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04160F] border-t-transparent" />
                Taking you to payment…
              </>
            ) : (
              <>Continue to Payment →</>
            )}
          </button>

          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4 text-[0.8rem] text-faint">
            <span className="inline-flex items-center gap-2">
              <LockIcon className="h-[14px] w-[14px] shrink-0 text-brand" />
              Secure checkout by Razorpay · UPI, cards, net banking
            </span>
            <span className="inline-flex items-start gap-2">
              <ShieldIcon className="mt-0.5 h-[14px] w-[14px] shrink-0 text-brand" />
              3 concrete revenue opportunities, or your {SESSION_PRICE_LABEL} back.
            </span>
            <span>
              By continuing you agree to our{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-dim underline underline-offset-2 hover:text-brand"
              >
                Privacy Policy
              </Link>{" "}
              and to be contacted by {SITE.name} about your session.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  optional = false,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.82rem] font-medium text-dim">
        {label}
        {optional && <span className="ml-1 text-faint">(optional)</span>}
      </label>
      {children}
    </div>
  );
}
