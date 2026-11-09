"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { homeCopy } from "@/data/exhibition";

/**
 * 02 · OPENING STATEMENT — the portrait is still developing while you read.
 * Scroll acts as the developer tray: the closer you read, the sharper it gets.
 */
export default function OpeningStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const { opening } = homeCopy;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const portrait = portraitRef.current;
      if (!portrait) return;

      gsap.fromTo(
        portrait,
        { "--dev": 1 },
        {
          "--dev": 0,
          ease: "none",
          scrollTrigger: {
            trigger: portrait,
            start: "top 88%",
            end: "top 34%",
            scrub: 0.6,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="statement"
      className="scene scene-statement tone-paper"
      aria-labelledby="statement-title"
    >
      <span className="ghost-num" aria-hidden="true">
        02
      </span>

      <div className="wrap statement__grid">
        <div ref={portraitRef} className="statement__portrait">
          <div className="plate__frame">
            <Image
              src={opening.portrait.src}
              alt={opening.portrait.alt}
              fill
              sizes="(max-width: 767px) 62vw, 32vw"
              className="plate__img"
            />
            <span className="plate__grain" aria-hidden="true" />
            <span className="plate__marks" aria-hidden="true" />
            <span className="plate__no">PL. 000 · SELF</span>
          </div>

          <div className="statement__devlabel">
            <span lang="en">DARKROOM / DEVELOPING</span>
            <span lang="en">02</span>
          </div>

          <dl className="statement__facts">
            <div>
              <dt lang="en">BORN</dt>
              <dd>1923 · PITTSBURGH</dd>
            </div>
            <div>
              <dt lang="en">ARRIVED</dt>
              <dd>1946 · NEW YORK</dd>
            </div>
            <div>
              <dt lang="en">DIED</dt>
              <dd>2013 · NEW YORK</dd>
            </div>
          </dl>
        </div>

        <div className="statement__copy">
          <span className="eyebrow" lang="en">
            02 / {opening.eyebrow}
          </span>

          <h2
            id="statement-title"
            className="statement__title display"
          >
            <span className="line-mask">
              <span>THE ART</span>
            </span>
            <span className="line-mask">
              <span>
                OF <em>LOOKING</em>
              </span>
            </span>
          </h2>

          <p className="statement__cn">论观看</p>

          <div className="statement__body" data-reveal-group>
            {opening.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="statement__quote">
            <p>“{opening.pullquote}”</p>
            <cite lang="en">CURATORIAL NOTE — A QUIET GAZE</cite>
          </blockquote>

          <div className="statement__foot">
            <span className="caption">{opening.signature}</span>
            <Link
              href="/vision/"
              className="linkline"
              data-cursor="link"
              data-cursor-label="READ"
            >
              <span lang="en">READ THE FULL ESSAY</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
