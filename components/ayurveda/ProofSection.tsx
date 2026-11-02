"use client";

import { useState } from "react";
import { Container } from "./ui/Container";
import { buttonClass } from "./ui/Button";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";
import { AvnResults, AyushResults, MadhavbaugResults } from "./proof/ClientResults";

const CLIENTS = [
  { id: "madhavbaug", label: "Madhavbaug", Results: MadhavbaugResults },
  { id: "avn", label: "AVN", Results: AvnResults },
  { id: "ayush", label: "Ayush Ortho", Results: AyushResults },
];

/** One button per client; shows the selected client's results, starting with the first. */
export function ProofSection() {
  const [activeId, setActiveId] = useState(CLIENTS[0].id);
  const active = CLIENTS.find((c) => c.id === activeId) ?? CLIENTS[0];

  return (
    <Section id="proof">
      <Container>
        <SectionHead center kicker="Our proof" title="Real clients. Real numbers." desc="Choose a client to see their results." />
        <div role="group" aria-label="Choose a client" className="mt-8 flex flex-wrap justify-center gap-3 max-[560px]:mt-6">
          {CLIENTS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === activeId}
              onClick={() => setActiveId(c.id)}
              className={buttonClass(c.id === activeId ? "brand" : "ghost", "md")}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div key={active.id} aria-live="polite" className="mt-10 max-[560px]:mt-8">
          <active.Results />
        </div>
      </Container>
    </Section>
  );
}
