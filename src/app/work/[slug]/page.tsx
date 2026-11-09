import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Plate from "@/components/ui/Plate";
import {
  displayYear,
  getAdjacentPhotographs,
  getAllPhotographs,
  getPhotographBySlug,
  getUsageLabel,
} from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPhotographs().map((photo) => ({ slug: photo.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const photo = getPhotographBySlug(slug);

  if (!photo) {
    return createPageMetadata({
      title: "Plate not found",
      description: "这件作品不在当前展览目录中。",
      path: `/work/${slug}/`,
    });
  }

  return createPageMetadata({
    title: `${photo.title} — ${photo.plate}`,
    description: `${photo.description}（${photo.category.join("、")}）`,
    path: `/work/${slug}/`,
    type: "article",
  });
}

/**
 * /work/[slug] — one print, alone on a dark wall.
 * Everything else recedes: a single plate, its registration marks, and the
 * two neighbouring plates waiting at the bottom of the room.
 */
export default async function PhotographPage({ params }: PageProps) {
  const { slug } = await params;
  const photo = getPhotographBySlug(slug);

  if (!photo) notFound();

  const { previous, next } = getAdjacentPhotographs(photo.slug);
  const total = getAllPhotographs().length;
  const index = getAllPhotographs().findIndex((item) => item.slug === slug);

  return (
    <article className="work-detail">
      <div className="wrap work-detail__head">
        <div className="work-detail__plate">
          <Link href="/work/" className="eyebrow" lang="en">
            THE WORK / PLATE {photo.plate.replace("PL. ", "")}
          </Link>

          <h1 className="display" lang="en">
            {photo.title}
            {photo.titleCn ? <em>{photo.titleCn}</em> : null}
          </h1>
        </div>

        <dl className="work-detail__meta">
          <div className="work-detail__meta-row">
            <dt>PLATE</dt>
            <dd>
              <b>{photo.plate}</b>
            </dd>
          </div>
          <div className="work-detail__meta-row">
            <dt>YEAR</dt>
            <dd>
              <b>{displayYear(photo)}</b>
            </dd>
          </div>
          <div className="work-detail__meta-row">
            <dt>CATEGORY</dt>
            <dd>
              <b>{photo.category.join(" / ")}</b>
            </dd>
          </div>
          <div className="work-detail__meta-row">
            <dt>MEDIUM</dt>
            <dd>
              <b>Photograph</b>
            </dd>
          </div>
          <div className="work-detail__meta-row">
            <dt>RIGHTS</dt>
            <dd>
              <b>{getUsageLabel(photo.usage)}</b>
            </dd>
          </div>
        </dl>
      </div>

      <div className="work-detail__stage">
        <Plate
          photo={photo}
          lightbox
          sizes="100vw"
          position="50% 50%"
        />
        <span className="work-detail__counter" lang="en">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="wrap work-detail__body">
        <div className="work-detail__essay" data-reveal-group>
          <p>{photo.description}</p>
          <p>{photo.curatorNote}</p>
          {photo.yearNote ? <p className="caption">{photo.yearNote}</p> : null}
        </div>

        <aside className="work-detail__aside">
          <span className="work-detail__aside-label" lang="en">
            SOURCE &amp; RIGHTS
          </span>

          <p>{photo.credit ?? "© Estate of Saul Leiter. Image source: Saul Leiter Foundation."}</p>
          <p>{photo.rights ?? "Non-commercial editorial study. Not licensed for reuse."}</p>

          {photo.sourceUrl ? (
            <p>
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="linkline"
              >
                SOURCE · {photo.source ?? "SAUL LEITER FOUNDATION"}
              </a>
            </p>
          ) : null}

          <p className="mono" lang="en">
            {photo.id} / EDITORIAL STUDY
          </p>

          <p>
            本站以非商业的编辑性研究方式呈现此作品，未获遗产管理方或 Saul
            Leiter Foundation 的授权；任何公开或商业使用前须取得许可。
          </p>
        </aside>
      </div>

      <nav className="work-detail__nav" aria-label="上一件与下一件作品">
        <Link
          href={`/work/${previous.slug}/`}
          className="work-detail__nav-link"
          data-cursor="view"
          data-cursor-label="PREVIOUS"
        >
          <Image
            src={previous.image.src}
            alt=""
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
          <span className="work-detail__nav-label" lang="en">
            <ArrowLeft aria-hidden="true" size={12} strokeWidth={1.5} /> PREVIOUS
          </span>
          <span className="work-detail__nav-title" lang="en">
            {previous.title}
          </span>
        </Link>

        <Link
          href={`/work/${next.slug}/`}
          className="work-detail__nav-link"
          data-cursor="view"
          data-cursor-label="NEXT"
        >
          <Image
            src={next.image.src}
            alt=""
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
          <span className="work-detail__nav-label" lang="en">
            NEXT <ArrowRight aria-hidden="true" size={12} strokeWidth={1.5} />
          </span>
          <span className="work-detail__nav-title" lang="en">
            {next.title}
          </span>
        </Link>
      </nav>
    </article>
  );
}
