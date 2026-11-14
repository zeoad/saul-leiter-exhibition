"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import { getPhotographBySlug } from "@/lib/gallery";
import { scrollToTarget } from "@/lib/lenis";

const TICKER = [
  "TAXI · 1957",
  "THROUGH BOARDS · 1957",
  "RED CURTAIN · 1956",
  "MIRRORS · C. 1962",
  "SNOW · 1970",
  "RAIN · 1950s",
  "BLUE SKIRT · 1950s",
  "SAN CARLO RESTAURANT · 1952",
];

/**
 * 01 · THE COVER — the film gate opens, and points at the programme.
 *
 * The cover holds exactly one photograph and one way forward. Nothing here
 * previews the other rooms; that is the programme's job, one screen below.
 */
export default function Cover() {
  const rootRef = useRef<HTMLElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const taxi = getPhotographBySlug("taxi");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      /* Resolve every target inside this scene once, so late (event-driven)
         tweens never depend on GSAP's context selector scoping. */
      const pick = (selector: string) =>
        gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector));
      const eyebrow = pick(".cover__eyebrow");
      const titleLines = pick(".cover__title-line > span");
      const sub = pick(".cover__sub");
      const en = pick(".cover__en");
      const hud = pick(".cover__hud");
      const plateTag = pick(".cover__plate-tag");
      const ticker = pick(".cover__ticker");

      const introOpen = document.documentElement.classList.contains("intro-open");
      let played = false;
      let timeline: gsap.core.Timeline | null = null;

      const reset = () => {
        gsap.set(frameRef.current, {
          clipPath: "inset(22% 26% 26% 30%)",
        });
        gsap.set(eyebrow, { opacity: 0, y: 12 });
        gsap.set(titleLines, { yPercent: 112 });
        gsap.set([...sub, ...en], { opacity: 0, y: 18 });
        gsap.set([...hud, ...plateTag], { opacity: 0, y: 14 });
        gsap.set(ticker, { opacity: 0 });
      };

      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        timeline = tl;

        tl.to(frameRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.55,
          ease: "power4.inOut",
        }, 0)
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
          .to(
            titleLines,
            { yPercent: 0, duration: 1.15, stagger: 0.16, ease: "power4.out" },
            0.18
          )
          .to(sub, { opacity: 1, y: 0, duration: 0.8 }, 0.72)
          .to(en, { opacity: 1, y: 0, duration: 0.8 }, 0.86)
          .to(hud, { opacity: 1, y: 0, duration: 0.8 }, 1.0)
          .to(plateTag, { opacity: 1, y: 0, duration: 0.6 }, 1.1)
          .to(ticker, { opacity: 1, duration: 0.9 }, 1.2);
      };

      const onDone = () => play();

      const onReplay = () => {
        timeline?.kill();
        played = false;
        reset();
      };

      reset();

      window.addEventListener("aqg:intro-done", onDone);
      window.addEventListener("aqg:intro-replay", onReplay);

      if (!introOpen) play();

      return () => {
        window.removeEventListener("aqg:intro-done", onDone);
        window.removeEventListener("aqg:intro-replay", onReplay);
        timeline?.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  /* Pointer parallax — three depths. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const gate = gateRef.current;
    const frame = frameRef.current;
    const title = titleRef.current;
    if (!gate || !frame || !title) return;

    const gateX = gsap.quickTo(gate, "x", { duration: 0.9, ease: "power3" });
    const gateY = gsap.quickTo(gate, "y", { duration: 0.9, ease: "power3" });
    const titleX = gsap.quickTo(title, "x", { duration: 1.1, ease: "power3" });
    const titleY = gsap.quickTo(title, "y", { duration: 1.1, ease: "power3" });

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;

      gateX(nx * -18);
      gateY(ny * -14);
      titleX(nx * 9);
      titleY(ny * 7);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf([gate, frame, title]);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="cover"
      className="scene scene-cover tone-dark"
      aria-labelledby="cover-title"
    >
      <div className="cover__film" aria-hidden="true" />

      <div ref={gateRef} className="cover__gate">
        <div ref={frameRef} className="cover__frame">
          {taxi ? (
            <Image
              className="cover__image"
              src={taxi.image.src}
              alt={taxi.image.alt}
              fill
              priority
              sizes="58vw"
            />
          ) : null}
          <span className="cover__scrim" aria-hidden="true" />

          <span className="cover__plate-tag" aria-hidden="true">
            <b>Taxi</b>
            <span>1957 · PL. 006</span>
            <span>© ESTATE OF SAUL LEITER</span>
          </span>
        </div>
      </div>

      <div className="cover__gate-marks" aria-hidden="true" />

      <div className="cover__inner">
        <span className="cover__eyebrow eyebrow" lang="en">
          AN INDEPENDENT DIGITAL EXHIBITION
        </span>

        <h1 id="cover-title" ref={titleRef} className="cover__title hero-title display">
          <span className="cover__title-line">
            <span>THE</span>
          </span>
          <span className="cover__title-line">
            <span>ART OF</span>
          </span>
          <span className="cover__title-line">
            <span className="cover__title-italic">
              SEEING<em>.</em>
            </span>
          </span>
        </h1>

        <p className="cover__sub">
          <span lang="cn">索尔·雷特</span>
          <span lang="cn">静默的凝视</span>
        </p>

        <p className="cover__en" lang="en">
          Four rooms about colour, obstruction, weather and the ordinary.
          <br />
          Photographs by Saul Leiter, 1923—2013, New York.
        </p>
      </div>

      <div className="cover__hud">
        <div>
          <span lang="en">NEW YORK / 1957</span>
          <br />
          <span lang="en">35MM · COLOUR TRANSPARENCY</span>
        </div>

        <div className="cover__hud-mid">
          <b>04</b>
          <span lang="en">ROOMS</span>
        </div>

        <button
          type="button"
          className="cover__scroll"
          onClick={() => scrollToTarget("#programme", -40)}
          data-cursor="link"
          data-cursor-label="ENTER"
          aria-label="进入节目单，选择展厅"
        >
          <span lang="en">ENTER THE PROGRAMME</span>
          <i aria-hidden="true" />
        </button>
      </div>

      <div className="cover__ticker" aria-hidden="true">
        <div className="marquee">
          <div className="marquee__track">
            {[...TICKER, ...TICKER].map((item, index) => (
              <span className="marquee__item" key={`${item}-${index}`}>
                <b>·</b>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
