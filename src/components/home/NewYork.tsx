"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Plate from "@/components/ui/Plate";
import { homeCopy } from "@/data/exhibition";
import { getPhotographsBySlugs } from "@/lib/gallery";

const SLUGS = [
  "walking",
  "sidewalk",
  "phone-call",
  "graffiti-heads",
  "times-square-new-years-eve",
  "canopy",
  "foot-on-el",
  "man-in-straw-hat",
];

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 03 · NEW YORK — a corridor of eight frames, walked sideways.
 * Vertical scroll is mapped onto a horizontal track; velocity leans the film.
 */
export default function NewYork() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  const photos = getPhotographsBySlugs(SLUGS);
  const { newYork } = homeCopy;

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || !photos.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add("(min-width: 1024px)", () => {
      let frame = 0;

      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.max(600, track.scrollWidth - window.innerWidth + 320)}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }

            const total = photos.length;
            const next = Math.min(
              total - 1,
              Math.max(0, Math.round(self.progress * (total - 1)))
            );

            if (!frame) {
              frame = window.requestAnimationFrame(() => {
                frame = 0;
                setIndex((current) => (current === next ? current : next));
              });
            }
          },
        },
      });

      return () => {
        tween.kill();
        if (frame) window.cancelAnimationFrame(frame);
      };
    });

    return () => media.revert();
  }, [photos.length]);

  return (
    <section
      ref={rootRef}
      id="new-york"
      className="scene scene-ny tone-dark"
      aria-labelledby="ny-title"
    >
      <div className="ny__pin">
        <div className="ny__glow" aria-hidden="true" />

        <header className="ny__head">
          <span className="eyebrow" lang="en">
            03 / {newYork.eyebrow}
          </span>
          <h2 id="ny-title" className="display">
            NEW YORK
            <em>THROUGH HIS EYES</em>
          </h2>
          <p className="ny__head-cn">纽约 · 在他眼里</p>
        </header>

        <div className="ny__counter" aria-live="off">
          <span lang="en">FRAME</span>
          <b>
            {String(index + 1).padStart(2, "0")}
            <span> / {String(photos.length).padStart(2, "0")}</span>
          </b>
        </div>

        <div className="ny__strip ny__strip--top" aria-hidden="true" />
        <div className="ny__strip ny__strip--bottom" aria-hidden="true" />

        <div ref={trackRef} className="ny__track">
          {photos.map((photo, position) => (
            <div
              className="ny__frame"
              key={photo.slug}
              data-index={String(position + 1).padStart(2, "0")}
            >
              <Plate
                photo={photo}
                lightbox
                hoverLabel="VIEW PLATE"
                sizes="(max-width: 1023px) 76vw, 34vw"
                className="ny__plate"
              />
              <div className="ny__caption">
                <b>{photo.title}</b>
                <span>
                  {photo.year ?? "N.D."} · {photo.plate}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="ny__progress" aria-hidden="true">
          <i ref={progressRef} />
        </div>

        <div className="ny__hint" aria-hidden="true">
          <span lang="en">SCROLL → THE STREET MOVES SIDEWAYS</span>
        </div>
      </div>
    </section>
  );
}
