"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/ui/Icons";
import { Container } from "./ui/Container";
import { borderDelay, cardBorder, cardLift } from "./ui/fx";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHead } from "./ui/SectionHead";

const CLOUDINARY = "https://res.cloudinary.com/ufyboun0/video/upload";

type Video = { id: string; title: string; poster: string; src?: string; wide?: boolean };

/* Clips with `src` are hosted files played in a <video>; the rest are YouTube Shorts, the same two as the
   main page's CampaignsSection. Titles only label the videos for screen readers. */
const VIDEOS: Video[] = [
  {
    id: "rohit-sane",
    title: "Dr. Rohit Sane, founder of Madhavbaug",
    poster: "/ayurveda/video-rohit-sane.jpg",
    src: `${CLOUDINARY}/v1793685856/Dr._Rohit_Sane_Testimonial.mp4`,
    wide: true,
  },
  { id: "8KvwD99H73Q", title: "AVN client video", poster: "/ayurveda/video-avn.jpg" },
  { id: "4gyg-J7JGDs", title: "Client video", poster: "/ayurveda/video-concept.jpg" },
];

/** Client videos. Each card shows a poster and only loads its video once played, one video at a time. */
export function VideoSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <Section id="videos">
      <Container>
        <SectionHead center kicker="Client stories" title="Hear it from our clients." desc="Tap any video to watch." />
        {/* on desktop the columns keep all three cards the same height: 16:9 is 3.16 times as wide as 9:16 */}
        <div className="mt-10 grid grid-cols-[minmax(0,3.16fr)_minmax(0,1fr)_minmax(0,1fr)] gap-[18px] max-[980px]:grid-cols-2 max-[560px]:mt-8 max-[560px]:grid-cols-1">
          {VIDEOS.map((video, i) => (
            <Reveal
              key={video.id}
              variant="scale"
              delay={i * 0.1}
              className={video.wide ? "max-[980px]:col-span-2 max-[560px]:col-span-1" : "max-[560px]:mx-auto max-[560px]:w-full max-[560px]:max-w-[300px]"}
            >
              <div
                style={borderDelay(i)}
                className={`relative overflow-hidden rounded-[20px] border border-ay-line bg-ay-panel ${video.wide ? "aspect-video" : "aspect-[9/16]"} ${cardLift} ${cardBorder}`}
              >
                {playingId !== video.id ? (
                  <button
                    type="button"
                    onClick={() => setPlayingId(video.id)}
                    aria-label={`Play ${video.title}`}
                    className="group absolute inset-0 flex cursor-pointer items-end justify-center border-0 bg-cover bg-center pb-5"
                    style={{ backgroundImage: `url(${video.poster})` }}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ay-brand text-ay-ink transition-transform duration-300 group-hover:[transform:scale(1.1)]">
                      <PlayIcon className="ml-0.5 h-6 w-6" />
                    </span>
                  </button>
                ) : video.src ? (
                  <video src={video.src} poster={video.poster} title={video.title} controls autoPlay playsInline className="absolute inset-0 h-full w-full bg-black" />
                ) : (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`}
                    title={video.title}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
