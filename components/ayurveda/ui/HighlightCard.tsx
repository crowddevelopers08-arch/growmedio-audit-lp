import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";
import { borderDelay, cardBorder, cardLift, cardShine } from "./fx";

/** Full-width, green-accented statement card: kicker, heading and supporting line. */
export function HighlightCard({
  kicker,
  title,
  text,
  delay = 0,
}: {
  kicker: string;
  title: React.ReactNode;
  text: string;
  delay?: number;
}) {
  return (
    <Reveal variant="blur" className="mx-auto grid w-full max-w-[920px]">
      <div
        style={borderDelay(delay)}
        className={`group relative flex flex-col justify-center overflow-hidden rounded-[24px] border border-ay-brand/40 bg-ay-panel px-12 py-12 text-center backdrop-blur-[6px] ${cardLift} ${cardBorder} ${cardShine} max-[980px]:px-8 max-[980px]:py-10 max-[560px]:px-5 max-[560px]:py-8`}
      >
        <div className="relative">
          <span className="inline-flex rounded-full border border-ay-brand/40 bg-ay-brand/[.08] px-4 py-[7px]">
            <Kicker>{kicker}</Kicker>
          </span>
          <h2 className="mx-auto mt-5 max-w-[760px] text-balance text-[clamp(28px,3.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.025em]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-[18px] text-ay-muted max-[560px]:text-[16px]">{text}</p>
        </div>
      </div>
    </Reveal>
  );
}
