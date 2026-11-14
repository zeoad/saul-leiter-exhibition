"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  number: string;
  kicker: string;
  titleCn: string;
};

/**
 * The changeover: a reel runs through the gate between acts. The stage is
 * black, a strip of film crosses it, the sprocket holes race past, and a
 * beam sweeps the frame before the next print comes up.
 */
export default function VisionChangeover({ number, kicker, titleCn }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const perfTopRef = useRef<HTMLSpanElement>(null);
  const perfBottomRef = useRef<HTMLSpanElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const film = filmRef.current;
    const perfTop = perfTopRef.current;
    const perfBottom = perfBottomRef.current;
    const beam = beamRef.current;
    const meta = metaRef.current;

    if (!root || !film || !perfTop || !perfBottom || !beam || !meta) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      tl.fromTo(film, { xPercent: 10 }, { xPercent: -10, duration: 1 }, 0);
      tl.fromTo(
        perfTop,
        { backgroundPositionX: "0px" },
        { backgroundPositionX: "-720px", duration: 1 },
        0
      );
      tl.fromTo(
        perfBottom,
        { backgroundPositionX: "0px" },
        { backgroundPositionX: "720px", duration: 1 },
        0
      );
      tl.fromTo(
        beam,
        { xPercent: -190, opacity: 0.15 },
        { xPercent: 190, opacity: 0.85, duration: 1 },
        0
      );
      tl.fromTo(
        meta,
        { opacity: 0, yPercent: 16 },
        { opacity: 1, yPercent: 0, duration: 0.26, ease: "power2.out" },
        0.04
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="vchange" ref={rootRef} aria-hidden="true">
      <div className="vchange__stage">
        <div className="vchange__film" ref={filmRef}>
          <span className="vchange__perf" ref={perfTopRef} />
          <div className="vchange__body">
            <span className="vchange__num">{number}</span>
            <div className="vchange__meta" ref={metaRef}>
              <span className="vchange__eyebrow">
                <i />
                CHANGE OF REEL
              </span>
              <span className="vchange__name">{kicker}</span>
              <span className="vchange__cn">{titleCn}</span>
            </div>
          </div>
          <span className="vchange__perf" ref={perfBottomRef} />
        </div>

        <div className="vchange__beam" ref={beamRef} />
        <div className="vchange__grain" />
      </div>
    </section>
  );
}
