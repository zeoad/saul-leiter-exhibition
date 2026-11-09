"use client";

import { useRef } from "react";
import Image from "next/image";

import { homeCopy, painterPoints } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";
import type { Photograph } from "@/types";

type Side = "t" | "r" | "b" | "l";

const SIDE_LABEL: Record<Side, string> = {
  t: "TOP",
  r: "RIGHT",
  b: "BOTTOM",
  l: "LEFT",
};

function nearestSide(rect: DOMRect, x: number, y: number): Side {
  const distances: Record<Side, number> = {
    t: y,
    r: rect.width - x,
    b: rect.height - y,
    l: x,
  };

  return (Object.keys(distances) as Side[]).reduce((closest, side) =>
    distances[side] < distances[closest] ? side : closest
  , "t");
}

/**
 * One panel of the diptych: a desaturated print sits underneath, and the
 * fully coloured print is brushed in from whichever edge the pointer enters.
 * Leaving the frame reverses the brush back out.
 */
function PaintPanel({
  photo,
  className,
  label,
  ratio,
  sizes,
}: {
  photo: Photograph;
  className: string;
  label: string;
  ratio: string;
  sizes: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<HTMLSpanElement>(null);

  const edge = (side: Side) => {
    const panel = panelRef.current;
    if (!panel) return;

    panel.style.setProperty("--ci-t", side === "t" ? "100%" : "0%");
    panel.style.setProperty("--ci-r", side === "r" ? "100%" : "0%");
    panel.style.setProperty("--ci-b", side === "b" ? "100%" : "0%");
    panel.style.setProperty("--ci-l", side === "l" ? "100%" : "0%");
  };

  const onEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const side = nearestSide(
      rect,
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    edge(side);

    if (dirRef.current) {
      dirRef.current.textContent = `IN / ${SIDE_LABEL[side]}`;
    }

    panel.setAttribute("data-painted", "true");
  };

  const onLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const side = nearestSide(
      rect,
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    panel.removeAttribute("data-painted");
    edge(side);

    if (dirRef.current) {
      dirRef.current.textContent = `OUT / ${SIDE_LABEL[side]}`;
    }
  };

  return (
    <div
      ref={panelRef}
      className={`painter__panel ${className}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      data-cursor="view"
      data-cursor-label="PAINT"
    >
      <span className="painter__base">
        <Image
          src={photo.image.src}
          alt=""
          fill
          sizes={sizes}
          aria-hidden="true"
          style={{ objectFit: "cover" }}
        />
      </span>

      <span className="painter__over">
        <Image
          src={photo.image.src}
          alt={photo.image.alt}
          fill
          sizes={sizes}
          style={{ objectFit: "cover" }}
        />
      </span>

      <span className="painter__panel-tag">{label}</span>
      <span ref={dirRef} className="painter__panel-dir" aria-hidden="true">
        IN / —
      </span>

      <a
        href={photo.image.src}
        className="painter__link"
        data-pswp-lightbox
        data-pswp-width={photo.image.width}
        data-pswp-height={photo.image.height}
        data-pswp-caption={label}
        data-cursor="view"
        data-cursor-label="PAINT"
        aria-label={`查看作品：${photo.title} · ${ratio}`}
      />
    </div>
  );
}

/**
 * 08 · A PAINTER'S EYE — two prints, each held as a painting.
 * Move across a frame and colour arrives from the edge; move away and it
 * withdraws. The brush is reversible, so the gesture stays legible.
 */
export default function PaintersEye() {
  const { painter } = homeCopy;
  const blueSkirt = getPhotographBySlug("blue-skirt");
  const redCurtain = getPhotographBySlug("red-curtain");

  return (
    <section
      id="painters-eye"
      className="scene scene-painter tone-paper-deep"
      aria-labelledby="painter-title"
    >
      <span className="ghost-num" aria-hidden="true">
        08
      </span>

      <div className="wrap scene-head">
        <div className="scene-head__meta">
          <span className="eyebrow" lang="en">
            08 / {painter.eyebrow}
          </span>
          <span className="caption" lang="en">
            PAINTING FIRST · PHOTOGRAPHY SECOND
          </span>
        </div>

        <div className="scene-head__title">
          <h2 id="painter-title" className="title display">
            A PAINTER&apos;S
            <br />
            <em>EYE</em>
          </h2>
        </div>

        <div className="scene-head__aside">
          <p className="lede">{painter.standfirst}</p>
        </div>
      </div>

      <div className="wrap">
        <div className="painter__pair" data-reveal-group>
          {blueSkirt ? (
            <PaintPanel
              photo={blueSkirt}
              className="painter__panel--a"
              label={painter.comparisonLabels.left}
              ratio="4 / 3"
              sizes="(max-width: 1023px) 92vw, 46vw"
            />
          ) : null}

          {redCurtain ? (
            <PaintPanel
              photo={redCurtain}
              className="painter__panel--b"
              label={painter.comparisonLabels.right}
              ratio="1 / 1"
              sizes="(max-width: 1023px) 74vw, 30vw"
            />
          ) : null}
        </div>

        <p className="painter__instruction mono" aria-hidden="true">
          MOVE ACROSS A FRAME — THE COLOUR COMES IN FROM THE EDGE
        </p>

        <div className="painter__body">
          <div className="painter__text" data-reveal-group>
            {painter.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 12)}>{paragraph}</p>
            ))}
            <p className="painter__note meta">{painter.note}</p>
          </div>

          <div className="painter__points" data-reveal-group>
            {painterPoints.map((point) => (
              <div className="painter__point" key={point.label}>
                <span>{point.label}</span>
                <p>{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
