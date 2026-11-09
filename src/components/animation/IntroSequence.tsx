"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { photographs } from "@/data/photographs";
import { startScroll, stopScroll } from "@/lib/lenis";

/**
 * OPENING SEQUENCE — the archive wall before the exhibition.
 *
 *   act I    three film strips slide into place and start travelling,
 *            frames of the archive passing like a contact sheet on a wall
 *   act II   the title flickers on over the moving film, like a lamp
 *   act III  the screen lifts and the page is handed over
 *
 * Plays once per page load. Skipped entirely for reduced-motion visitors,
 * and can be dismissed at any moment by clicking or pressing Escape.
 */

/* Survives client-side navigation, resets on a full reload. */
let introPlayed = false;

const THUMB = (src: string) => src.replace(/\.(webp|jpg|jpeg|png)$/i, "-480.$1");
const pad = (n: number) => String(n).padStart(3, "0");

/* Three horizontal lanes, each showing a different slice of the archive and
   travelling in alternating directions. Values are layout, not animation. */
const STRIPS = [
  { offset: 0, dir: -1, duration: 42, top: "1vh", rotate: -4 },
  { offset: 5, dir: 1, duration: 56, top: "34vh", rotate: 3.5 },
  { offset: 10, dir: -1, duration: 34, top: "67vh", rotate: -2.5 },
] as const;

const CELLS_PER_STRIP = 8;

export default function IntroSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [runId, setRunId] = useState(0);
  const leavingRef = useRef(false);

  const finish = useCallback(() => {
    introPlayed = true;
    setDone(true);
    document.documentElement.classList.remove("intro-open");
    startScroll();
    window.dispatchEvent(new CustomEvent("aqg:intro-done"));
  }, []);

  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);

    const root = rootRef.current;
    if (!root) {
      finish();
      return;
    }

    gsap.to(root, {
      opacity: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: finish,
    });
  }, [finish]);

  /* The closing scene can rewind the whole opening sequence. */
  useEffect(() => {
    const onReplay = () => {
      introPlayed = false;
      leavingRef.current = false;
      setLeaving(false);
      setDone(false);
      setRunId((count) => count + 1);
    };

    window.addEventListener("aqg:intro-replay", onReplay);
    return () => window.removeEventListener("aqg:intro-replay", onReplay);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (introPlayed || reduce) {
      introPlayed = true;
      setDone(true);
      document.documentElement.classList.remove("intro-open");
      startScroll();
      return;
    }

    document.documentElement.classList.add("intro-open");
    stopScroll();

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      /* The strips travel for as long as the intro is on screen. */
      root.querySelectorAll<HTMLElement>(".intro__strip").forEach((strip, index) => {
        const lane = STRIPS[index];
        const track = strip.querySelector<HTMLElement>(".intro__track");
        if (!lane || !track) return;

        gsap.set(track, { xPercent: lane.dir === 1 ? -50 : 0 });
        gsap.to(track, {
          xPercent: lane.dir === 1 ? 0 : -50,
          duration: lane.duration,
          ease: "none",
          repeat: -1,
        });
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".intro__wall",
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
        0
      )
        /* A held beat of film, then the words arrive. */
        .fromTo(
          ".intro__eyebrow",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7 },
          2.2
        )
        .fromTo(
          ".intro__line",
          { opacity: 0, y: 54 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.24,
            ease: "power4.out",
          },
          2.35
        )
        .fromTo(
          ".intro__rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
          2.85
        )
        .fromTo(
          ".intro__sub",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          3.25
        )
        .fromTo(
          ".intro__hint",
          { opacity: 0 },
          { opacity: 1, duration: 0.7 },
          3.85
        )
        /* A held beat, then hand the screen over. */
        .call(leave, [], 5.8);
    }, root);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("intro-open");
    };
  }, [leave, runId]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="intro"
      data-leaving={leaving}
      aria-hidden="true"
      onClick={leave}
    >
      <div className="intro__wall">
        {STRIPS.map((strip, stripIndex) => {
          const cells = Array.from({ length: CELLS_PER_STRIP }, (_, i) => {
            const photo = photographs[(strip.offset + i) % photographs.length];
            return { photo, index: (strip.offset + i) % photographs.length };
          });

          return (
            <div
              key={stripIndex}
              className="intro__strip"
              style={
                {
                  "--y": strip.top,
                  "--rot": `${strip.rotate}deg`,
                } as React.CSSProperties
              }
            >
              <div className="intro__track">
                {[...cells, ...cells].map(({ photo, index }, i) => (
                  <span className="intro__cell" key={`${stripIndex}-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- intro film strip */}
                    <img
                      className="intro__frame"
                      src={THUMB(photo.image.src)}
                      alt=""
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                    <span className="intro__cell-no">{pad(index + 1)}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="intro__veil" />

      <div className="intro__content">
        <span className="intro__eyebrow">AN INDEPENDENT DIGITAL EXHIBITION</span>

        <p className="intro__title">
          <span className="intro__line">
            <span className="intro__line-text">THE ART OF</span>
          </span>
          <span className="intro__line intro__line--italic">
            <span className="intro__line-text">SEEING.</span>
          </span>
        </p>

        <span className="intro__rule" />

        <p className="intro__sub">
          <span>索尔·雷特</span>
          <span className="intro__sub-zh">静默的凝视 · 1923—2013</span>
        </p>

        <p className="intro__hint" lang="en">
          CLICK OR TAP TO ENTER
        </p>
      </div>

      <span className="intro__skip" lang="en">
        SKIP INTRO
      </span>

      <div className="intro__scan" />
      <div className="intro__grain" />
    </div>
  );
}
