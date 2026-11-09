import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import PageHero from "@/components/ui/PageHero";
import LifeTrack from "@/components/life/LifeTrack";
import {
  lifeFacts,
  publications,
  sources,
} from "@/data/timeline";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "The Life — A Quiet Observer",
  description:
    "索尔·雷特（1923—2013）生平专题：匹兹堡的童年、纽约的绘画岁月、时尚摄影、晚年的重新被发现，以及有据可查的重要年份。",
  path: "/life/",
});

export default function LifePage() {
  return (
    <>
      <PageHero
        kicker="THE LIFE / 03"
        topRight="1923 — 2013 · PITTSBURGH / NEW YORK"
        bg="/images/portraits/leiter-portrait.webp"
        bgAlt="索尔·雷特肖像，约 1950 年代。"
        position="50% 24%"
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
            <span>89 YEARS / ONE CITY</span>
            <span>PAINTER · PHOTOGRAPHER</span>
            <span>1923 · PITTSBURGH</span>
            <span>2013 · NEW YORK</span>
          </>
        }
      />

      <LifeTrack />

      <section className="life-essay tone-paper">
        <div className="wrap life-essay__grid">
          <div className="life-essay__portrait">
            <div className="plate__frame" style={{ aspectRatio: "4 / 5" }}>
              <Image
                src="/images/portraits/leiter-portrait.webp"
                alt="索尔·雷特肖像，约 1950 年代：他戴着眼镜，在窗边低头，胸前挂着一台相机。"
                fill
                sizes="(max-width: 1023px) 72vw, 36vw"
                className="plate__img"
                style={{ objectPosition: "50% 28%" }}
              />
              <span className="plate__grain" aria-hidden="true" />
              <span className="plate__marks" aria-hidden="true" />
            </div>
            <p className="caption">
              索尔·雷特，约 1950 年代。图片版权归 Estate of Saul Leiter
              所有。基金会目录未注明拍摄者。
            </p>
          </div>

          <div className="life-essay__copy" data-reveal-group>
            <span className="eyebrow" lang="en">
              THE PHOTOGRAPHER
            </span>

            <h2 className="display" lang="en">
              THE QUIET
              <br />
              <em>OBSERVER.</em>
            </h2>

            <p className="lede">
              索尔·雷特（Saul Leiter，1923—2013）是美国摄影师与画家。他最
              为人熟知的作品，是 1940—50 年代在纽约拍摄的彩色街头照片。
            </p>

            <p>
              他出生在匹兹堡一个犹太教正统家庭，父亲是塔木德学者。少年时期
              开始画画，并决定以此为生。1946 年，他搬到纽约，原本的目标是
              成为一名画家——摄影是后来才出现的。
            </p>
            <p>
              在纽约，他结识了画家理查德·波塞特-达特（Richard
              Pousette-Dart），并因此开始拍照。他很快转向彩色胶片，而当时
              严肃摄影几乎默认是黑白的。这些照片在很长一段时间里没有公开，
              只是安静地留在他的公寓中。
            </p>
            <p>
              为了谋生，他进入商业摄影领域，为 Harper&apos;s Bazaar、Elle、
              Esquire 等刊物拍摄时尚照片。商业工作稳定，却从未取代他自己的
              绘画与街头创作。2006 年《Early Color》出版后，他的彩色作品才
              真正进入国际视野。
            </p>

            <dl className="life-facts">
              {lifeFacts.map((fact) => (
                <div key={fact.label}>
                  <dt lang="en">{fact.label}</dt>
                  <dd lang="en">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="life-notes tone-dark" aria-labelledby="publications-title">
        <div className="wrap">
          <header className="life-notes__head">
            <div>
              <span className="eyebrow" lang="en">
                PUBLICATIONS &amp; FILM
              </span>
              <h2 id="publications-title" className="display" lang="en">
                MADE
                <br />
                <em>PUBLIC.</em>
              </h2>
            </div>
            <p>
              他的作品在晚年被重新编辑、出版，并因此进入新一代观众的视野。
              以下三份出版物与影像资料，是理解这段「重新被发现」的关键入口。
            </p>
          </header>

          <div className="life-publications">
            {publications.map((publication, index) => (
              <article className="publication" key={publication.title}>
                <span className="publication__index" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3 className="publication__title" lang="en">
                  {publication.title}
                </h3>
                <div>
                  <p className="publication__meta" lang="en">
                    {publication.meta}
                  </p>
                  <p className="publication__note">{publication.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="life-sources tone-paper">
        <div className="wrap life-sources__grid">
          <div>
            <span className="eyebrow" lang="en">
              SOURCES &amp; INTEGRITY
            </span>
            <h2 className="display" lang="en">
              CHECKED,
              <br />
              <em>NOT INVENTED.</em>
            </h2>
            <p>
              本站为独立的编辑性学习项目，不是索尔·雷特基金会或任何版权方的
              官方发布。年表依据公开传记资料与下列机构信息整理；引用前请以
              原始来源核对。
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
                  <span className="life-sources__label" lang="en">
                    {source.label}
                  </span>
                  <span className="life-sources__note">{source.note}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-outro tone-dark">
        <div className="wrap page-outro__inner">
          <span className="eyebrow" lang="en">
            A LASTING VISION
          </span>
          <h2 className="display" lang="en">
            A QUIET LIFE.
            <br />
            <em>AN ENDURING VISION.</em>
          </h2>
          <p>
            安静地观看，也是一种表达世界的方式。他没有留下宣言，只留下了很多
            照片——以及一个可以被任何人继承的习惯：在离开之前，多看一眼。
          </p>
          <div className="page-outro__actions">
            <Link href="/work/" className="btn">
              回到作品集
            </Link>
            <Link href="/archive/" className="btn">
              打开数字档案
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
