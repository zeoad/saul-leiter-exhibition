import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import Figure from "@/components/ui/Figure";
import ArrowLink from "@/components/ui/ArrowLink";
import {
  displayYear,
  getAdjacentPhotographs,
  getAllPhotographs,
  getLightboxCaption,
  getOrientation,
  getPhotographBySlug,
  getRelatedPhotographs,
  getUsageLabel,
} from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";
import type { Photograph } from "@/types";

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

function SourceRow({
  label,
  value,
  href,
}: {
  label: string;
  value?: string;
  href?: string;
}) {
  if (!value) return null;

  return (
    <div className="plate-source__row">
      <dt className="meta">{label}</dt>
      <dd>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {value} ↗
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default async function PhotographPage({ params }: PageProps) {
  const { slug } = await params;
  const photo = getPhotographBySlug(slug);

  if (!photo) notFound();

  const { previous, next } = getAdjacentPhotographs(photo.slug);
  const related = getRelatedPhotographs(photo, 3);
  const orientation = getOrientation(photo);

  return (
    <>
      <article className="plate-detail">
        <section className="plate-hero theme-paper">
          <div className="container">
            <nav className="plate-crumbs" aria-label="面包屑">
              <Link href="/work/">THE WORK</Link>
              <span aria-hidden="true">/</span>
              <span>{photo.plate}</span>
              <span aria-hidden="true">/</span>
              <span>{photo.id}</span>
            </nav>

            <div className="plate-hero__grid">
              <div className="plate-hero__title-wrap">
                <span className="eyebrow">{photo.category.join(" / ")}</span>
                <h1 className="display display--lg">{photo.title}</h1>
                {photo.titleCn ? (
                  <p className="plate-hero__cn">{photo.titleCn}</p>
                ) : null}
              </div>

              <dl className="plate-hero__meta">
                <div>
                  <dt className="meta">PLATE</dt>
                  <dd>{photo.plate}</dd>
                </div>
                <div>
                  <dt className="meta">YEAR</dt>
                  <dd>{displayYear(photo)}</dd>
                </div>
                <div>
                  <dt className="meta">CATEGORY</dt>
                  <dd>{photo.category.join(", ")}</dd>
                </div>
                <div>
                  <dt className="meta">MEDIUM</dt>
                  <dd>Photograph</dd>
                </div>
                <div>
                  <dt className="meta">RIGHTS</dt>
                  <dd>{getUsageLabel(photo.usage)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="plate-image-section theme-paper">
          <div className="container">
            <div
              className={`plate-image__frame ${
                orientation === "portrait"
                  ? "plate-image__frame--portrait"
                  : orientation === "square"
                    ? "plate-image__frame--square"
                    : "plate-image__frame--landscape"
              }`}
            >
              <Figure
                src={photo.image.src}
                alt={photo.image.alt}
                width={photo.image.width}
                height={photo.image.height}
                ratio={
                  orientation === "portrait"
                    ? "4 / 5"
                    : orientation === "square"
                      ? "1 / 1"
                      : "3 / 2"
                }
                title={photo.title}
                meta={`${photo.plate} · ${displayYear(photo)}`}
                index="© ESTATE OF SAUL LEITER"
                captionPosition="below"
                sizes="(max-width: 767px) 100vw, 86vw"
                lightbox={{ caption: getLightboxCaption(photo) }}
              />
            </div>
          </div>
        </section>

        <section className="section plate-body theme-paper">
          <div className="container">
            <div className="plate-body__grid">
              <div className="plate-body__text">
                <p className="eyebrow">ABOUT THIS PLATE</p>
                <p className="lead">{photo.description}</p>
                <p className="prose">{photo.curatorNote}</p>

                {photo.yearNote ? (
                  <p className="plate-body__dateline meta">{photo.yearNote}</p>
                ) : null}
              </div>

              <aside className="plate-source" aria-label="素材与权利信息">
                <p className="meta">SOURCE &amp; RIGHTS</p>
                <dl>
                  <SourceRow
                    label="SOURCE"
                    value={photo.source}
                    href={photo.sourceUrl}
                  />
                  <SourceRow label="CREDIT" value={photo.credit} />
                  <SourceRow label="RIGHTS" value={photo.rights} />
                  <SourceRow label="ID" value={photo.id} />
                </dl>
                <p className="plate-source__note">
                  这幅作品版权归 Estate of Saul Leiter 所有，本站以非商业的编辑性研究方式呈现，
                  未获遗产管理方或 Saul Leiter Foundation 的授权。任何公开或商业使用前须取得许可。
                </p>
                <ArrowLink href="/archive/#credits">版权与素材说明</ArrowLink>
              </aside>
            </div>
          </div>
        </section>

        <nav className="plate-nav theme-ink" aria-label="上一件与下一件作品">
          <div className="container plate-nav__inner">
            <Link className="plate-nav__item" href={`/work/${previous.slug}/`}>
              <span className="plate-nav__arrow" aria-hidden="true">
                <ArrowLeft strokeWidth={1.25} />
              </span>
              <span className="plate-nav__media">
                <Image
                  src={previous.image.src}
                  alt=""
                  width={previous.image.width}
                  height={previous.image.height}
                  sizes="96px"
                />
              </span>
              <span className="plate-nav__text">
                <span className="meta">PREVIOUS</span>
                <span className="plate-nav__title">{previous.title}</span>
              </span>
            </Link>

            <Link
              className="plate-nav__item plate-nav__item--next"
              href={`/work/${next.slug}/`}
            >
              <span className="plate-nav__text">
                <span className="meta">NEXT</span>
                <span className="plate-nav__title">{next.title}</span>
              </span>
              <span className="plate-nav__media">
                <Image
                  src={next.image.src}
                  alt=""
                  width={next.image.width}
                  height={next.image.height}
                  sizes="96px"
                />
              </span>
              <span className="plate-nav__arrow" aria-hidden="true">
                <ArrowRight strokeWidth={1.25} />
              </span>
            </Link>
          </div>
        </nav>

        <section className="section related theme-paper">
          <div className="container">
            <header className="related__head">
              <div>
                <span className="eyebrow">RELATED PLATES</span>
                <h2 className="display display--md">Continue looking</h2>
              </div>
              <ArrowLink href="/work/">返回作品集</ArrowLink>
            </header>

            <div className="related__grid">
              {related.map((item: Photograph) => (
                <Figure
                  key={item.slug}
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  ratio={
                    getOrientation(item) === "portrait"
                      ? "4 / 5"
                      : getOrientation(item) === "square"
                        ? "1 / 1"
                        : "3 / 2"
                  }
                  title={item.title}
                  meta={item.category.join(" · ")}
                  index={item.plate}
                  href={`/work/${item.slug}/`}
                  sizes="(max-width: 767px) 100vw, 30vw"
                />
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
