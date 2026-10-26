"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanding } from "./LandingProvider";
import { Button } from "./ui/Button";
import { LeafIcon } from "./ui/Icons";
import { rememberAyurvedaLead } from "@/lib/ayurveda/handover";
import { trackLead } from "@/lib/pixel";

type FieldId = "name" | "phone" | "email" | "clinic" | "occupation";

const RULES: Record<FieldId, (v: string) => boolean> = {
  name: (v) => v.trim().length >= 2,
  phone: (v) => {
    let d = v.replace(/\D/g, "");
    if (d.length === 12 && d.indexOf("91") === 0) d = d.slice(2);
    if (d.length === 11 && d[0] === "0") d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d);
  },
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  clinic: (v) => v.trim().length >= 2,
  occupation: (v) => v.trim().length >= 2,
};
const ORDER: FieldId[] = ["name", "phone", "email", "clinic", "occupation"];

const FIELDS: Record<FieldId, { label: string; type: string; autoComplete?: string; placeholder: string; err: string; inputMode?: "tel" }> = {
  name: { label: "Name", type: "text", autoComplete: "name", placeholder: "Dr. Your name", err: "Please enter your name." },
  phone: { label: "Phone number", type: "tel", autoComplete: "tel-national", placeholder: "98765 43210", err: "Enter a valid 10-digit phone number.", inputMode: "tel" },
  email: { label: "Email ID", type: "email", autoComplete: "email", placeholder: "you@clinic.com", err: "Enter a valid email address." },
  clinic: { label: "Clinic / Hospital name", type: "text", autoComplete: "organization", placeholder: "Your clinic or hospital", err: "Please enter your clinic or hospital name." },
  occupation: { label: "Occupation", type: "text", placeholder: "e.g. Clinic owner, Vaidya", err: "Please enter your occupation." },
};

const inputCls = (bad: boolean, radius: string) =>
  `w-full border border-solid bg-ay-bg px-4 py-[11px] text-[16px] font-medium leading-[1.2] text-ay-fg transition-[border-color,box-shadow] duration-200 placeholder:text-[#7F8E84] focus:shadow-[0_0_0_3px_rgba(242,181,61,.18)] focus:outline-none ${radius} ${
    bad ? "border-[#E0705A] focus:border-[#E0705A]" : "border-ay-line-2 focus:border-ay-gold"
  }`;

type Lead = Record<FieldId, string>;

export function LeadModal() {
  const { modalOpen, closeModal } = useLanding();
  const modalRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const [values, setValues] = useState<Lead>({ name: "", phone: "", email: "", clinic: "", occupation: "" });
  const [bad, setBad] = useState<Partial<Record<FieldId, boolean>>>({});
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // open / close side effects: lock scroll, move focus, restore focus
  useEffect(() => {
    if (!modalOpen) return;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => nameRef.current?.focus(), 380);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [modalOpen]);

  // Escape closes; Tab is trapped inside the dialog
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        const f = Array.from(modalRef.current!.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea")).filter(
          (x) => x.offsetParent !== null
        );
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  const check = (id: FieldId, v = values[id]) => {
    const ok = RULES[id](v);
    setBad((b) => ({ ...b, [id]: !ok }));
    return ok;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    let firstBad: FieldId | null = null;
    ORDER.forEach((id) => {
      if (!check(id) && !firstBad) firstBad = id;
    });
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }
    const d: Lead = {
      name: values.name.trim(),
      phone: "+91 " + values.phone.replace(/\D/g, "").slice(-10),
      email: values.email.trim(),
      clinic: values.clinic.trim(),
      occupation: values.occupation.trim(),
    };
    setSubmitting(true);
    setSubmitError("");
    // shared by the browser pixel and the server's Conversions API event, so Meta counts one lead
    const eventId = `ay_lead_${typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)}`;
    try {
      // saved to the database, then TeleCRM, the "Ayurveda Leads" sheet tab and Meta (app/api/ayurveda-lead)
      const res = await fetch("/api/ayurveda-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, pageUrl: window.location.href, eventId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      trackLead(eventId);
      rememberAyurvedaLead({ firstName: d.name.replace(/^dr\.?\s+/i, "").split(/\s+/)[0], eventId });
      // the button stays in its "Reserving…" state until the thank-you page loads
      router.push("/ayurveda/thank-you");
    } catch (err) {
      setSubmitError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={modalRef}
      aria-hidden={!modalOpen}
      onClick={(e) => {
        if (e.target === modalRef.current) closeModal();
      }}
      className={`fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[rgba(2,6,4,.78)] p-[max(16px,env(safe-area-inset-top,0px))_max(16px,env(safe-area-inset-right,0px))_max(16px,env(safe-area-inset-bottom,0px))_max(16px,env(safe-area-inset-left,0px))] backdrop-blur-[8px] [transition:opacity_.35s_ease,visibility_.35s] ${
        modalOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="m-title"
        className={`relative my-auto grid w-full max-w-[900px] grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] overflow-hidden rounded-3xl border border-ay-gold/40 bg-ay-panel shadow-[0_40px_120px_-30px_rgba(0,0,0,.9),0_0_80px_-30px_rgba(242,181,61,.4)] [transition:transform_.45s_cubic-bezier(.2,.8,.2,1)] max-[760px]:grid-cols-[minmax(0,1fr)] ${
          modalOpen ? "[transform:none]" : "[transform:translateY(24px)_scale(.97)]"
        }`}
      >
        <button
          type="button"
          aria-label="Close form"
          onClick={closeModal}
          className="absolute right-[14px] top-[14px] z-[2] grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ay-line-2 bg-ay-panel-2 text-[20px] leading-none text-ay-fg hover:border-ay-gold"
        >
          &times;
        </button>

        <aside className="relative flex flex-col gap-[18px] overflow-hidden border-r border-ay-line px-[34px] py-8 [background:radial-gradient(circle_at_30%_20%,rgba(242,181,61,.18),transparent_60%),#08130D] max-[760px]:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ayurveda/logo.png" alt="Grow Medico" className="block h-[54px] w-auto self-start" />
          <h2 className="text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.025em]">
            One hour. One-on-one strategy. Your clinic.
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0 text-[15px] text-[#C3D0C6]">
            {[
              "We review your real numbers: Ad account, leads, bookings.",
              "We find the leaks: Where the money goes and why.",
              "We build your plan live: Clear steps to fix and scale your revenue.",
            ].map((t) => (
              <li key={t} className="relative pl-[26px]">
                <LeafIcon className="absolute left-0 top-[.45em] h-[14px] w-[14px] fill-ay-leaf" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto border-t border-ay-line pt-[18px] text-[13.5px] text-ay-muted">
            <b className="block text-[30px] tracking-[-.03em] text-ay-gold">30 &rarr; 600+</b>
            consultations per month within 8 months at Ayush Ortho
          </div>
        </aside>

        <div className="px-[38px] pb-7 pt-8 max-[760px]:px-[22px] max-[760px]:pb-[22px] max-[760px]:pt-12">
            <div>
              <h3 id="m-title" className="text-balance text-[24px] font-semibold tracking-[-0.025em]">
                Reserve My Free Session
              </h3>
              <p className="mt-1.5 text-[15px] text-ay-muted">Fill out the short form. Join your one-on-one session.</p>
              <form noValidate onSubmit={onSubmit}>
                <div className="mt-5 grid gap-3">
                  {ORDER.map((id) => {
                    const f = FIELDS[id], isBad = !!bad[id];
                    const input = (
                      <input
                        ref={id === "name" ? nameRef : undefined}
                        id={`f-${id}`}
                        name={id}
                        type={f.type}
                        autoComplete={f.autoComplete}
                        inputMode={f.inputMode}
                        placeholder={f.placeholder}
                        value={values[id]}
                        onChange={(e) => {
                          const v = e.target.value;
                          setValues((s) => ({ ...s, [id]: v }));
                          if (isBad) check(id, v);
                        }}
                        onBlur={(e) => {
                          if (e.target.value) check(id, e.target.value);
                        }}
                        className={inputCls(isBad, id === "phone" ? "rounded-r-xl rounded-l-none" : "rounded-xl")}
                      />
                    );
                    return (
                      <div key={id}>
                        <label htmlFor={`f-${id}`} className="mb-[5px] block text-[12.5px] font-semibold uppercase tracking-[.1em] text-ay-muted">
                          {f.label}
                        </label>
                        {id === "phone" ? (
                          <div className="grid grid-cols-[auto_minmax(0,1fr)]">
                            <span className="grid place-items-center rounded-l-xl border border-r-0 border-ay-line-2 bg-ay-panel-2 px-[14px] font-semibold text-ay-muted">
                              +91
                            </span>
                            {input}
                          </div>
                        ) : (
                          input
                        )}
                        {isBad && <div className="mt-1.5 text-[13px] text-[#F08C77]">{f.err}</div>}
                      </div>
                    );
                  })}
                </div>
                {submitError && (
                  <div role="alert" className="mt-4 text-center text-[13.5px] text-[#F08C77]">
                    {submitError}
                  </div>
                )}
                <Button
                  type="submit"
                  size="block"
                  arrow={!submitting}
                  disabled={submitting}
                  className={`mt-[18px] py-4! ${submitting ? "cursor-wait opacity-70" : ""}`}
                >
                  {submitting ? "Reserving…" : "Reserve My Free Session"}
                </Button>
                <p className="mt-3 text-center text-[12.5px] text-ay-muted">Yes. No fee, no hidden charges.</p>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}
