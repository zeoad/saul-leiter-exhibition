import type { Metadata } from "next";
import Link from "next/link";

import Figure from "@/components/ui/Figure";
import PageHero from "@/components/ui/PageHero";
import ArrowLink from "@/components/ui/ArrowLink";
import { chapters } from "@/data/chapters";
import {
  categoryToSlug,
  displayYear,
  getLightboxCaption,
  getOrientation,
  getPhotographBySlug,
  getPhotographsBySlugs,
} from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";
import type { Category, VisionChapter } from "@/types";

export const metadata: Metadata = createPageMetadata({
  title: "The Vision — Four Ways of Looking",
  description:
    "深入索尔·雷特的视觉语言：色彩、遮挡、雨雪与日常。四个章节，构图分析与相关作品。",
  path: "/vision/",
});

const chapterCategory: Record<string, Category> = {
  color: "Color",
  obstruction: "Obstruction",
  "rain-and-snow": "Rain & Snow",
  "the-ordinary": "Street Life",
};

function Chapter({
  chapter,
  index,
}: {
  chapter: VisionChapter;
  index: number;
}) {
  const works = getPhotographsBySlugs(chapter.works).filter(
    (work) => work.slug !== chapter.heroWork
  );
  const heroPhoto = getPhotographBySlug(chapter.heroWork);
  const lines = chapter.title.split("\n");
  const heroPortrait = chapter.hero.height > chapter.hero.width;
  const category = chapterCategory[chapter.id];

  return (
    <section
      id={chapter.id}
      className={`vision-chapter vision-chapter--${index + 1} theme-${chapter.theme}`}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className="container">
        <header className="vision-chapter__head">
          <div className="vision-chapter__meta">
            <span className="eyebrow">CHAPTER {chapter.number}</span>
            <span className="meta">{chapter.kicker}</span>
          </div>

          <h2
            id={`${chapter.id}-title`}
            className="display display--lg vision-chapter__title"
            lang="en"
          >
            {lines.map((line, lineIndex) => (
              <span className="vision-chapter__line" key={line}>
                {lineIndex === lines.length - 1 ? <em>{line}</em> : line}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>

          <div className="vision-chapter__head-aside">
            <p className="kicker">{chapter.titleCn}</p>
            <p className="lead">{chapter.standfirst}</p>
          </div>
        </header>

        <div className="vision-chapter__hero">
          <Figure
            className="vision-chapter__hero-figure"
            src={chapter.hero.src}
            alt={chapter.hero.alt}
            width={chapter.hero.width}
            height={chapter.hero.height}
            ratio={heroPortrait ? "3 / 4" : "16 / 9"}
            title={heroPhoto?.title ?? chapter.kicker}
            meta={
              heroPhoto
                ? `${heroPhoto.plate} · ${displayYear(heroPhoto)}`
                : "KEY VISUAL"
            }
            index={`0${index + 1}`}
            sizes="(max-width: 1023px) 100vw, 58vw"
            priority={false}
            lightbox={
              heroPhoto
                ? { caption: getLightboxCaption(heroPhoto) }
                : undefined
            }
          />

          <div className="vision-chapter__intro" data-reveal="group">
            {chapter.intro.map((paragraph, paragraphIndex) => (
              <p
                className={
                  paragraphIndex === 0 ? "prose dropcap" : "prose"
                }
                key={paragraph.slice(0, 14)}
              >
                {paragraph}
              </p>
            ))}

            <blockquote className="vision-chapter__quote">
              <p className="cn">{chapter.quote}</p>
              <cite className="meta">{chapter.quoteNote}</cite>
            </blockquote>
          </div>
        </div>

        <div className="vision-works" aria-label="本章相关作品">
          {works.map((work) => (
            <Figure
              key={work.slug}
              className="vision-works__item"
              src={work.image.src}
              alt={work.image.alt}
              width={work.image.width}
              height={work.image.height}
              ratio={
                getOrientation(work) === "portrait"
                  ? "4 / 5"
                  : getOrientation(work) === "square"
                    ? "1 / 1"
                    : "3 / 2"
              }
              title={work.title}
              meta={`${work.plate} · ${work.category.join(" · ")} · ${displayYear(work)}`}
              index={work.plate.replace("PL. ", "")}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, 32vw"
              note={
                <Link
                  className="vision-works__link"
                  href={`/work/${work.slug}/`}
                >
                  查看作品档案 ↗
                </Link>
              }
              lightbox={{ caption: getLightboxCaption(work) }}
            />
          ))}
        </div>

        <div className="vision-chapter__analysis">
          <div className="vision-analysis__grid">
            {chapter.analysis.map((item) => (
              <div className="vision-analysis" key={item.label}>
                <span className="meta meta--accent">{item.label}</span>
                <p>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="vision-chapter__details" data-reveal="text">
            <span className="eyebrow">VISUAL DETAILS</span>
            <p className="prose">{chapter.detailNote}</p>
            <ArrowLink
              href={`/work/?category=${categoryToSlug(category)}`}
            >
              在作品集中继续观看
            </ArrowLink>
          </div>
        </div>

        <footer className="vision-chapter__foot">
          <span className="meta">{works.length} RELATED PLATES</span>
          <span className="meta">
            CHAPTER {chapter.number} / 0{chapters.length}
          </span>
        </footer>
      </div>
    </section>
  );
}

export default function VisionPage() {
  return (
    <>
      <PageHero
        theme="ink"
        kicker="THE VISUAL LANGUAGE / 02"
        topRight="4 CHAPTERS · 16 PLATES"
        title={
          <>
            A WAY
            <br />
            OF <em>SEEING.</em>
          </>
        }
        lead="雷特的摄影世界不是完整、清晰的世界。他更喜欢从局部开始观看：一块颜色、一片玻璃、一场雨，或一个偶然经过的身影。"
        aside={
          <>
            <span className="page-hero__count">04</span>
            <span className="meta">CHAPTERS</span>
            <span className="meta">COLOR / GLASS / WEATHER / LIFE</span>
          </>
        }
      />

      <section className="section vision-intro theme-paper">
        <div className="container">
          <div className="vision-intro__grid">
            <div className="vision-intro__lead">
              <span className="eyebrow">CURATORIAL INTRODUCTION</span>
              <h2 className="display display--lg" lang="en">
                FOUR WAYS
                <br />
                OF <em>LOOKING.</em>
              </h2>
              <p className="lead">
                如果风格是一种选择，那么观看是一种习惯。
              </p>
              <p className="prose">
                这四个章节并不试图把雷特的摄影拆解成技法。它们只是提供四条进入的路径：
                先跟随颜色，再穿过玻璃，然后走进天气，最后回到最普通的街道。
                每条路径都通向同一件事——把注意力交还给那些原本会被忽略的瞬间。
              </p>
            </div>

            <ol className="vision-index">
              {chapters.map((chapter) => (
                <li className="vision-index__item" key={chapter.id}>
                  <a href={`#${chapter.id}`}>
                    <span className="vision-index__num">{chapter.number}</span>
                    <span className="vision-index__body">
                      <span className="vision-index__title">
                        {chapter.kicker}
                      </span>
                      <span className="vision-index__cn">
                        {chapter.titleCn}
                      </span>
                    </span>
                    <span className="vision-index__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <Chapter key={chapter.id} chapter={chapter} index={index} />
      ))}

      <section className="section vision-ending theme-ink">
        <div className="container vision-ending__inner">
          <span className="eyebrow">THE LAST WORD</span>
          <h2 className="display display--lg" lang="en">
            BEAUTY IS
            <br />
            <em>EVERYWHERE.</em>
          </h2>
          <p className="prose">
            需要的不是更好的相机，而是更慢的眼睛。
            当你看完这四个章节，再回到街上，也许会发现那些原本不存在的东西，
            一直都在那里。
          </p>
          <div className="cluster">
            <ArrowLink href="/life/">继续了解他的生平</ArrowLink>
            <ArrowLink href="/work/">回到作品集</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
