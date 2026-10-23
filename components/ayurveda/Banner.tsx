"use client";

import { useState } from "react";
import { useLanding } from "./LandingProvider";

export function Banner() {
  const { openModal } = useLanding();
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="relative z-[31] flex items-center justify-center gap-[14px] border-b border-ay-line bg-[linear-gradient(90deg,rgba(94,224,138,.10),rgba(242,181,61,.14),rgba(94,224,138,.10))] py-[9px] pl-4 pr-[44px] text-center text-[14px] max-[560px]:py-2 max-[560px]:pl-3 max-[560px]:pr-9 max-[560px]:text-[12.5px] max-[560px]:leading-[1.4]">
      <span>A free one-on-one strategy session to build your Ayurveda clinic.</span>
      <button
        type="button"
        onClick={openModal}
        className="cursor-pointer rounded-lg border-0 bg-ay-gold max-[560px]:hidden px-[14px] py-[7px] text-[13px] font-semibold leading-[normal] text-ay-ink"
      >
        Reserve My Free Session
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setHidden(true)}
        className="absolute right-[max(10px,env(safe-area-inset-right,0px))] top-1/2 h-7 w-7 -translate-y-1/2 cursor-pointer border-0 bg-transparent text-[18px] leading-none text-ay-muted"
      >
        &times;
      </button>
    </div>
  );
}
