import type { Metadata } from "next";

import Figure from "@/components/ui/Figure";
import PageHero from "@/components/ui/PageHero";
import ArrowLink from "@/components/ui/ArrowLink";
import {
  lifeFacts,
  publications,
  sources,
  timeline,
} from "@/data/timeline";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "The Life — A Quiet Observer",
  description:
    "索尔·雷特（1923—2013）生平专题：匹兹堡的童年、纽约的绘画岁月、时尚摄影、晚年的重新被发现，以及有据可查的重要年份。",
  path: "/life/",
});

const kindLabels: Record<string, string> = {
  life: "LIFE",
  work: "WORK",
  publication: "PUBLICATION",
  exhibition: "EXHIBITION",
};

export default function LifePage() {
  return (
    <>
      <PageHero
        theme="ink"
        kicker="THE PHOTOGRAPHER / 03"
        topRight="1923 — 2013 · PITTSBURGH / NEW YORK"
        title={
          <>
            A LIFE
            <br />
            IN <em>FRAGMENTS.</em>
          </>
        }
        lead="他并不是一个被时代忽略的天才，也不是一个刻意隐退的怪人。他只是一个愿意把大部分时间用在观看上的人——而这，恰好需要一生的时间。"
        aside={
          <>
            <span className="page-hero__count">89</span>
            <span className="meta">YEARS / ONE CITY</span>
            <span className="meta">PAINTER · PHOTOGRAPHER</span>
          </>
        }
      />

      <section className="section life-feature theme-paper">
        <div className="container">
          <div className="life-feature__grid">
            <div className="life-feature__media">
              <Figure
                src="/images/portraits/leiter-portrait.webp"
                alt="索尔·雷特肖像，约 1950 年代：他戴着眼镜，在窗边低头，胸前挂着一台相机。"
                width={925}
                height={1080}
                ratio="4 / 5"
                title="Saul Leiter, c. 1950s"
                meta="PORTRAIT · SAUL LEITER FOUNDATION"
                index="FIG. 01"
                sizes="(max-width: 1023px) 90vw, 38vw"
              />
              <p className="life-feature__caption">
                索尔·雷特，约 1950 年代。图片版权归 Estate of Saul Leiter 所有。
                基金会目录未注明拍摄者，本项目不将其认定为自拍。
              </p>
            </div>

            <div className="life-feature__copy">
              <span className="eyebrow">THE PHOTOGRAPHER</span>
              <h2 className="display display--lg" lang="en">
                THE QUIET
                <br />
                <em>OBSERVER.</em>
              </h2>

              <p className="lead">
                索尔·雷特（Saul Leiter，1923—2013）是美国摄影师与画家。
                他最为人熟知的作品，是 1940—50 年代在纽约拍摄的彩色街头照片。
              </p>

              <div className="life-feature__prose">
                <p className="prose">
                  他出生在匹兹堡一个犹太教正统家庭，父亲是塔木德学者。
                  少年时期开始画画，并决定以此为生。1946 年，他搬到纽约，
                  原本的目标是成为一名画家——摄影是后来才出现的。
                </p>
                <p className="prose">
                  在纽约，他结识了画家理查德·波塞特-达特（Richard
                  Pousette-Dart），并因此开始拍照。他很快转向彩色胶片，
                  而当时严肃摄影几乎默认是黑白的。这些照片在很长一段时间里
                  没有公开，只是安静地留在他的公寓中。
                </p>
                <p className="prose">
                  为了谋生，他进入商业摄影领域，为 Harper&apos;s Bazaar、Elle、
                  Esquire 等刊物拍摄时尚照片。商业工作稳定，却从未取代
                  他自己的绘画与街头创作。2006 年《Early Color》出版后，
                  他的彩色作品才真正进入国际视野。
                </p>
              </div>

              <dl className="life-facts">
                {lifeFacts.map((fact) => (
                  <div className="life-facts__item" key={fact.label}>
                    <dt className="meta">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section
        id="timeline"
        className="section life-timeline theme-paper-dark"
        aria-labelledby="timeline-title"
      >
        <div className="container">
          <header className="life-timeline__head">
            <div>
              <span className="eyebrow">A LIFE IN TIME</span>
              <h2 id="timeline-title" className="display display--lg" lang="en">
                THE
                <br />
                <em>YEARS.</em>
              </h2>
            </div>
            <div className="life-timeline__intro">
              <p className="lead">十一个可以被核对的时间点。</p>
              <p className="prose">
                年表只保留有公开来源的事件，并省略了无法核实的奖项与展览细节。
                每一条都可以在页面底部的参考来源中继续追溯。
              </p>
            </div>
          </header>

          <ol className="timeline">
            {timeline.map((event) => (
              <li
                className={`timeline__event ${
                  event.highlight ? "is-highlight" : ""
                }`}
                key={`${event.year}-${event.title}`}
              >
                <div className="timeline__year">
                  <span className="timeline__year-value">{event.year}</span>
                  <span className="timeline__kind meta">
                    {kindLabels[event.kind]}
                  </span>
                </div>

                <div className="timeline__body">
                  <h3 className="timeline__title">
                    {event.titleCn}
                    <span className="timeline__title-en" lang="en">
                      {event.title}
                    </span>
                  </h3>
                  <p className="timeline__text">{event.body}</p>
                  {event.source ? (
                    <a
                      className="timeline__source"
                      href={event.source.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {event.source.label} ↗
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <p className="timeline__note">
            说明：1923 年 12 月 3 日生于匹兹堡，2013 年 11 月 26 日卒于纽约。
            部分年份（如「1947–48」「1950s–60s」）为公开资料中的区间表述，
            本站不作更精确的推断。
          </p>
        </div>
      </section>

      <section className="section life-painting theme-paper">
        <div className="container">
          <div className="life-painting__grid">
            <div className="life-painting__media">
              <Figure
                src="/images/photographs/plate-07.webp"
                alt="《Blue Skirt》（蓝裙），1950 年代，索尔·雷特：暗色画面中一条蓝色裙摆在光里移动。"
                width={1347}
                height={894}
                ratio="4 / 3"
                title="Blue Skirt"
                meta="PHOTOGRAPH · 1950s"
                index="PL. 007"
                sizes="(max-width: 1023px) 100vw, 46vw"
              />

              <Figure
                className="life-painting__second"
                src="/images/details/detail-05.webp"
                alt="《Blue Skirt》细节：蓝色布料与暗部之间的色彩关系。"
                width={1000}
                height={700}
                ratio="4 / 3"
                title="Blue, Detail"
                meta="PHOTOGRAPHIC DETAIL"
                index="DETAIL"
                reveal={false}
                sizes="(max-width: 1023px) 46vw, 20vw"
              />
            </div>

            <div className="life-painting__copy">
              <span className="eyebrow">PAINTING, FIRST</span>
              <h2 className="display display--lg" lang="en">
                THE FIRST
                <br />
                <em>LANGUAGE.</em>
              </h2>

              <p className="prose">
                在成为摄影师之前，雷特想成为画家。他到纽约的初衷是画画，
                相机是后来才出现的。这个顺序很重要：他不是用摄影模仿绘画，
                而是始终用绘画的方式思考画面。
              </p>
              <p className="prose">
                他一生都在画画。工作室里堆着画布、颜料和未完成的作品；
                拍照的间隙，他就回到画架前。两种媒材共享同一种关切：
                颜色的关系、平面的结构、光线如何落在物体上。
              </p>
              <p className="prose">
                所以他的照片常常显得「不像照片」：没有明确的焦点，
                没有完整的主体，边缘被切断，空间被压平。
                这些在摄影里可能被视为问题的特征，在绘画里却是理所当然的选择。
              </p>

              <p className="painter__note meta">
                本节不复制雷特的绘画作品；所示图像均为其摄影作品与细节，
                用于讨论绘画与摄影共享的色彩结构。
              </p>

              <ArrowLink href="/vision/#color">
                阅读色彩专题
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section life-publications theme-ink">
        <div className="container">
          <header className="life-publications__head">
            <div>
              <span className="eyebrow">PUBLICATIONS & FILM</span>
              <h2 className="display display--lg" lang="en">
                MADE
                <br />
                <em>PUBLIC.</em>
              </h2>
            </div>
            <p className="prose">
              他的作品在晚年被重新编辑、出版，并因此进入新一代观众的视野。
              以下三份出版物与影像资料，是理解这段「重新被发现」的关键入口。
            </p>
          </header>

          <div className="publications">
            {publications.map((publication, index) => (
              <article className="publication" key={publication.title}>
                <span className="publication__index">
                  0{index + 1}
                </span>
                <div className="publication__body">
                  <h3 className="publication__title" lang="en">
                    {publication.title}
                  </h3>
                  <p className="publication__meta meta">
                    {publication.meta}
                  </p>
                  <p className="publication__note">{publication.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section life-sources theme-paper">
        <div className="container">
          <div className="life-sources__grid">
            <div>
              <span className="eyebrow">SOURCES &amp; INTEGRITY</span>
              <h2 className="display display--md">Checked,<br />not invented.</h2>
              <p className="prose">
                本站为独立的编辑性学习项目，不是索尔·雷特基金会或任何版权方的
                官方发布。年表依据公开传记资料与下列机构信息整理；
                引用前请以原始来源核对。若发现错误，欢迎指出并修正。
              </p>
            </div>

            <ul className="life-sources__list">
              {sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="life-sources__label">{source.label}</span>
                    <span className="life-sources__note">{source.note}</span>
                    <span aria-hidden="true" className="life-sources__arrow">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section life-ending theme-paper-dark">
        <div className="container life-ending__inner">
          <span className="eyebrow">A LASTING VISION</span>
          <h2 className="display display--lg" lang="en">
            A QUIET LIFE.
            <br />
            <em>AN ENDURING VISION.</em>
          </h2>
          <p className="prose">
            安静地观看，也是一种表达世界的方式。
            他没有留下宣言，只留下了很多照片——以及一个可以被任何人继承的习惯：
            在离开之前，多看一眼。
          </p>
          <div className="cluster">
            <ArrowLink href="/work/">回到作品集</ArrowLink>
            <ArrowLink href="/archive/">打开数字档案</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
