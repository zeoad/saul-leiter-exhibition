"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";

import type { Photograph } from "@/types";

type Props = {
  photos: Photograph[];
  plates: number;
  categories: number;
};

const WORD = "ARCHIVE";

/**
 * The overture: a drawer of index cards is pulled open.
 *
 * A red reading line sweeps the frame, the wordmark rises letter by letter,
 * five plates fan out of the drawer, and the counter runs up to the number of
 * plates in the register. Purely on load — nothing here delays the wheel.
 */
export default function ArchiveOverture({ photos, plates, categories }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const scan = scanRef.current;
    if (!root || !scan) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (countRef.current) {
        countRef.current.textContent = String(plates).padStart(3, "0");
      }
      return;
    }

    const chars = charRefs.current.filter((node): node is HTMLElement =>
      Boolean(node)
    );
    const cards = cardRefs.current.filter((node): node is HTMLElement =>
      Boolean(node)
    );

    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        scan,
        { top: "0%", opacity: 0 },
        { top: "100%", opacity: 1, duration: 1.15, ease: "power1.inOut" },
        0
      )
        .to(scan, { opacity: 0, duration: 0.35 }, 1.05)
        .fromTo(
          chars,
          { yPercent: 115 },
          { yPercent: 0, duration: 1.05, stagger: 0.055, ease: "power4.out" },
          0.18
        )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.62
        )
        .to(
          counter,
          {
            value: plates,
            duration: 1.15,
            ease: "power2.out",
            onUpdate: () => {
              if (!countRef.current) return;
              countRef.current.textContent = String(
                Math.round(counter.value)
              ).padStart(3, "0");
            },
          },
          0.55
        )
        .fromTo(
          cueRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6 },
          1.5
        );

      cards.forEach((card, index) => {
        tl.fromTo(
          card,
          { "--rise": "175%", opacity: 0 },
          {
            "--rise": "0%",
            opacity: 1,
            duration: 1.15,
            ease: "power3.out",
          },
          0.42 + index * 0.075
        );
      });
    }, root);

    return () => ctx.revert();
  }, [plates, photos.length]);

  return (
    <section className="aov" ref={rootRef} aria-label="档案开场">
      <div className="aov__rules" aria-hidden="true" />
      <div className="aov__scan" ref={scanRef} aria-hidden="true" />

      <div className="aov__inner">
        <p className="aov__eyebrow" ref={eyebrowRef} lang="en">
          <i />
          DIGITAL IMAGE INDEX · 1947—2013
        </p>

        <h1 className="aov__title" aria-label={WORD} lang="en">
          {WORD.split("").map((char, index) => (
            <span
              className="aov__char"
              key={`${char}-${index}`}
              ref={(node) => {
                charRefs.current[index] = node;
              }}
              aria-hidden="true"
            >
              <i>{char}</i>
            </span>
          ))}
        </h1>

        <div className="aov__deck" aria-hidden="true">
          <span className="aov__ring" />
          {photos.map((photo, index) => {
            const offset = index - (photos.length - 1) / 2;
            const distance = Math.abs(offset);

            return (
              <figure
                className="aov__card"
                key={photo.slug}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                style={
                  {
                    "--n": String(offset),
                    zIndex: Math.round(20 - distance * 2),
                  } as CSSProperties
                }
              >
                <span className="aov__frame">
                  <Image
                    src={photo.image.src}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 22vw, 180px"
                    className="aov__img"
                  />
                </span>
                <figcaption lang="en">{photo.plate}</figcaption>
              </figure>
            );
          })}
        </div>

        <p className="aov__counts" lang="en">
          <span>
            <b ref={countRef}>000</b> PLATES
          </span>
          <span>
            <b>{String(categories).padStart(2, "0")}</b> CATEGORIES
          </span>
          <span>
            <b>ONE</b> REGISTER
          </span>
        </p>
      </div>

      <p className="aov__cue" ref={cueRef} lang="en">
        SCROLL TO OPEN THE REGISTER
        <i />
      </p>
    </section>
  );
}
