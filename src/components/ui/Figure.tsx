import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LightboxConfig = {
  /** Caption shown in the PhotoSwipe overlay. Plain text. */
  caption: string;
};

export type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS aspect-ratio value. Defaults to the intrinsic image ratio. */
  ratio?: string;
  title?: string;
  meta?: string;
  index?: string;
  note?: ReactNode;
  priority?: boolean;
  /** Adds the paper/ink veil used by the scroll reveal. */
  reveal?: boolean;
  sizes?: string;
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
  objectPosition?: string;
  captionPosition?: "below" | "overlay" | "none";
  /** Opens the image in the site-wide PhotoSwipe lightbox. */
  lightbox?: LightboxConfig;
  /** Navigates to a detail page instead of the lightbox. */
  href?: string;
  badge?: string;
  plain?: boolean;
  children?: ReactNode;
};

export default function Figure({
  src,
  alt,
  width,
  height,
  ratio,
  title,
  meta,
  index,
  note,
  priority = false,
  reveal = true,
  sizes = "(max-width: 767px) 100vw, (max-width: 1180px) 70vw, 46vw",
  className,
  frameClassName,
  imageClassName,
  objectPosition,
  captionPosition = "below",
  lightbox,
  href,
  badge,
  plain = false,
  children,
}: FigureProps) {
  const interactive = Boolean(lightbox || href);

  const media = (
    <span className="figure__media">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={imageClassName}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </span>
  );

  const linkNode = lightbox ? (
    <a
      className="figure__link"
      href={src}
      data-pswp-lightbox
      data-pswp-width={width}
      data-pswp-height={height}
      data-pswp-caption={lightbox.caption}
      aria-label={`打开大图 — ${title ?? alt}`}
    >
      {media}
    </a>
  ) : href ? (
    <Link
      className="figure__link"
      href={href}
      aria-label={`查看作品 — ${title ?? alt}`}
    >
      {media}
    </Link>
  ) : (
    media
  );

  const caption =
    captionPosition !== "none" ? (
      <figcaption className="figure__caption">
        <span className="figure__caption-main">
          {title ? <span className="figure__title">{title}</span> : null}
          {meta ? <span className="figure__meta">{meta}</span> : null}
        </span>
        {index ? <span className="figure__index">{index}</span> : null}
      </figcaption>
    ) : null;

  return (
    <figure
      className={[
        "figure",
        interactive ? "figure--interactive" : "",
        captionPosition === "overlay" ? "figure--caption-overlay" : "",
        plain ? "figure--plain" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-reveal={reveal ? "figure" : undefined}
    >
      <span
        className={["figure__frame", frameClassName ?? ""]
          .filter(Boolean)
          .join(" ")}
        style={{ aspectRatio: ratio ?? `${width} / ${height}` }}
      >
        {linkNode}

        {reveal ? (
          <span className="figure__veil" aria-hidden="true" />
        ) : null}

        {badge ? <span className="figure__badge">{badge}</span> : null}

        {interactive ? (
          <span className="figure__hover" aria-hidden="true">
            <span className="figure__hover-label">
              {lightbox ? "VIEW PLATE" : "ENTER PLATE"}
            </span>
            <span className="figure__hover-label">↗</span>
          </span>
        ) : null}

        {captionPosition === "overlay" ? caption : null}
        {children}
      </span>

      {captionPosition === "below" ? caption : null}
      {note ? <span className="figure__note">{note}</span> : null}
    </figure>
  );
}
