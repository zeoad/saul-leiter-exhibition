"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Rewind } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { homeCopy, site } from "@/data/exhibition";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { getPhotographBySlug } from "@/lib/gallery";

/**
 * 11 · CLOSING — the film gate closes again.
 * The two bars travel into the frame as the section enters, the essay
 * arrives underneath, and the projector can be rewound to the very start.
 */
export default function Closing() {
  const rootRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const copy = homeCopy.closing;
  const sidewalk = getPhotographBySlug("sidewalk");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: root,
        start: "top 85%",
        end: "top 25%",
        scrub: 0.6,
      };

      gsap.fromTo(
        topRef.current,
        { yPercent: -100 },
        { yPercent: 0, ease: "none", scrollTrigger: trigger }
      );

      gsap.fromTo(
        bottomRef.current,
        { yPercent: 100 },
        { yPercent: 0, ease: "none", scrollTrigger: { ...trigger } }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const replay = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("aqg:intro-replay"));
    }, 80);
  };

  return (
    <section
      ref={rootRef}
      id="closing"
      className="scene scene-closing tone-dark"
      aria-labelledby="closing-title"
    >
      <div className="closing__bg" aria-hidden="true">
        <Image
          src={
            sidewalk?.image.src ?? "/images/hero/closing-quiet.webp"
          }
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "50% 42%" }}
        />
      </div>
      <span className="closing__bg-scrim" aria-hidden="true" />

      <div ref={topRef} className="closing__film closing__film--top" aria-hidden="true" />
      <div
        ref={bottomRef}
        className="closing__film closing__film--bottom"
        aria-hidden="true"
      />

      <div className="wrap closing__inner">
        <span className="eyebrow" lang="en">
          11 / CLOSING ESSAY
        </span>

        <h2 id="closing-title" className="closing__title display">
          LOOK
          <em>AGAIN.</em>
        </h2>

        <p className="closing__cn">离开之前，请再看一次。</p>

        <div className="closing__essay" data-reveal-group>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 12)}>{paragraph}</p>
          ))}
        </div>

        <p className="closing__line">{copy.closingLine}</p>

        <div className="closing__actions">
          <Link href="/work/" className="btn">
            浏览全部作品
            <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
          </Link>
          <Link href="/archive/" className="btn">
            打开数字档案
            <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            className="closing__replay"
            onClick={replay}
            data-cursor="link"
            data-cursor-label="REWIND"
          >
            <Rewind aria-hidden="true" strokeWidth={1.5} size={14} />
            REPLAY THE OPENING
          </button>
        </div>

        <div className="closing__signature">
          <span>{site.name} — {site.subtitle}</span>
          <span>{site.curator}</span>
          <span>{site.season}</span>
          <button
            type="button"
            className="closing__back"
            onClick={() => scrollToTarget(0)}
          >
            BACK TO THE COVER ↑
          </button>
        </div>
      </div>
    </section>
  );
}
