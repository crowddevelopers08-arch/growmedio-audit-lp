/*
 * The kicker's look depends on where it sits (in the original page the section paragraph
 * styles override it):
 *  - hero:  small gold label
 *  - head:  inside a section heading block, 18px muted
 *  - final: inside the final call to action, 18px light
 */
const tones = {
  hero: "text-[12.5px] text-ay-gold",
  head: "text-[18px] text-ay-muted max-[560px]:text-[14px] max-[560px]:tracking-[.16em] [text-shadow:0_2px_24px_rgba(5,10,7,.95)]",
  final: "mt-[22px] text-[18px] text-[#E4ECE6] [text-shadow:0_2px_18px_rgba(5,10,7,.95),0_0_6px_rgba(5,10,7,.8)]",
};

export function Kicker({ tone = "hero", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <p
      className={`inline-flex items-center font-semibold uppercase tracking-[.2em] ${tones[tone]}`}
    >
      {children}
    </p>
  );
}
