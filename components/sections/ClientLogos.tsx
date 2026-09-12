/**
 * Client logo marquee under the hero CTA.
 *
 * The source logos are all dark artwork drawn for white backgrounds, so each
 * one sits on its own light tile rather than being dropped straight onto the
 * near-black hero — inverting them would destroy the brand colours (Adgro's
 * red, Shreevarma's gold, AVN's green).
 */
const LOGOS = [
  { src: "/Logo-adgrohair.png", name: "Advanced Adgro Hair" },
  { src: "/Logo-adgroskin.png", name: "Advanced Adgro Skin" },
  { src: "/logo-equitas.webp", name: "Equitas" },
  { src: "/logo-shreevarma.jpeg", name: "Dr. Shreevarma's Wellness" },
  { src: "/logo-southern-spine.png", name: "Southern Spine" },
  { src: "/Logo-ayush.png", name: "Ayush Ortho" },
  { src: "/Logo-anolon.png", name: "Anlon Skin & Aesthetics" },
  { src: "/Logo-avn.png", name: "AVN Arogya" },
];

/** Seconds each logo spends crossing the track, so speed is count-independent. */
const SECONDS_PER_LOGO = 3.5;

export default function ClientLogos() {
  return (
    <div className="mt-7 md:mt-9">
      <p className="text-[0.78rem] text-faint md:text-[0.82rem]">
        Trusted by clinics and hospitals across India
      </p>

      {/* The track is decorative duplication; the names are already listed for
          assistive tech in the visually hidden list below. */}
      <div
        aria-hidden="true"
        className="mt-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:mt-4"
      >
        <div
          className="flex w-max animate-ticker items-center gap-3 motion-reduce:animate-none md:gap-4"
          style={{ animationDuration: `${LOGOS.length * SECONDS_PER_LOGO}s` }}
        >
          {/* Rendered twice so the -50% translate loops seamlessly. */}
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex h-20 w-[180px] shrink-0 items-center justify-center rounded-xl bg-white/95 px-4 md:h-24 md:w-[210px] md:px-5"
            >
              <img
                src={logo.src}
                alt=""
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {LOGOS.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
    </div>
  );
}
