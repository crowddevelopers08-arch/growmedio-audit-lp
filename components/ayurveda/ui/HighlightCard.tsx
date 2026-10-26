import { Kicker } from "./Kicker";
import { Reveal } from "./Reveal";
import { borderDelay, cardBorder, cardLift, cardShine } from "./fx";

/** Full-width, gold-accented statement card: kicker, heading and supporting line. */
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
        className={`group relative flex flex-col justify-center overflow-hidden rounded-[24px] border border-ay-gold/40 bg-[#09120d] bg-[linear-gradient(135deg,rgba(242,181,61,.10),rgba(9,18,13,.88)_45%,rgba(94,224,138,.06))] px-12 py-12 text-center shadow-[0_24px_60px_-24px_rgba(242,181,61,.45)] backdrop-blur-[6px] ${cardLift} ${cardBorder} ${cardShine} max-[980px]:px-8 max-[980px]:py-10 max-[560px]:px-5 max-[560px]:py-8`}
      >
        {/* soft gold glows in two corners that bloom on hover */}
        <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-ay-gold/[.16] blur-3xl opacity-70 transition-[transform,opacity] duration-700 group-hover:[transform:scale(1.5)] group-hover:opacity-100" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[rgba(94,224,138,.10)] blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-ay-gold/40 bg-ay-gold/[.08] px-4 py-[7px]">
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
