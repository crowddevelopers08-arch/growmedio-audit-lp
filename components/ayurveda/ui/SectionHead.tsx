import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";

const shadow = "[text-shadow:0_2px_24px_rgba(237,244,204,.95)]";

/** Optional kicker + heading + optional description that opens every content section. */
export function SectionHead({
  kicker,
  title,
  desc,
  center,
}: {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  desc?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal variant="blur" className={`max-w-[1000px] ${center ? "mx-auto text-center" : ""}`}>
      {kicker && <Kicker tone="head">{kicker}</Kicker>}
      <h2
        className={`text-balance text-[clamp(27px,3.9vw,52px)] font-semibold leading-[1.1] tracking-[-0.025em] ${kicker ? "mt-3" : ""} ${shadow}`}
      >
        {title}
      </h2>
      {desc && <p className={`mt-4 text-[18px] text-ay-muted max-[560px]:text-[16px] ${shadow}`}>{desc}</p>}
    </Reveal>
  );
}

/** Two-line heading where the second line is gold. */
export function TwoLine({ first, second }: { first: React.ReactNode; second: React.ReactNode }) {
  return (
    <>
      <span className="block">{first}</span>
      <span className="mt-[.12em] block text-ay-gold">{second}</span>
    </>
  );
}
