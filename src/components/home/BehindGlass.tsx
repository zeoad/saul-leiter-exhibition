"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import { glassNotes, homeCopy } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";
import { photographs } from "@/data/photographs";

/**
 * 05 · BEHIND THE GLASS — the pointer is a small light.
 * Condensation covers the print; wherever you move, the glass clears.
 */
export default function BehindGlass() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const main = getPhotographBySlug("mirrors") ?? photographs[0];
  const city = getPhotographBySlug("sidewalk") ?? photographs[0];
  const board = getPhotographBySlug("through-boards") ?? photographs[0];
  const detail = getPhotographBySlug("phone-call") ?? photographs[0];
  const { glass } = homeCopy;

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const layers = {
      city: root.querySelector<HTMLElement>(".glass__layer--city"),
      photo: root.querySelector<HTMLElement>(".glass__layer--photo"),
      obstruct: root.querySelector<HTMLElement>(".glass__layer--obstruct"),
      detail: root.querySelector<HTMLElement>(".glass__layer--detail"),
    };

    const move = (el: HTMLElement | null, duration: number) => ({
      x: el ? gsap.quickTo(el, "x", { duration, ease: "power3" }) : null,
      y: el ? gsap.quickTo(el, "y", { duration, ease: "power3" }) : null,
    });

    const cityMove = move(layers.city, 1.4);
    const photoMove = move(layers.photo, 1.0);
    const obstructMove = move(layers.obstruct, 0.8);
    const detailMove = move(layers.detail, 1.6);

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      stage.style.setProperty("--gx", `${x}px`);
      stage.style.setProperty("--gy", `${y}px`);

      const nx = x / rect.width - 0.5;
      const ny = y / rect.height - 0.5;

      cityMove.x?.(-nx * 26);
      cityMove.y?.(-ny * 20);
      photoMove.x?.(nx * 14);
      photoMove.y?.(ny * 10);
      obstructMove.x?.(-nx * 34);
      obstructMove.y?.(ny * 22);
      detailMove.x?.(nx * 18);
      detailMove.y?.(-ny * 14);
    };

    stage.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stage.removeEventListener("pointermove", onMove);
      gsap.killTweensOf([
        ...Object.values(layers).filter(Boolean),
        stage,
      ]);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="behind-the-glass"
      className="scene scene-glass tone-paper-deep"
      aria-labelledby="glass-title"
    >
      <div className="wrap glass__head">
        <div>
          <span className="eyebrow" lang="en">
            05 / {glass.eyebrow}
          </span>
          <h2 id="glass-title" className="display">
            BEHIND <em>THE GLASS</em>
          </h2>
          <p className="glass__cn">隔着玻璃 · 雨水与反光</p>
        </div>

        <aside className="glass__head-aside">
          <p className="lede">{glass.standfirst}</p>
          <p className="caption" lang="en">
            MOVE THE POINTER — CLEAR A SMALL CIRCLE IN THE CONDENSATION
          </p>
        </aside>
      </div>

      <div ref={stageRef} className="glass__stage">
        <div className="glass__layer glass__layer--city" aria-hidden="true">
          <Image
            src={city.image.src}
            alt=""
            fill
            sizes="70vw"
            className="plate__img"
          />
        </div>

        <div className="glass__layer glass__layer--photo">
          <Image
            src={main.image.src}
            alt={main.image.alt}
            fill
            sizes="56vw"
            className="plate__img"
          />
        </div>

        <div className="glass__layer glass__layer--obstruct">
          <Image
            src={board.image.src}
            alt={board.image.alt}
            fill
            sizes="30vw"
            className="plate__img"
          />
        </div>

        <div className="glass__layer glass__layer--detail" aria-hidden="true">
          <Image
            src={detail.image.src}
            alt=""
            fill
            sizes="20vw"
            className="plate__img"
          />
        </div>

        <div className="glass__frost" aria-hidden="true" />
        <div className="glass__frost-grain" aria-hidden="true" />
        <div className="glass__light" aria-hidden="true" />

        <div className="glass__hud">
          <span lang="en">
            <b>CONDENSATION / 05</b>
          </span>
          <span lang="en">THE SURFACE REMEMBERS THE WEATHER</span>
        </div>

        <span className="glass__frame-no" lang="en">
          PL. 004 · MIRRORS · C. 1962
        </span>
      </div>

      <div className="wrap glass__notes">
        {glassNotes.map((note, index) => (
          <div className="glass__note" key={note.label}>
            <span className="glass__note-index">
              0{index + 1}
            </span>
            <span className="glass__note-label" lang="en">
              {note.label}
            </span>
            <span className="glass__note-text">{note.text}</span>
          </div>
        ))}
      </div>

      <div className="wrap glass__quote">
        <p>“{glass.pullquote}”</p>
      </div>
    </section>
  );
}
