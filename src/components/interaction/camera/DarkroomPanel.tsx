"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import type { Photograph } from "@/types";
import { COPY } from "./copy";

/**
 * The hidden darkroom: a single print pulled out of the archive. Rendered
 * only on demand, so the overlay costs nothing until someone finds it.
 */
export default function DarkroomPanel({
  photo,
  onClose,
}: {
  photo: Photograph;
  onClose: () => void;
}) {
  return (
    <div className="darkroom" role="dialog" aria-modal="true" aria-label="隐藏暗房">
      <div className="darkroom__inner">
        <header className="darkroom__head">
          <span className="darkroom__eyebrow" lang="en">
            THE HIDDEN DARKROOM
          </span>
          <button
            type="button"
            className="darkroom__close"
            onClick={onClose}
            aria-label="关闭隐藏暗房"
            autoFocus
          >
            <X aria-hidden="true" strokeWidth={1.5} />
          </button>
        </header>

        <figure className="darkroom__figure">
          <span className="darkroom__media">
            <Image
              src={photo.image.src}
              alt={photo.image.alt}
              fill
              sizes="(max-width: 767px) 92vw, 46vw"
              className="darkroom__img"
            />
          </span>
          <figcaption className="darkroom__caption">
            <span lang="en">
              {photo.plate} — {photo.title.toUpperCase()}
            </span>
            <span lang="en">{photo.year ?? "UNDATED"}</span>
          </figcaption>
        </figure>

        <div className="darkroom__foot">
          <p>{COPY.darkroomBody}</p>
          <Link href={`/work/${photo.slug}/`} className="darkroom__link" lang="en">
            {COPY.darkroomLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
