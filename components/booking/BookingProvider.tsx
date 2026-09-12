"use client";

import Link from "next/link";
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
import CalendlyModal from "@/components/booking/CalendlyModal";
import PhoneField from "@/components/booking/PhoneField";
import { ctaClass } from "@/components/ui/CtaButton";
import { LockIcon, ShieldIcon } from "@/components/ui/Icons";
import {
  DEFAULT_COUNTRY,
  detectCountry,
  isValidPhone,
  type Country,
} from "@/lib/countries";
import {
  rememberPurchase,
  trackInitiateCheckout,
  trackLead,
} from "@/lib/pixel";
import {
  loadRazorpayCheckout,
  type RazorpayFailureResponse,
  type RazorpaySuccessResponse,
} from "@/lib/razorpay";
import { SESSION_PRICE_LABEL, SITE } from "@/lib/site";

/*
 * Booking flow
 * ------------
 * 1. This modal          → name + WhatsApp number
 * 2. POST /api/lead      → pushed to TeleCRM (the only system of record)
 * 3. Razorpay Checkout   → ₹199, opened in place
 * 4. POST /api/razorpay/verify → signature checked server-side
 * 5. Calendly modal      → the client picks their own slot
 *
 * The lead is sent BEFORE payment on purpose: someone who abandons checkout is
 * still in TeleCRM to call back.
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

const inputClass =
  "w-full rounded-[12px] border border-line-strong bg-bg px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-faint focus:border-brand";

// ── Modal ────────────────────────────────────────────────────────────────────
type Stage = "idle" | "starting" | "verifying";

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ name?: string; email?: string }>({});
  // Once paid, the button reopens the calendar rather than charging again.
  const [paid, setPaid] = useState(false);
  // Don't create a second TeleCRM record if they retry a failed payment.
  const leadSent = useRef(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => setCountry(detectCountry()), []);

  const busy = stage !== "idle";

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
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  /** Saves the lead before payment, so an abandoned checkout still reaches the CRM. */
  const captureLead = useCallback(
    async (cleanName: string, digits: string, selected: Country) => {
      if (leadSent.current) return;
      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            phone: digits,
            dialCode: selected.dial,
            country: selected.name,
            iso: selected.iso,
            pageUrl: window.location.href,
          }),
        });
        leadSent.current = true;
        trackLead();
      } catch {
        // Never block the payment on lead logging.
      }
    },
    []
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (paid) {
      setCalendarOpen(true);
      return;
    }

    setError("");

    const cleanName = name.trim();
    const digits = phone.replace(/\D/g, "");

    if (cleanName.length < 2) return setError("Please enter your name.");
    if (!/^[a-zA-Z\s'.-]+$/.test(cleanName))
      return setError("Name should contain letters only.");
    if (!isValidPhone(digits, country.iso))
      return setError(
        country.iso === "IN"
          ? "Please enter a valid 10-digit WhatsApp number."
          : "Please enter a valid WhatsApp number."
      );

    setStage("starting");

    try {
      await captureLead(cleanName, digits, country);
      await loadRazorpayCheckout();

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageUrl: window.location.href,
          name: cleanName,
          phone: digits,
          dialCode: country.dial,
          country: country.name,
          iso: country.iso,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order?.error || "Could not start the payment.");
      if (!window.Razorpay) throw new Error("Could not load the payment window.");

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: SITE.name,
        description: "Revenue Strategy Session",
        prefill: {
          name: cleanName,
          contact: `${country.dial || "91"}${digits}`,
        },
        theme: { color: "#16D492" },
        handler: async (response: RazorpaySuccessResponse) => {
          setStage("verifying");
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();

            if (!verifyRes.ok || !result.verified) {
              throw new Error(result?.error || "We could not verify your payment.");
            }

            setPrefill({
              name: result.prefill?.name || cleanName,
              email: result.prefill?.email,
            });
            // Handed to /thank-you, which fires Purchase with an event_id the
            // Razorpay webhook repeats server-side so Meta can deduplicate.
            rememberPurchase({
              paymentId: result.paymentId || response.razorpay_payment_id,
              value: Number(order.amount) / 100,
            });
            setPaid(true);
            setStage("idle");
            setCalendarOpen(true);
          } catch (err) {
            setStage("idle");
            setError(
              err instanceof Error
                ? `${err.message} If you were charged, please contact us and we'll confirm your slot.`
                : "Something went wrong. Please contact us and we will confirm your slot."
            );
          }
        },
        modal: { ondismiss: () => setStage("idle") },
      });

      checkout.on("payment.failed", (response: RazorpayFailureResponse) => {
        setStage("idle");
        setError(response?.error?.description || "Payment failed. Please try again.");
      });

      checkout.open();
      trackInitiateCheckout(Number(order.amount) / 100);
      // Checkout is on screen — release the button's loading state.
      setStage("idle");
    } catch (err) {
      setStage("idle");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-end justify-center bg-[rgba(3,4,6,0.78)] p-4 backdrop-blur-[6px] min-[560px]:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busy) onClose();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative max-h-[calc(100dvh-32px)] w-full max-w-[440px] overflow-y-auto rounded-[22px] border border-line-strong bg-surface p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] min-[560px]:p-7"
          >
            {!busy && (
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
                {paid ? "Payment received" : "Book your session"}
              </span>
              <h2
                id="booking-title"
                className="mt-1.5 font-display text-[1.4rem] font-semibold leading-[1.15] tracking-[-0.01em]"
              >
                {paid
                  ? "Now pick your slot"
                  : `Book your ${SESSION_PRICE_LABEL} Strategy Session`}
              </h2>
              <p className="mt-2 text-[0.9rem] text-dim">
                {paid
                  ? "Choose a time that suits you and we'll send the confirmation."
                  : `Enter your details to continue to a secure ${SESSION_PRICE_LABEL} checkout.`}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-3">
              <div>
                <label
                  htmlFor="bk-name"
                  className="mb-1.5 block text-[0.82rem] font-medium text-dim"
                >
                  Your name
                </label>
                <input
                  ref={firstField}
                  id="bk-name"
                  autoComplete="name"
                  placeholder="Dr. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy || paid}
                  className={inputClass}
                />
              </div>

              <PhoneField
                country={country}
                onCountry={setCountry}
                value={phone}
                onValue={setPhone}
                disabled={busy || paid}
              />

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
                disabled={busy}
                className={ctaClass({ block: true, className: "mt-2" })}
              >
                {stage === "starting" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04160F] border-t-transparent" />
                    Opening secure payment…
                  </>
                ) : paid ? (
                  <>Choose Your Slot →</>
                ) : (
                  <>Continue to Payment · {SESSION_PRICE_LABEL}</>
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
      )}

      {/* Blocks interaction so nobody navigates away or pays twice while we
          confirm the payment with Razorpay. */}
      {stage === "verifying" && (
        <div className="fixed inset-0 z-[320] flex flex-col items-center justify-center gap-4 bg-[rgba(3,4,6,0.92)] px-6 text-center backdrop-blur-[6px]">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line-strong border-t-brand" />
          <p className="text-[0.98rem] font-semibold text-ink">Confirming your payment…</p>
          <p className="text-[0.88rem] text-dim">Please don&rsquo;t close this window.</p>
        </div>
      )}

      <CalendlyModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        prefill={prefill}
      />
    </>
  );
}
