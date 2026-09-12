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
import SlotPicker from "@/components/booking/SlotPicker";
import { ctaClass } from "@/components/ui/CtaButton";
import { LockIcon, ShieldIcon } from "@/components/ui/Icons";
import {
  AD_SPEND_OPTIONS,
  DECISION_MAKER_OPTIONS,
  ENQUIRY_HANDLER_OPTIONS,
  MONTHLY_REVENUE_OPTIONS,
  SPECIALTY_OPTIONS,
  dateKeyLabel,
  timeLabel,
} from "@/lib/booking";
import { SESSION_PRICE_LABEL, SITE } from "@/lib/site";

/*
 * Booking flow
 * ------------
 * 1. This form          → POST /api/lead (saves the lead and holds the slot)
 * 2. /payment/[leadId]  → Razorpay checkout (components/payment/PayButton)
 * 3. /thank-you?order=  → confirmation, read back from the database
 *
 * The form is three steps so that ten questions plus a calendar never appear
 * as one wall of fields: contact → clinic & qualification → slot.
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

// ── Form values ──────────────────────────────────────────────────────────────
interface FormValues {
  name: string;
  phone: string;
  email: string;
  clinicName: string;
  city: string;
  specialty: string;
  enquiryHandler: string;
  adSpend: string;
  monthlyRevenue: string;
  decisionMaker: string;
  goal: string;
  slotDate: string;
  slotTime: string;
}

const EMPTY: FormValues = {
  name: "",
  phone: "",
  email: "",
  clinicName: "",
  city: "",
  specialty: "",
  enquiryHandler: "",
  adSpend: "",
  monthlyRevenue: "",
  decisionMaker: "",
  goal: "",
  slotDate: "",
  slotTime: "",
};

const STEPS = ["Your details", "About your clinic", "Pick your slot"] as const;

/** Mirrors app/api/lead/route.ts, so most mistakes are caught before a round-trip. */
function validateStep(step: number, v: FormValues) {
  if (step === 0) {
    if (v.name.trim().length < 2) return "Please enter your name.";
    if (!/^[a-zA-Z\s'.-]+$/.test(v.name.trim()))
      return "Name should contain letters only.";
    if (!/^[6-9]\d{9}$/.test(v.phone))
      return "Please enter a valid 10-digit Indian mobile number.";
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
      return "Please enter a valid email address.";
    if (!v.clinicName.trim()) return "Please enter your clinic or hospital name.";
    if (!v.city.trim()) return "Please enter your clinic's city and area.";
  }

  if (step === 1) {
    if (!v.specialty) return "Please pick your primary speciality.";
    if (!v.enquiryHandler) return "Please tell us who handles new patient enquiries.";
    if (!v.adSpend) return "Please pick your monthly ad spend.";
    if (!v.monthlyRevenue) return "Please pick your approximate monthly revenue.";
    if (!v.decisionMaker) return "Please tell us who makes the final decision.";
    if (v.goal.trim().length < 10)
      return "Please tell us in a sentence what you'd like to improve.";
  }

  if (step === 2) {
    if (!v.slotDate || !v.slotTime) return "Please pick a date and time for your session.";
  }

  return "";
}

const inputClass =
  "w-full rounded-[12px] border border-line-strong bg-bg px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-faint focus:border-brand";

// ── Modal ────────────────────────────────────────────────────────────────────
function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [slotRefresh, setSlotRefresh] = useState(0);
  const firstField = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

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

  // Each step starts at the top — a long step would otherwise open mid-form.
  useEffect(() => {
    dialog.current?.scrollTo({ top: 0 });
  }, [step]);

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

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const problem = validateStep(step, values);
    if (problem) {
      setError(problem);
      return;
    }

    if (step < STEPS.length - 1) {
      setError("");
      setStep((s) => s + 1);
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
          clinicName: values.clinicName.trim(),
          city: values.city.trim(),
          specialty: values.specialty,
          enquiryHandler: values.enquiryHandler,
          adSpend: values.adSpend,
          monthlyRevenue: values.monthlyRevenue,
          decisionMaker: values.decisionMaker,
          goal: values.goal.trim(),
          slotDate: values.slotDate,
          slotTime: values.slotTime,
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));

      // Someone else paid for this slot while the form was open.
      if (res.status === 409) {
        setValues((prev) => ({ ...prev, slotTime: "" }));
        setSlotRefresh((n) => n + 1);
        throw new Error(data.error || "That slot was just taken. Please pick another time.");
      }
      if (!res.ok || !data.leadId) {
        throw new Error(data.error || "We couldn't save your details. Please try again.");
      }
      // Stays in the submitting state until the payment page takes over.
      router.push(`/payment/${data.leadId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't save your details. Please try again."
      );
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const isLastStep = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center bg-[rgba(3,4,6,0.78)] p-4 backdrop-blur-[6px] min-[560px]:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative max-h-[calc(100dvh-32px)] w-full max-w-[760px] overflow-y-auto rounded-[22px] border border-line-strong bg-surface p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] min-[560px]:p-7 min-[760px]:p-8"
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
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </span>
          <h2
            id="booking-title"
            className="mt-1.5 font-display text-[1.4rem] font-semibold leading-[1.15] tracking-[-0.01em]"
          >
            {step === 2
              ? "When shall we call you?"
              : `Book your ${SESSION_PRICE_LABEL} Strategy Session`}
          </h2>
          <p className="mt-2 text-[0.9rem] text-dim">
            {step === 0 &&
              "A few details so we know who we're speaking to and where your clinic is."}
            {step === 1 &&
              "This is what lets your strategist arrive with answers instead of questions."}
            {step === 2 &&
              `Pick a slot, then complete a secure ${SESSION_PRICE_LABEL} payment to lock it in.`}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-brand" : "bg-line-strong"
              }`}
            />
          ))}
        </div>

        {/* Two columns once there's room, so a ten-question form doesn't read
            as one long vertical scroll. Fields that need the full measure —
            location, the free-text answer, the calendar — span both. */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 grid gap-3 min-[680px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[680px]:gap-x-4"
        >
          {step === 0 && (
            <>
              <Field label="Your full name" htmlFor="bk-name">
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

              <Field label="Phone / WhatsApp number" htmlFor="bk-phone">
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
                      set("phone")(
                        e.target.value.replace(/\D/g, "").replace(/^91(?=\d{10})/, "").slice(0, 10)
                      )
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

              <Field label="Clinic / hospital name" htmlFor="bk-clinic">
                <input
                  id="bk-clinic"
                  autoComplete="organization"
                  placeholder="Sharma Skin & Hair Clinic"
                  value={values.clinicName}
                  onChange={(e) => set("clinicName")(e.target.value)}
                  disabled={submitting}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Where is it located?"
                hint="City and area"
                htmlFor="bk-city"
                wide
              >
                <input
                  id="bk-city"
                  autoComplete="address-level2"
                  placeholder="Anna Nagar, Chennai"
                  value={values.city}
                  onChange={(e) => set("city")(e.target.value)}
                  disabled={submitting}
                  className={inputClass}
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Choice
                label="Primary speciality"
                id="bk-specialty"
                options={SPECIALTY_OPTIONS}
                value={values.specialty}
                onChange={set("specialty")}
                disabled={submitting}
              />
              <Choice
                label="Who currently handles new patient enquiries?"
                id="bk-handler"
                options={ENQUIRY_HANDLER_OPTIONS}
                value={values.enquiryHandler}
                onChange={set("enquiryHandler")}
                disabled={submitting}
              />
              <Choice
                label="Current total monthly ad spend"
                id="bk-spend"
                options={AD_SPEND_OPTIONS}
                value={values.adSpend}
                onChange={set("adSpend")}
                disabled={submitting}
              />
              <Choice
                label="Approximate monthly revenue"
                id="bk-revenue"
                options={MONTHLY_REVENUE_OPTIONS}
                value={values.monthlyRevenue}
                onChange={set("monthlyRevenue")}
                disabled={submitting}
              />
              <Choice
                label="Are you the final decision-maker for marketing spend?"
                id="bk-decision"
                options={DECISION_MAKER_OPTIONS}
                value={values.decisionMaker}
                onChange={set("decisionMaker")}
                disabled={submitting}
                wide
              />

              <Field
                label="Why are you looking for growth support now?"
                hint="A sentence on what you want to improve"
                htmlFor="bk-goal"
                wide
              >
                <textarea
                  id="bk-goal"
                  rows={3}
                  placeholder="Enquiries dropped after we changed agencies, and we can't tell which ads bring patients."
                  value={values.goal}
                  onChange={(e) => set("goal")(e.target.value.slice(0, 1000))}
                  disabled={submitting}
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            /* min-w-0: without it a grid item refuses to shrink below its
               content and the whole dialog scrolls sideways. */
            <div className="grid min-w-0 gap-3 min-[680px]:col-span-2">
              <SlotPicker
                date={values.slotDate}
                time={values.slotTime}
                disabled={submitting}
                refreshKey={slotRefresh}
                onPick={(date, time) =>
                  setValues((prev) => ({ ...prev, slotDate: date, slotTime: time }))
                }
              />

              {values.slotDate && values.slotTime && (
                <p className="rounded-[12px] border border-[rgba(22,212,146,0.3)] bg-brand-wash px-4 py-3 text-[0.87rem] text-ink">
                  Your session:{" "}
                  <b className="font-semibold text-brand">
                    {dateKeyLabel(values.slotDate)} at {timeLabel(values.slotTime)} IST
                  </b>
                </p>
              )}
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-[12px] border border-[rgba(255,107,107,0.3)] bg-danger-wash px-4 py-3 text-[0.87rem] text-danger min-[680px]:col-span-2"
            >
              {error}
            </p>
          )}

          <div className="mt-2 flex gap-2 min-[680px]:col-span-2">
            {step > 0 && !submitting && (
              <button
                type="button"
                onClick={goBack}
                className="shrink-0 cursor-pointer rounded-full border border-line-strong px-5 text-[0.9rem] text-dim transition-colors hover:border-brand hover:text-brand"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={ctaClass({ block: true, className: "flex-1" })}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04160F] border-t-transparent" />
                  Taking you to payment…
                </>
              ) : isLastStep ? (
                <>Continue to Payment →</>
              ) : (
                <>Continue →</>
              )}
            </button>
          </div>

          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4 text-[0.8rem] text-faint min-[680px]:col-span-2 min-[680px]:flex-row min-[680px]:flex-wrap min-[680px]:items-center min-[680px]:gap-x-5">
            <span className="inline-flex items-center gap-2">
              <LockIcon className="h-[14px] w-[14px] shrink-0 text-brand" />
              Secure checkout by Razorpay · UPI, cards, net banking
            </span>
            <span className="inline-flex items-start gap-2">
              <ShieldIcon className="mt-0.5 h-[14px] w-[14px] shrink-0 text-brand" />
              3 concrete revenue opportunities, or your {SESSION_PRICE_LABEL} back.
            </span>
            <span className="min-[680px]:w-full">
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
  hint,
  wide = false,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  hint?: string;
  /** Span both columns on the two-column layout. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "min-[680px]:col-span-2" : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.82rem] font-medium text-dim">
        {label}
        {optional && <span className="ml-1 text-faint">(optional)</span>}
        {hint && <span className="ml-1 text-faint">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Choice({
  label,
  id,
  options,
  value,
  onChange,
  disabled,
  wide = false,
}: {
  label: string;
  id: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  wide?: boolean;
}) {
  return (
    <Field label={label} htmlFor={id} wide={wide}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${inputClass} [color-scheme:dark] ${value ? "" : "text-faint"}`}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-ink">
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}
