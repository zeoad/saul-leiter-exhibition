import Figure from "@/components/ui/Figure";
import PlateFigure from "@/components/ui/PlateFigure";
import ArrowLink from "@/components/ui/ArrowLink";
import { homeCopy } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";

export default function NewYork() {
  const copy = homeCopy.newYork;
  const wide = getPhotographBySlug("phone-call");
  const tall = getPhotographBySlug("walking");

  if (!wide || !tall) return null;

  return (
    <section
      id="new-york"
      className="section ny theme-paper"
      aria-labelledby="ny-title"
    >
      <div className="container">
        <header className="ny__head">
          <div className="ny__head-left">
            <span className="eyebrow">SECTION 03 / NEW YORK</span>
            <h2 id="ny-title" className="display display--lg" lang="en">
              NEW YORK
              <br />
              <em>THROUGH HIS EYES</em>
            </h2>
          </div>

          <div className="ny__head-right">
            <p className="kicker">透过他的眼睛</p>
            <p className="lead">{copy.standfirst}</p>
          </div>
        </header>

        <div className="ny__layout">
          <div className="ny__wide">
            <PlateFigure
              photo={wide}
              ratio="16 / 9"
              sizes="(max-width: 767px) 100vw, (max-width: 1180px) 90vw, 72vw"
            />
          </div>

          <div className="ny__tall">
            <PlateFigure
              photo={tall}
              sizes="(max-width: 767px) 100vw, 24vw"
            />
          </div>

          <div className="ny__text" data-reveal="group">
            <p className="prose dropcap">{copy.paragraphs[0]}</p>
            <p className="prose">{copy.paragraphs[1]}</p>

            <blockquote className="ny__quote">
              <p className="cn">{copy.quote}</p>
              <cite className="meta">{copy.quoteNote}</cite>
            </blockquote>

            <p className="prose">{copy.paragraphs[2]}</p>

            <ArrowLink href="/vision/">观看视觉专题</ArrowLink>
          </div>

          <div className="ny__details">
            <Figure
              className="ny__detail"
              src="/images/details/detail-01.webp"
              alt="《Phone Call》细节：电话亭玻璃上的街道反光、招牌与打电话的男人。"
              width={1000}
              height={695}
              ratio="4 / 3"
              title="Glass, Reflection"
              meta="DETAIL — PHONE CALL, 1957"
              reveal={false}
              sizes="(max-width: 767px) 100vw, 20vw"
            />

            <Figure
              className="ny__detail ny__detail--offset"
              src="/images/details/detail-03.webp"
              alt="《Mirrors》细节：镜面中重叠的行人、建筑与橱窗。"
              width={1150}
              height={850}
              ratio="4 / 3"
              title="Mirrored Street"
              meta="DETAIL — MIRRORS, C. 1962"
              reveal={false}
              sizes="(max-width: 767px) 100vw, 20vw"
            />

            <Figure
              className="ny__detail"
              src="/images/details/detail-02.webp"
              alt="《Red Curtain》细节：红色窗帘的褶皱与窗外的光。"
              width={900}
              height={900}
              ratio="1 / 1"
              title="Red Curtain, Detail"
              meta="DETAIL — RED CURTAIN, 1956"
              reveal={false}
              sizes="(max-width: 767px) 100vw, 20vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
