import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/ui/PageHero";
import Plate from "@/components/ui/Plate";
import { chapters } from "@/data/chapters";
import {
  categoryToSlug,
  displayYear,
  getPhotographBySlug,
} from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";
import type { Category } from "@/types";

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

const chapterTone: Record<string, string> = {
  ink: "tone-dark",
  paper: "tone-paper",
  "paper-dark": "tone-paper-deep",
  teal: "tone-teal",
};

export default function VisionPage() {
  return (
    <>
      <PageHero
        kicker="THE VISION / 02"
        topRight="FOUR CHAPTERS · SIXTEEN PLATES"
        bg="/images/photographs/plate-04.webp"
        bgAlt="《Mirrors》，索尔·雷特：街边多面镜子映出行人、建筑与橱窗。"
        position="50% 46%"
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
            <span>04 CHAPTERS</span>
            <span>COLOR / GLASS / WEATHER / LIFE</span>
            <span>READ SLOWLY</span>
          </>
        }
      />

      <nav className="vision-index" aria-label="章节导航" lang="en">
        {chapters.map((chapter) => (
          <a href={`#${chapter.id}`} key={chapter.id}>
            <i>{chapter.number}</i>
            {chapter.kicker}
          </a>
        ))}
      </nav>

      {chapters.map((chapter, index) => {
        const heroPhoto = getPhotographBySlug(chapter.heroWork);
        const lines = chapter.title.split("\n");
        const category = chapterCategory[chapter.id];

        return (
          <section
            key={chapter.id}
            id={chapter.id}
            className={`vision-chapter ${chapterTone[chapter.theme] ?? "tone-paper"}${
              index % 2 === 1 ? " vision-chapter--flip" : ""
            }`}
            aria-labelledby={`${chapter.id}-title`}
          >
            <div className="wrap vision-chapter__grid">
              <span className="vision-chapter__number" aria-hidden="true">
                {chapter.number}
              </span>

              <div className="vision-chapter__main">
                <span className="eyebrow" lang="en">
                  CHAPTER {chapter.number} / {chapter.kicker}
                </span>

                <h2 id={`${chapter.id}-title`} className="display" lang="en">
                  {lines.map((line, lineIndex) =>
                    lineIndex === lines.length - 1 ? (
                      <em key={line}>{line}</em>
                    ) : (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    )
                  )}
                </h2>

                <p className="vision-chapter__cn">{chapter.titleCn}</p>

                <p className="vision-chapter__standfirst">
                  {chapter.standfirst}
                </p>

                <div className="vision-chapter__body" data-reveal-group>
                  {chapter.intro.map((paragraph, paragraphIndex) => (
                    <p key={paragraph.slice(0, 14)}>
                      {paragraphIndex === 0 ? (
                        <span className="vision-chapter__dropcap" aria-hidden="true">
                          {paragraph.charAt(0)}
                        </span>
                      ) : null}
                      {paragraphIndex === 0 ? paragraph.slice(1) : paragraph}
                    </p>
                  ))}
                </div>

                <blockquote className="vision-chapter__quote">
                  <p>{chapter.quote}</p>
                  <cite lang="en">{chapter.quoteNote}</cite>
                </blockquote>
              </div>

              {heroPhoto ? (
                <figure className="vision-chapter__figure">
                  <Plate
                    photo={heroPhoto}
                    lightbox
                    ratio="3 / 4"
                    index={`PL. ${heroPhoto.plate.replace("PL. ", "")}`}
                    hoverLabel="VIEW KEY VISUAL"
                    sizes="(max-width: 1023px) 70vw, 30vw"
                  />
                  <figcaption lang="en">
                    {heroPhoto.title} · {displayYear(heroPhoto)} ·{" "}
                    {heroPhoto.plate}
                  </figcaption>
                </figure>
              ) : null}

              <div className="vision-chapter__notes" data-reveal-group>
                {chapter.analysis.map((item) => (
                  <div className="vision-chapter__note" key={item.label}>
                    <span lang="en">{item.label}</span>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="wrap vision-chapter__foot">
              <p className="vision-chapter__detail">{chapter.detailNote}</p>
              <Link
                className="linkline"
                href={`/work/?category=${categoryToSlug(category)}`}
              >
                在作品集中继续观看
              </Link>
            </div>
          </section>
        );
      })}

      <section className="page-outro tone-dark">
        <div className="wrap page-outro__inner">
          <span className="eyebrow" lang="en">
            THE LAST WORD
          </span>
          <h2 className="display" lang="en">
            BEAUTY IS
            <br />
            <em>EVERYWHERE.</em>
          </h2>
          <p>
            需要的不是更好的相机，而是更慢的眼睛。当你看完这四个章节，再回到街上，
            也许会发现那些原本不存在的东西，一直都在那里。
          </p>
          <div className="page-outro__actions">
            <Link href="/life/" className="btn">
              继续了解他的生平
            </Link>
            <Link href="/work/" className="btn">
              回到作品集
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
