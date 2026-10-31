import Link from "next/link";
import type { ReactNode } from "react";

import Figure, { type FigureProps } from "@/components/ui/Figure";
import {
  displayYear,
  getDisplayRatio,
  getLightboxCaption,
} from "@/lib/gallery";
import type { Photograph } from "@/types";

type PlateFigureProps = Omit<
  FigureProps,
  "src" | "alt" | "width" | "height" | "title" | "meta" | "index" | "lightbox"
> & {
  photo: Photograph;
  /** Show a link to the individual plate record under the image. */
  detailLink?: boolean;
  /** Hide the PhotoSwipe link (used for non-interactive detail crops). */
  interactive?: boolean;
  note?: ReactNode;
  children?: ReactNode;
};

/**
 * A photograph rendered with its catalogue metadata, caption and rights text.
 * Keeping this in one place prevents titles, years and credits drifting apart
 * between the home page, gallery and archive.
 */
export default function PlateFigure({
  photo,
  ratio,
  detailLink = false,
  interactive = true,
  note,
  children,
  ...rest
}: PlateFigureProps) {
  return (
    <Figure
      src={photo.image.src}
      alt={photo.image.alt}
      width={photo.image.width}
      height={photo.image.height}
      ratio={ratio ?? getDisplayRatio(photo)}
      title={photo.title}
      meta={`${photo.category.join(" · ")} · ${displayYear(photo)}`}
      index={photo.plate}
      lightbox={
        interactive ? { caption: getLightboxCaption(photo) } : undefined
      }
      note={
        note ??
        (detailLink ? (
          <Link className="figure__detail-link" href={`/work/${photo.slug}/`}>
            作品档案 — {photo.plate} ↗
          </Link>
        ) : undefined)
      }
      {...rest}
    >
      {children}
    </Figure>
  );
}
