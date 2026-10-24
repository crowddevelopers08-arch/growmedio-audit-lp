"use client";

import { useRef, useState } from "react";
import { useLanding } from "./LandingProvider";
import { ArrowIcon, WhatsAppIcon } from "./ui/Icons";
import { WA_INTRO_TEXT, waLink } from "@/lib/ayurveda/config";

/** Floating Vaidya figure that opens WhatsApp; hovering shows a speech bubble with a typing intro. */
export function SageWidget() {
  const { modalOpen } = useLanding();
  const [show, setShow] = useState(false);
  const [typing, setTyping] = useState(true);
  const hideT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const typeT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showing = useRef(false);
  const href = waLink(WA_INTRO_TEXT);

  const showBubble = () => {
    clearTimeout(hideT.current);
    if (!showing.current) {
      showing.current = true;
      setTyping(true);
      setShow(true);
      clearTimeout(typeT.current);
      typeT.current = setTimeout(() => setTyping(false), 650);
    }
  };
  const hideBubble = () => {
    clearTimeout(hideT.current);
    hideT.current = setTimeout(() => {
      showing.current = false;
      setShow(false);
    }, 280);
  };
  const hover = { onMouseEnter: showBubble, onMouseLeave: hideBubble, onFocus: showBubble, onBlur: hideBubble };

  return (
    <div
      className={`pointer-events-none fixed bottom-[max(14px,env(safe-area-inset-bottom,0px))] right-[max(14px,env(safe-area-inset-right,0px))] z-40 flex max-w-[calc(100vw-28px)] items-end gap-1.5 transition-opacity duration-300 ${
        modalOpen ? "invisible opacity-0" : ""
      }`}
    >
      <a
        href={href}
        {...hover}
        className={`relative mb-12 max-w-[220px] origin-bottom-right rounded-[18px_18px_4px_18px] border border-ay-gold/55 bg-ay-panel-2 px-[14px] py-3 no-underline shadow-[0_18px_44px_-14px_rgba(0,0,0,.8)] [transition:opacity_.25s_ease,transform_.35s_cubic-bezier(.2,.9,.3,1.25),visibility_.25s] max-[560px]:mb-9 max-[560px]:max-w-[176px] max-[560px]:px-3 max-[560px]:py-[10px] ${
          show ? "pointer-events-auto visible opacity-100 [transform:none]" : "pointer-events-none invisible opacity-0 [transform:scale(.82)_translateY(10px)]"
        }`}
      >
        {typing ? (
          <span aria-hidden="true" className="flex gap-[5px] px-0.5 py-1.5">
            {[0, 0.15, 0.3].map((d) => (
              <i key={d} style={{ animationDelay: `${d}s` }} className="h-[7px] w-[7px] animate-dot rounded-full bg-ay-gold" />
            ))}
          </span>
        ) : (
          <>
            <span className="block text-[15px] font-semibold leading-[1.35] tracking-[-.01em] max-[560px]:text-[13.5px]">
              Spending &#8377;5 Lakhs a month on ads? Your revenue should match it.
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ay-gold">
              Reserve My Free Session <ArrowIcon width={12} height={12} />
            </span>
          </>
        )}
      </a>

      <a
        href={href}
        {...hover}
        aria-label="Chat with us on WhatsApp"
        className="pointer-events-auto relative block h-[94px] w-20 flex-none animate-bob no-underline [filter:drop-shadow(0_14px_18px_rgba(237,244,204,.6))] max-[560px]:h-[73px] max-[560px]:w-[62px]"
      >
        <svg viewBox="0 0 120 140" aria-hidden="true" className="block h-full w-full overflow-visible">
          <circle className="origin-center animate-aura [transform-box:fill-box]" cx="60" cy="68" r="56" fill="rgba(0,96,47,.16)" />
          <circle className="origin-center animate-aura [transform-box:fill-box]" cx="60" cy="68" r="42" fill="none" stroke="#00602f" strokeOpacity=".5" strokeWidth="1.2" />
          <ellipse cx="60" cy="124" rx="50" ry="13" fill="#D2741A" />
          <path d="M32 122 C30 92 42 74 60 74 C78 74 90 92 88 122 Z" fill="#F0A13A" />
          <path d="M44 78 C52 92 66 104 88 108 L86 96 C72 94 62 86 58 74 Z" fill="#C96F1A" />
          <ellipse cx="60" cy="108" rx="9" ry="6.5" fill="#E7B48A" />
          <path d="M55 105 L60 98 L65 105" fill="none" stroke="#C98F66" strokeWidth="1.2" />
          <path d="M45 54 C44 84 76 84 75 54 C71 66 49 66 45 54 Z" fill="#F6F1E6" stroke="#CFC6B2" strokeWidth=".8" />
          <circle cx="60" cy="50" r="16" fill="#E7B48A" />
          <path d="M44 50 C42 28 78 28 76 50 C72 40 48 40 44 50 Z" fill="#F6F1E6" stroke="#CFC6B2" strokeWidth=".8" />
          <circle cx="60" cy="27" r="7" fill="#F6F1E6" stroke="#CFC6B2" strokeWidth=".8" />
          <path d="M52 52 q3 2.5 6 0 M62 52 q3 2.5 6 0" fill="none" stroke="#6B4A30" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="60" cy="45" r="1.7" fill="#C8342B" />
          <path d="M55 60 q5 3.5 10 0" fill="none" stroke="#B07A58" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span
          aria-hidden="true"
          className="absolute -right-1 top-0.5 grid h-7 w-7 animate-wiggle place-items-center rounded-full bg-[#25D366] shadow-[0_6px_16px_-4px_rgba(237,244,204,.6)] max-[560px]:h-6 max-[560px]:w-6"
        >
          <WhatsAppIcon className="h-4 w-4 fill-white" />
        </span>
      </a>
    </div>
  );
}
