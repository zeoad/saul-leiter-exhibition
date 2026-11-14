"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { scrollToTarget } from "@/lib/lenis";
import type { Photograph } from "@/types";

const TICKER = [
  "COLOR",
  "GLASS",
  "WEATHER",
  "THE ORDINARY",
  "FOUR WAYS OF LOOKING",
  "NEW YORK · 1947—2013",
];

/**
 * /vision — the screening opens.
 * A lens iris pulls back off the print, the two title lines rise out of their
 * masks, and the whole wall keeps a slow pointer parallax. Everything else on
 * the page is one of four ways of looking at the same city.
 */
export default function VisionHero({ photo }: { photo: Photograph }) {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  /* Pointer parallax — the wall breathes, the title drifts.
     Two normalised variables on the section; the offsets live in vision.css. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const paint = () => {
      const dx = tx - x;
      const dy = ty - y;

      if (Math.abs(dx) < 0.0008 && Math.abs(dy) < 0.0008) {
        x = tx;
        y = ty;
        frame = 0;
      } else {
        x += dx * 0.075;
        y += dy * 0.075;
        frame = window.requestAnimationFrame(paint);
      }

      root.style.setProperty("--hx", x.toFixed(4));
      root.style.setProperty("--hy", y.toFixed(4));
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      tx = event.clientX / window.innerWidth - 0.5;
      ty = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="vhero"
      aria-labelledby="vision-title"
      data-cursor="view"
      data-cursor-label="ENTER"
    >
      <div className="vhero__media" ref={mediaRef}>
        <Image
          src={photo.image.src}
          alt={photo.image.alt}
          fill
          priority
          sizes="100vw"
          className="vhero__img"
        />
      </div>

      <span className="vhero__scrim" aria-hidden="true" />
      <span className="vhero__leaf" aria-hidden="true" />

      <div className="vhero__gate" aria-hidden="true">
        <span className="vhero__gate-tick" />
        <span className="vhero__gate-tick" />
        <span className="vhero__gate-tick" />
        <span className="vhero__gate-tick" />
      </div>

      <span className="vhero__grain" aria-hidden="true" />
      <span className="vhero__iris" aria-hidden="true" />

      <div className="wrap vhero__inner">
        <div className="vhero__top">
          <span className="eyebrow" lang="en">
            THE VISION / 02
          </span>
          <span className="mono vhero__top-right" lang="en">
            FOUR CHAPTERS · SIXTEEN PLATES · ONE GAZE
          </span>
        </div>

        <h1 id="vision-title" ref={titleRef} className="vhero__title display" lang="en">
          <span className="line-mask">
            <span>A WAY</span>
          </span>
          <span className="line-mask">
            <span>OF <em>SEEING.</em></span>
          </span>
        </h1>

        <div className="vhero__foot">
          <p className="vhero__lede">
            雷特的摄影世界不是完整、清晰的世界。他更喜欢从局部开始观看：
            一块颜色、一片玻璃、一场雨，或一个偶然经过的身影。
          </p>

          <div className="vhero__aside" lang="en">
            <span>04 CHAPTERS</span>
            <span>COLOR / GLASS / WEATHER / LIFE</span>
            <span>READ SLOWLY</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="vhero__cue"
        data-cursor="link"
        data-cursor-label="ROLL"
        onClick={() => scrollToTarget("#color", -72)}
      >
        <span lang="en">ROLL THE REEL</span>
        <i aria-hidden="true" />
      </button>

      <div className="vhero__ticker" aria-hidden="true">
        <div className="vhero__ticker-track">
          {[...TICKER, ...TICKER, ...TICKER].map((item, index) => (
            <span key={`${item}-${index}`}>
              <b>✳</b>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
