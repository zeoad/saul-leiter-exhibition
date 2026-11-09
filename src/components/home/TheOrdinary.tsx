"use client";

import { useRef } from "react";

import Plate from "@/components/ui/Plate";
import { homeCopy, ordinaryNotes } from "@/data/exhibition";
import { getPhotographsBySlugs } from "@/lib/gallery";

const SLUGS = ["sidewalk", "foot-on-el", "graffiti-heads"];

const POSITIONS = ["50% 40%", "50% 50%", "50% 35%"];

/**
 * 07 · THE ORDINARY — three small things, looked at properly.
 * A focus reticle follows the pointer, and each frame sharpens under it.
 */
export default function TheOrdinary() {
  const rowRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const { ordinary } = homeCopy;
  const photos = getPhotographsBySlugs(SLUGS);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    const focus = focusRef.current;
    if (!row || !focus) return;

    const rect = row.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    focus.style.setProperty("--fx", `${x - 42}px`);
    focus.style.setProperty("--fy", `${y - 42}px`);
    focus.setAttribute("data-on", "true");
  };

  const onLeave = () => {
    focusRef.current?.setAttribute("data-on", "false");
  };

  return (
    <section
      id="the-ordinary"
      className="scene scene-ordinary tone-paper"
      aria-labelledby="ordinary-title"
    >
      <span className="ghost-num" aria-hidden="true">
        07
      </span>

      <div className="wrap scene-head">
        <div className="scene-head__meta">
          <span className="eyebrow" lang="en">
            07 / {ordinary.eyebrow}
          </span>
          <span className="caption" lang="en">
            THREE PLATES · NEW YORK, 1950s
          </span>
        </div>

        <div className="scene-head__title">
          <h2 id="ordinary-title" className="title display">
            THE ORDINARY
            <br />
            <em>POETRY</em>
          </h2>
        </div>

        <div className="scene-head__aside">
          <p className="lede">{ordinary.standfirst}</p>
        </div>
      </div>

      <div
        ref={rowRef}
        className="wrap ordinary__row"
        data-reveal-group
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerCancel={onLeave}
      >
        {photos.map((photo, index) => (
          <figure className={`ordinary__item ordinary__item--${index + 1}`} key={photo.slug}>
            <Plate
              photo={photo}
              lightbox
              hoverLabel="VIEW"
              position={POSITIONS[index]}
              sizes="(max-width: 1023px) 45vw, 30vw"
              className="ordinary__plate"
            />
            <div className="ordinary__item__label">
              <b>{photo.title}</b>
              <span>
                0{index + 1} · {photo.year ?? "N.D."}
              </span>
            </div>
          </figure>
        ))}

        <div ref={focusRef} className="ordinary__focus" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <span lang="en">FOCUS / 07</span>
        </div>
      </div>

      <div className="wrap">
        <p className="ordinary__manifesto" data-reveal>
          “{ordinary.manifesto}”
        </p>
      </div>

      <div className="wrap ordinary__notes">
        {ordinaryNotes.map((note) => (
          <div className="ordinary__note" key={note.number}>
            <span className="ordinary__num">{note.number}</span>
            <h3 className="ordinary__note-title" lang="en">
              {note.title}
            </h3>
            <p className="ordinary__note-text">{note.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
