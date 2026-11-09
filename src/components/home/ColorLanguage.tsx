"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import Plate from "@/components/ui/Plate";
import { colorObservations, homeCopy } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";
import type { Photograph } from "@/types";

const PHOTO_SLUGS = [
  "taxi",
  "red-curtain",
  "mirrors",
  "through-boards",
  "snow",
];

/**
 * 04 · THE LANGUAGE OF COLOR — a room that changes temperature.
 * Choosing a swatch repaints the whole wall and brings another plate forward.
 */
export default function ColorLanguage() {
  const rootRef = useRef<HTMLElement>(null);
  const [room, setRoom] = useState(0);
  const { color } = homeCopy;

  const photos = PHOTO_SLUGS.map((slug) => getPhotographBySlug(slug)).filter(
    (photo): photo is Photograph => Boolean(photo)
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const blobs = root.querySelectorAll<HTMLElement>(".color__blob");
    if (!blobs.length) return;

    gsap.set(blobs, { xPercent: -50, yPercent: -50, x: -300, y: -300 });

    const setters = Array.from(blobs).map((blob, index) => ({
      x: gsap.quickTo(blob, "x", {
        duration: 1.1 + index * 0.55,
        ease: "power3",
      }),
      y: gsap.quickTo(blob, "y", {
        duration: 1.1 + index * 0.55,
        ease: "power3",
      }),
    }));

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      setters.forEach((setter, index) => {
        setter.x(event.clientX - rect.left + index * 46);
        setter.y(event.clientY - rect.top - index * 34);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(blobs);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="color"
      className="scene scene-color tone-dark"
      data-room={room}
      aria-labelledby="color-title"
    >
      <div className="color__wash" aria-hidden="true" />
      <div className="color__shade" aria-hidden="true" />

      <div className="color__blobs" aria-hidden="true">
        <span className="color__blob" />
        <span className="color__blob" />
        <span className="color__blob" />
      </div>

      <div className="wrap color__inner">
        <header className="color__head">
          <span className="eyebrow" lang="en">
            04 / {color.eyebrow}
          </span>

          <h2 id="color-title" className="display">
            THE LANGUAGE
            <em>OF COLOR</em>
          </h2>

          <p>{color.standfirst}</p>

          <div className="color__name">
            <strong>{colorObservations[room].name}</strong>
            <i>{colorObservations[room].hex}</i>
          </div>
          <p className="color__note">{colorObservations[room].note}</p>
        </header>

        <div className="color__viewer">
          <span className="color__ghost" aria-hidden="true">
            {colorObservations[room].name}
          </span>

          <div className="color__viewer-inner">
            {photos.map((photo, index) =>
              photo ? (
                <div
                  className="color__photo"
                  data-active={room === index}
                  key={photo.slug}
                >
                  <Plate
                    photo={photo}
                    sizes="(max-width: 1023px) 100vw, 34vw"
                    className="color__plate"
                  />
                </div>
              ) : null
            )}
          </div>

          <div className="color__viewer-tag">
            <b>{photos[room]?.title}</b>
            <span>{photos[room]?.year ?? "N.D."}</span>
          </div>
        </div>

        <div className="color__swatches" role="group" aria-label="选择颜色">
          {colorObservations.map((observation, index) => (
            <button
              key={observation.name}
              type="button"
              className="color__swatch"
              aria-pressed={room === index}
              onClick={() => setRoom(index)}
              data-cursor="link"
              data-cursor-label="SWITCH"
            >
              <span
                className="color__dot"
                style={{ background: observation.hex }}
                aria-hidden="true"
              />
              <span className="color__swatch-name" lang="en">
                {observation.name}
              </span>
              <span className="color__swatch-hex">{observation.hex}</span>
            </button>
          ))}
        </div>

        <p className="color__foot" lang="en">
          {color.note}
        </p>
      </div>
    </section>
  );
}
