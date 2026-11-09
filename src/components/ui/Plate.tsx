import Image from "next/image";
import Link from "next/link";

import { getLightboxCaption } from "@/lib/gallery";
import type { Photograph } from "@/types";

type PlateProps = {
  photo: Photograph;
  className?: string;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5". */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  /** Plate number shown inside the frame. */
  index?: string;
  /** A label shown under the pointer ("VIEW PLATE"). */
  hoverLabel?: string;
  /** Opens the image in the site-wide lightbox. */
  lightbox?: boolean;
  /** Links to a page instead of the lightbox. */
  href?: string;
  caption?: boolean;
  /** Explicit object-position override. */
  position?: string;
  cursorLabel?: string;
};

/**
 * PLATE — one print, with its registration marks.
 * Shared by every scene so the physical grammar of the exhibition is kept.
 */
export default function Plate({
  photo,
  className = "",
  ratio,
  sizes = "(max-width: 767px) 92vw, (max-width: 1023px) 60vw, 45vw",
  priority = false,
  index,
  hoverLabel,
  lightbox = false,
  href,
  caption = false,
  position,
  cursorLabel,
}: PlateProps) {
  const interactive = lightbox || Boolean(href);

  const inner = (
    <div
      className="plate__frame"
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <Image
        src={photo.image.src}
        alt={photo.image.alt}
        fill
        className="plate__img"
        sizes={sizes}
        priority={priority}
        style={position ? { objectPosition: position } : undefined}
      />
      <span className="plate__grain" aria-hidden="true" />
      <span className="plate__marks" aria-hidden="true" />
      {index ? <span className="plate__no">{index}</span> : null}
      {hoverLabel ? (
        <span className="plate__hover" aria-hidden="true">
          <span>{hoverLabel}</span>
        </span>
      ) : null}
    </div>
  );

  const body = lightbox ? (
    <a
      href={photo.image.src}
      data-pswp-lightbox
      data-pswp-width={photo.image.width}
      data-pswp-height={photo.image.height}
      data-pswp-caption={getLightboxCaption(photo)}
      data-cursor="view"
      data-cursor-label="VIEW"
      aria-label={`查看作品：${photo.title}`}
      className="plate__link"
    >
      {inner}
    </a>
  ) : href ? (
    <Link
      href={href}
      className="plate__link"
      data-cursor="view"
      data-cursor-label={cursorLabel ?? "OPEN"}
      aria-label={`进入作品：${photo.title}`}
    >
      {inner}
    </Link>
  ) : (
    inner
  );

  return (
    <figure
      className={`plate${interactive ? " is-link" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      {body}
      {caption ? (
        <figcaption className="plate__caption">
          <strong>{photo.title}</strong>
          <span>{photo.year ?? photo.plate}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
