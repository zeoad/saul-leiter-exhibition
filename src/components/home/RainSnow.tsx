import Image from "next/image";

import Figure from "@/components/ui/Figure";
import PlateFigure from "@/components/ui/PlateFigure";
import ArrowLink from "@/components/ui/ArrowLink";
import { chapters } from "@/data/chapters";
import { homeCopy } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";

export default function RainSnow() {
  const copy = homeCopy.weather;
  const chapter = chapters.find((item) => item.id === "rain-and-snow");
  const snow = getPhotographBySlug("snow");

  return (
    <section
      id="rain-and-snow"
      className="weather theme-teal"
      aria-labelledby="weather-title"
    >
      <div className="weather__banner">
        <Image
          src="/images/photographs/plate-11.webp"
          alt="《Rain》（雨），1950 年代，索尔·雷特：雨中的湿街道与撑伞行人的黑色剪影。"
          fill
          sizes="100vw"
          className="weather__banner-image"
        />
        <span className="weather__banner-scrim" aria-hidden="true" />

        <div className="container weather__banner-inner">
          <span className="eyebrow">SECTION 06 / RAIN &amp; SNOW</span>
          <h2 id="weather-title" className="display display--lg" lang="en">
            RAIN, SNOW
            <br />
            <em>&amp; SILENCE</em>
          </h2>
          <p className="weather__cn">{copy.standfirst}</p>
          <p className="weather__banner-credit">
            RAIN, 1950s · © ESTATE OF SAUL LEITER
          </p>
        </div>
      </div>

      <div className="container weather__body">
        <div className="weather__text" data-reveal="group">
          <p className="prose dropcap">{copy.paragraphs[0]}</p>
          <p className="prose">{copy.paragraphs[1]}</p>
          <p className="prose">{copy.paragraphs[2]}</p>

          <blockquote className="weather__quote">
            <p className="cn">{copy.quote}</p>
          </blockquote>

          <ArrowLink href="/vision/#rain-and-snow">阅读天气专题</ArrowLink>
        </div>

        {snow ? (
          <PlateFigure
            photo={snow}
            className="weather__figure weather__figure--tall"
            sizes="(max-width: 1023px) 80vw, 24vw"
          />
        ) : null}

        <Figure
          className="weather__figure weather__figure--detail"
          src="/images/details/detail-04.webp"
          alt="《San Carlo Restaurant》细节：雪中的店面、雨伞与橱窗。"
          width={900}
          height={900}
          ratio="1 / 1"
          title="San Carlo, Detail"
          meta="DETAIL — SAN CARLO, 1952"
          reveal={false}
          sizes="(max-width: 1023px) 66vw, 20vw"
        />
      </div>

      {chapter ? (
        <div className="container weather__notes">
          {chapter.analysis.map((item) => (
            <div className="weather__note" key={item.label}>
              <span className="meta meta--accent">{item.label}</span>
              <p className="weather__note-text">{item.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
