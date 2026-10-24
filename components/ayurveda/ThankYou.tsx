"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "./ui/Container";
import { ButtonLink } from "./ui/Button";
import { LeafIcon, TickIcon, WhatsAppIcon } from "./ui/Icons";
import { readAyurvedaLead } from "@/lib/ayurveda/handover";
import { WA_INTRO_TEXT, WA_NUMBER, waLink } from "@/lib/ayurveda/config";
import { pushDataLayer } from "@/lib/pixel";

/** The WhatsApp button only shows once a real number is set in lib/ayurveda/config.ts. */
const HAS_WA = /^\d{10,15}$/.test(WA_NUMBER);
const FIRED_KEY = "gm_ayurveda_thankyou_fired";

const NEXT_STEPS = [
  {
    title: "We call you to confirm",
    body: "Our team will reach out on the number you shared to fix a time for your one-on-one session.",
  },
  {
    title: "We study your clinic",
    body: "Before the call we look at your clinic, your ad account and how enquiries turn into bookings today.",
  },
  {
    title: "You get your plan, live",
    body: "In the session we show you where the money leaks and build clear steps to fix and scale your revenue.",
  },
];

/**
 * /ayurveda/thank-you — reached after the lead form is saved. Fires SubmitApplication once per lead
 * (the Lead event itself fired on submit, with the Conversions API twin from the server).
 */
export function ThankYou() {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const lead = readAyurvedaLead();
    if (lead?.firstName) setFirstName(lead.firstName);

    // A refresh of this page must not report the conversion twice.
    const key = lead?.eventId ?? "direct";
    try {
      if (sessionStorage.getItem(FIRED_KEY) === key) return;
      sessionStorage.setItem(FIRED_KEY, key);
    } catch {
      /* private mode — accept the small risk of a double count */
    }
    try {
      window.fbq?.("track", "SubmitApplication", { content_name: "Ayurveda Free Strategy Session" });
    } catch {
      /* tracking must never break the page */
    }
    pushDataLayer("SubmitApplication", { form: "ayurveda", event_id: lead?.eventId });
  }, []);

  return (
    <main className="relative z-[1] flex min-h-dvh flex-col">
      <header className="border-b border-ay-line bg-[rgba(237,244,204,.72)] backdrop-blur-[14px]">
        <Container className="flex items-center py-[13px] max-[560px]:py-2.5">
          <Link href="/ayurveda" aria-label="Grow Medico home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ayurveda/logo.png" alt="Grow Medico" className="block h-[54px] w-auto max-[560px]:h-10" />
          </Link>
        </Container>
      </header>

      <section className="relative flex-1 overflow-hidden py-16 max-[560px]:py-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-200px] h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(0,96,47,.16),rgba(63,154,82,.05)_55%,transparent_75%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-[660px] text-center">
            <div className="mx-auto grid h-[72px] w-[72px] animate-pop place-items-center rounded-full bg-ay-leaf/[.14] text-ay-leaf shadow-[0_0_40px_rgba(63,154,82,.35)]">
              <TickIcon className="h-[34px] w-[34px]" />
            </div>

            <p className="mt-6 text-[12.5px] font-semibold uppercase tracking-[.2em] text-ay-gold">Request received</p>
            <h1 className="mt-3 text-balance text-[clamp(30px,4.4vw,48px)] font-semibold leading-[1.1] tracking-[-0.025em]">
              {firstName ? `Thank you, ${firstName}.` : "Thank you."} Your free session is reserved.
            </h1>
            <p className="mx-auto mt-4 max-w-[540px] text-[18px] text-ay-muted max-[560px]:text-[16px]">
              We have received your details. Our team will contact you shortly to confirm your one-on-one strategy session.
            </p>

            <div className="mt-9 rounded-[22px] border border-ay-line bg-[rgba(246,250,223,.86)] p-7 text-left backdrop-blur-[6px] max-[560px]:p-5">
              <h2 className="text-[18px] font-semibold">What happens next</h2>
              <ol className="m-0 mt-5 grid list-none gap-5 p-0">
                {NEXT_STEPS.map((s, i) => (
                  <li
                    key={s.title}
                    style={{ animationDelay: `${0.2 + i * 0.15}s` }}
                    className="flex animate-rise gap-4"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ay-gold font-bold text-ay-gold shadow-[0_0_18px_rgba(0,96,47,.3)]">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <p className="mt-1 text-[15px] text-ay-muted">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <ul className="m-0 mx-auto mt-7 grid max-w-[480px] list-none gap-2.5 p-0 text-left text-[15px] text-[#3a453d]">
              {["No fee, no hidden charges.", "One hour, one-on-one, built around your clinic's numbers."].map((t) => (
                <li key={t} className="relative pl-[26px]">
                  <LeafIcon className="absolute left-0 top-[.45em] h-[14px] w-[14px] fill-ay-leaf" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {HAS_WA && (
                <ButtonLink href={waLink(WA_INTRO_TEXT)} target="_blank" rel="noopener" size="lg">
                  <WhatsAppIcon className="h-5 w-5 fill-current" />
                  Message us on WhatsApp
                </ButtonLink>
              )}
              <ButtonLink href="/ayurveda" variant={HAS_WA ? "ghost" : "gold"} size="lg">
                Back to the page
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-ay-line py-6 text-center text-[13.5px] text-ay-muted">
        &copy; Grow Medico. All rights reserved.
      </footer>
    </main>
  );
}
