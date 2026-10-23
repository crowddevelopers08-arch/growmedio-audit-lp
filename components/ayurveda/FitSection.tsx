import { Container } from "./ui/Container";
import { borderDelay, cardBorder, cardLift } from "./ui/fx";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";

const YES = [
  "You run an Ayurveda clinic",
  "You spend ₹5L+ a month on ads",
  "You get leads but not enough revenue",
  "You're ready to act on a plan",
];
const NOT_YET = ["You spend less than ₹5L a month", "You want a quick trick"];

/* each list item slides in after its panel lands */
const item =
  "flex items-start gap-3 text-[17px] opacity-0 [transform:translateX(-14px)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-data-[in=true]/rv:opacity-100 group-data-[in=true]/rv:[transform:none] motion-reduce:opacity-100 motion-reduce:[transform:none] max-[560px]:text-[16px]";

/** Is this for you? A "yes" panel and a "not right now" panel. */
export function FitSection() {
  return (
    <Section id="fit">
      <Container>
        <SectionHead center title="Is this for you?" />
        <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] gap-[18px] max-[760px]:grid-cols-[minmax(0,1fr)] max-[760px]:gap-3 max-[560px]:mt-8">
          <Reveal variant="left" className="h-full">
            <div
              style={borderDelay(0)}
              className={`relative h-full rounded-[20px] border border-ay-gold/50 px-8 py-8 backdrop-blur-[6px] [background:linear-gradient(135deg,rgba(242,181,61,.08),rgba(6,12,9,.84)_60%)] ${cardLift} ${cardBorder} max-[760px]:py-6 max-[560px]:px-5 max-[560px]:py-5`}
            >
              <h3 className="text-[23px] font-semibold tracking-[-0.025em] text-ay-gold">Yes, if:</h3>
              <ul className="mt-5 grid list-none gap-3 p-0">
                {YES.map((t, i) => (
                  <li key={t} style={{ transitionDelay: `${0.35 + i * 0.1}s` }} className={item}>
                    <span
                      style={{ animationDelay: `${0.45 + i * 0.1}s` }}
                      className="inline-block font-semibold text-ay-leaf opacity-0 group-data-[in=true]/rv:animate-pop"
                    >
                      &#10003;
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="right" delay={0.1} className="h-full">
            <div
              style={borderDelay(2)}
              className={`relative h-full rounded-[20px] border border-ay-line bg-[rgba(6,12,9,.86)] px-8 py-8 backdrop-blur-[6px] ${cardLift} ${cardBorder} max-[760px]:py-6 max-[560px]:px-5 max-[560px]:py-5`}
            >
              <h3 className="text-[23px] font-semibold tracking-[-0.025em] text-ay-muted">Not right now, if:</h3>
              <ul className="mt-5 grid list-none gap-3 p-0">
                {NOT_YET.map((t, i) => (
                  <li key={t} style={{ transitionDelay: `${0.45 + i * 0.1}s` }} className={`${item} text-[#98A89D]`}>
                    <span className="font-semibold">&#10007;</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
