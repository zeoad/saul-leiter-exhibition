import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { homeChapters, site } from "@/data/exhibition";

export default function Cover() {
  return (
    <section
      id="cover"
      className="cover theme-ink"
      data-hero
      aria-labelledby="cover-title"
    >
      <div className="cover__media" data-cover-parallax>
        <Image
          src="/images/hero/cover-main.webp"
          alt="《Taxi》（出租车），1957，索尔·雷特：黄色车顶、红色车身与司机手臂的近距离裁切。"
          fill
          priority
          sizes="100vw"
          className="cover__image"
        />
      </div>
      <div className="cover__scrim" aria-hidden="true" />

      <div className="container cover__inner">
        <div className="cover__top">
          <span className="meta">{site.edition}</span>
          <span className="meta">01 / 11 — EXHIBITION COVER</span>
          <span className="meta">{site.years} · {site.city}</span>
        </div>

        <div className="cover__center">
          <div className="cover__title-wrap" data-cover-title>
            <p className="cover__kicker">A PHOTOGRAPHIC EXHIBITION</p>

            <h1 id="cover-title" className="cover__title" lang="en">
              <span className="cover__title-mask">
                <span className="cover__title-line">SAUL</span>
              </span>
              <span className="cover__title-mask">
                <span className="cover__title-line cover__title-line--italic">
                  Leiter
                </span>
              </span>
            </h1>

            <p className="cover__subtitle" lang="en">
              A QUIET GAZE
            </p>
            <p className="cover__cn">静默的凝视：在日常中发现诗意</p>
          </div>

          <figure className="cover__inset">
            <Image
              src="/images/hero/cover-inset.webp"
              alt="《Red Curtain》（红色窗帘），1956，索尔·雷特：红色窗帘作为前景，窗外有一个渺小的行人。"
              width={720}
              height={960}
              sizes="(max-width: 1023px) 0px, 16vw"
              className="cover__inset-img"
            />
            <figcaption className="meta">
              RED CURTAIN, 1956 — © ESTATE OF SAUL LEITER
            </figcaption>
          </figure>
        </div>

        <div className="cover__bottom">
          <div className="cover__intro-wrap">
            <p className="cover__intro">
              一个关于颜色、遮挡、雨水与日常瞬间的展览。
              透过索尔·雷特的镜头，重新观看那些被忽略的生活片段。
            </p>
            <p className="cover__credit">
              COVER IMAGE — <em>TAXI</em>, 1957 · © ESTATE OF SAUL LEITER
            </p>
          </div>

          <div className="cover__actions">
            <Link href="/work/" className="btn btn--ghost-light">
              进入作品
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
            </Link>

            <a className="cover__scroll" href="#statement">
              <span aria-hidden="true">
                <ArrowDown strokeWidth={1.25} />
              </span>
              向下浏览
            </a>
          </div>

          <div className="cover__stats">
            <span className="meta">11 SECTIONS</span>
            <span className="meta">16 PLATES</span>
            <span className="meta">4 CHAPTERS</span>
            <span className="meta">
              {homeChapters[homeChapters.length - 1].number} — CLOSING
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
