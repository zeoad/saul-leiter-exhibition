"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Plate from "@/components/ui/Plate";
import { getFeaturedPhotographs } from "@/lib/gallery";
import { getLenis } from "@/lib/lenis";

const SHIFT = 1.55;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 09 · SELECTED WORKS — the wall moves sideways.
 * Vertical scroll is mapped onto a horizontal pin; the track can also be
 * dragged, and the plate counter follows whichever plate is in the light.
 */
export default function SelectedWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  const works = getFeaturedPhotographs();

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!root || !pin || !track || !works.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add("(min-width: 1024px)", () => {
      let frame = 0;

      const distance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 160);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance() + 320}`,
          pin,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (railRef.current) {
              railRef.current.style.width = `${self.progress * 100}%`;
            }

            const next = Math.min(
              works.length - 1,
              Math.max(0, Math.round(self.progress * (works.length - 1)))
            );

            if (!frame) {
              frame = window.requestAnimationFrame(() => {
                frame = 0;
                setIndex((current) => (current === next ? current : next));
              });
            }
          },
        },
      });

      /* Drag maps onto the same scroll range, so both gestures agree. */
      let dragging = false;
      let startX = 0;
      let startScroll = 0;
      let travelled = 0;

      const onDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragging = true;
        travelled = 0;
        startX = event.clientX;
        startScroll = window.scrollY;
        track.setAttribute("data-dragging", "true");
      };

      const onMove = (event: PointerEvent) => {
        if (!dragging) return;
        const delta = startX - event.clientX;
        travelled = Math.max(travelled, Math.abs(delta));
        if (travelled > 6) event.preventDefault();

        const target = Math.max(
          0,
          Math.min(
            startScroll + delta * SHIFT,
            document.documentElement.scrollHeight - window.innerHeight
          )
        );

        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(target, { immediate: true, force: true });
        } else {
          window.scrollTo(0, target);
        }
      };

      const onUp = () => {
        dragging = false;
        track.removeAttribute("data-dragging");
      };

      pin.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);

      return () => {
        tween.kill();
        if (frame) window.cancelAnimationFrame(frame);
        pin.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };
    });

    return () => media.revert();
  }, [works.length]);

  return (
    <section
      ref={rootRef}
      id="selected-works"
      className="scene scene-works tone-dark"
      aria-labelledby="works-title"
    >
      <div ref={pinRef} className="works__pin">
        <header className="works__head">
          <span className="eyebrow" lang="en">
            09 / SELECTED WORKS
          </span>
          <h2 id="works-title" className="display">
            A COLLECTION
            <em>OF MOMENTS.</em>
          </h2>
          <p className="works__head-note">
            NINE PLATES FROM THE REGISTER · CLICK A FRAME TO READ THE WORK
          </p>
        </header>

        <div className="works__count" aria-live="off">
          <span lang="en">PLATE IN LIGHT</span>
          <b>
            {String(index + 1).padStart(2, "0")}
            <i> / {String(works.length).padStart(2, "0")}</i>
          </b>
        </div>

        <div ref={trackRef} className="works__track">
          {works.map((photo, position) => (
            <div className="works__item" key={photo.slug}>
              <Plate
                photo={photo}
                href={`/work/${photo.slug}/`}
                cursorLabel="READ THE PLATE"
                sizes="(max-width: 1023px) 72vw, 22vw"
                className="works__plate"
              />
              <span className="works__item-no" aria-hidden="true">
                {String(position + 1).padStart(2, "0")}
              </span>
              <div className="works__item-meta">
                <b>{photo.title}</b>
                <span>{photo.year ?? "N.D."}</span>
              </div>
            </div>
          ))}

          <div className="works__end">
            <p>
              The rest of the register is
              <br />
              十六张底片，一整个房间。
            </p>
            <Link href="/work/" className="btn">
              浏览全部作品
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <div className="works__rail" aria-hidden="true">
          <i ref={railRef} />
        </div>

        <p className="works__hint" aria-hidden="true">
          <span lang="en">SCROLL OR DRAG — THE WALL MOVES SIDEWAYS</span>
        </p>
      </div>
    </section>
  );
}
