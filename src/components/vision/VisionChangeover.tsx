"use client";

import { useEffect, useRef } from "react";

type Props = {
  number: string;
  kicker: string;
  titleCn: string;
};

/**
 * The changeover: a reel runs through the gate between acts. The stage is
 * black, a strip of film crosses it, the sprocket holes race past, and a
 * beam sweeps the frame before the next print comes up.
 *
 * Driven by a single `--chg-p` scroll variable so the route stays GSAP-free.
 */
export default function VisionChangeover({ number, kicker, titleCn }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let target = 0;
    let value = 0;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const raw = span > 0 ? -rect.top / span : 0;
      target = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    };

    const tick = () => {
      const delta = target - value;
      if (Math.abs(delta) < 0.0015) {
        value = target;
        root.style.setProperty("--chg-p", value.toFixed(3));
        frame = 0;
        return;
      }

      value += delta * 0.18;
      root.style.setProperty("--chg-p", value.toFixed(3));
      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    measure();
    value = target;
    root.style.setProperty("--chg-p", value.toFixed(3));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="vchange" ref={rootRef} aria-hidden="true">
      <div className="vchange__stage">
        <div className="vchange__film">
          <span className="vchange__perf" />
          <div className="vchange__body">
            <span className="vchange__num">{number}</span>
            <div className="vchange__meta">
              <span className="vchange__eyebrow">
                <i />
                CHANGE OF REEL
              </span>
              <span className="vchange__name">{kicker}</span>
              <span className="vchange__cn">{titleCn}</span>
            </div>
          </div>
          <span className="vchange__perf" />
        </div>

        <div className="vchange__beam" />
        <div className="vchange__grain" />
      </div>
    </section>
  );
}
