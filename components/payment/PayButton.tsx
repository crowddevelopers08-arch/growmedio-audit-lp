"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ctaClass } from "@/components/ui/CtaButton";
import { SESSION_PRICE_LABEL, SITE } from "@/lib/site";

/*
 * 1. POST /api/razorpay/create-order — order built from the saved lead
 * 2. Razorpay Checkout opens in its own overlay
 * 3. POST /api/razorpay/verify — signature check, payment saved to the database
 * 4. → /thank-you?order=<orderId>
 */

// ── Razorpay Checkout typings ────────────────────────────────────────────────
interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(
    event: "payment.failed",
    cb: (resp: { error?: { description?: string } }) => void
  ): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
let checkoutScript: Promise<boolean> | null = null;

/** Loads checkout.js once per page. */
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(true);
  if (!checkoutScript) {
    checkoutScript = new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = CHECKOUT_SRC;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        checkoutScript = null; // allow a retry
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  return checkoutScript;
}

const thankYouUrl = (orderId: string) => `/thank-you?order=${encodeURIComponent(orderId)}`;

export default function PayButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const lastFailure = useRef("");

  // Warm up checkout.js while they review their details.
  useEffect(() => {
    loadCheckout();
  }, []);

  const fail = (message: string) => {
    setBusy("");
    setError(message);
  };

  async function verifyPayment(resp: RazorpaySuccess) {
    setBusy("Confirming your payment…");
    try {
      const res = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resp),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.verified) {
        throw new Error(data.error || "We could not verify this payment.");
      }
      router.replace(thankYouUrl(data.orderId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "We could not verify this payment.";
      fail(
        `${message} If money was deducted, you're covered — note your payment ID (${resp.razorpay_payment_id}) and our team will reconcile it when they call you.`
      );
    }
  }

  async function pay() {
    setError("");
    setBusy("Opening secure checkout…");

    if (!(await loadCheckout()) || !window.Razorpay) {
      return fail("Couldn't load the payment window. Check your connection and try again.");
    }

    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    }).catch(() => null);
    const order = await res?.json().catch(() => null);

    if (order?.alreadyPaid && order.orderId) {
      router.replace(thankYouUrl(order.orderId));
      return;
    }
    if (!res?.ok || !order?.orderId) {
      return fail(order?.error || "Could not start the payment. Please try again.");
    }

    lastFailure.current = "";
    setBusy("Complete your payment in the secure Razorpay window…");

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: SITE.name,
      description: `${SESSION_PRICE_LABEL} Revenue Strategy Session`,
      prefill: order.prefill,
      theme: { color: "#16d492" },
      handler: (resp: RazorpaySuccess) => verifyPayment(resp),
      modal: {
        confirm_close: true,
        ondismiss: () =>
          fail(
            lastFailure.current
              ? `${lastFailure.current} You can try again.`
              : "Payment was cancelled. Tap Pay whenever you're ready."
          ),
      },
    });

    // Razorpay keeps its window open for a retry; remember why it failed in
    // case they close it instead.
    checkout.on("payment.failed", (resp) => {
      lastFailure.current = resp.error?.description || "Payment failed.";
    });

    checkout.open();
  }

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={Boolean(busy)}
        className={ctaClass({ block: true })}
      >
        {busy ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04160F] border-t-transparent" />
            Please wait…
          </>
        ) : (
          <>Pay {SESSION_PRICE_LABEL} Securely</>
        )}
      </button>

      <p aria-live="polite" className="mt-3 min-h-[1.2em] text-center text-[0.82rem] text-dim">
        {busy}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-1 rounded-[12px] border border-[rgba(255,107,107,0.3)] bg-danger-wash px-4 py-3 text-[0.87rem] text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
