/*
 * The kicker's look depends on where it sits (in the original page the section paragraph
 * styles override it):
 *  - hero:  small green label
 *  - head:  inside a section heading block, 18px muted
 *  - final: inside the final call to action, 18px light
 */
const tones = {
  hero: "text-[14px] text-ay-brand",
  head: "text-[18px] text-ay-muted max-[560px]:text-[15px] max-[560px]:tracking-[.16em]",
  final: "mt-[22px] text-[18px] text-ay-fg",
};

export function Kicker({ tone = "hero", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <p
      className={`inline-flex items-center font-bold uppercase tracking-[.2em] ${tones[tone]}`}
    >
      {children}
    </p>
  );
}
