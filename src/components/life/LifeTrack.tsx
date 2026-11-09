"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getPhotographBySlug } from "@/lib/gallery";
import { timeline } from "@/data/timeline";

const NODE_PHOTOS: Record<string, string> = {
  "1923": "/images/portraits/leiter-portrait.webp",
  "1946": "walking",
  "1947–48": "canopy",
  "1953": "mirrors",
  "1950s–60s": "phone-call",
  "1950s–70s": "red-curtain",
  "1980s–90s": "through-boards",
  "2006": "taxi",
  "2013": "snow",
  "2014": "blue-skirt",
};

/**
 * /life — the chronology laid out as a reel.
 * Native horizontal scrolling plus pointer dragging; the red progress line
 * reports how far along the life you have walked.
 */
export default function LifeTrack() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const bar = barRef.current;
    if (!scroller || !bar) return;

    let frame = 0;

    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const travel = scroller.scrollWidth - scroller.clientWidth;
        const progress = travel > 0 ? scroller.scrollLeft / travel : 0;
        bar.style.width = `${6 + progress * 94}%`;
      });
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const startX = event.clientX;
      const startLeft = scroller.scrollLeft;
      scroller.setAttribute("data-dragging", "true");

      const onMove = (move: PointerEvent) => {
        scroller.scrollLeft = startLeft - (move.clientX - startX);
      };

      const onUp = () => {
        scroller.removeAttribute("data-dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    scroller.addEventListener("scroll", update, { passive: true });
    scroller.addEventListener("pointerdown", onDown);
    update();

    return () => {
      scroller.removeEventListener("scroll", update);
      scroller.removeEventListener("pointerdown", onDown);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="life-track" aria-labelledby="life-track-title">
      <div className="life-track__head">
        <div>
          <span className="eyebrow" lang="en">
            THE YEARS / 03
          </span>
          <h2 id="life-track-title" className="display" lang="en">
            A LIFE, <em>IN TIME.</em>
          </h2>
        </div>
        <span className="life-track__hint" lang="en">
          DRAG SIDEWAYS · 11 ENTRIES
        </span>
      </div>

      <div ref={scrollerRef} className="life-track__scroller">
        {timeline.map((event, index) => {
          const key = NODE_PHOTOS[event.year];
          const direct = key?.startsWith("/") ? key : "";
          const photo = key && !direct ? getPhotographBySlug(key) : undefined;

          return (
            <article
              key={event.year}
              className={`life-node${event.highlight ? " is-highlight" : ""}`}
            >
              <span className="life-node__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <b className="life-node__year" lang="en">
                {event.year}
              </b>
              <span className="life-node__place">{event.titleCn}</span>

              {photo ? (
                <div className="life-node__image">
                  <Image
                    src={photo.image.src}
                    alt={photo.image.alt}
                    fill
                    sizes="(max-width: 1023px) 60vw, 24vw"
                  />
                </div>
              ) : direct ? (
                <div className="life-node__image">
                  <Image
                    src={direct}
                    alt="索尔·雷特肖像，约 1950 年代。"
                    fill
                    sizes="(max-width: 1023px) 60vw, 24vw"
                    style={{ objectPosition: "50% 28%" }}
                  />
                </div>
              ) : null}

              <h3 className="life-node__title">
                {event.titleCn}
                <span lang="en">{event.title}</span>
              </h3>

              <p className="life-node__text">{event.body}</p>

              {event.source ? (
                <a
                  className="life-node__source"
                  href={event.source.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  lang="en"
                >
                  {event.source.label.toUpperCase()} ↗
                </a>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="life-track__progress" aria-hidden="true">
        <i ref={barRef} />
      </div>
    </section>
  );
}
