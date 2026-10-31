import Figure from "@/components/ui/Figure";
import ArrowLink from "@/components/ui/ArrowLink";
import { homeCopy } from "@/data/exhibition";

export default function OpeningStatement() {
  const copy = homeCopy.opening;

  return (
    <section
      id="statement"
      className="section statement theme-paper"
      aria-labelledby="statement-title"
    >
      <div className="container">
        <div className="statement__grid">
          <div className="statement__left">
            <div className="statement__marker">
              <span className="eyebrow">SECTION 02 / OPENING STATEMENT</span>
              <span className="statement__index" aria-hidden="true">
                02
              </span>
            </div>

            <h2
              id="statement-title"
              className="display display--lg statement__title"
              lang="en"
            >
              {copy.titleLines[0]}
              <br />
              OF <em>{copy.titleLines[1].replace("OF ", "")}</em>
            </h2>

            <p className="statement__cn">策展前言 · 论观看</p>

            <div className="statement__portrait">
              <Figure
                src={copy.portrait.src}
                alt={copy.portrait.alt}
                width={copy.portrait.width}
                height={copy.portrait.height}
                ratio="4 / 5"
                title="Saul Leiter, c. 1950s"
                meta="PORTRAIT · SAUL LEITER FOUNDATION"
                index="FIG. 01"
                sizes="(max-width: 767px) 72vw, (max-width: 1180px) 40vw, 24vw"
                note="肖像版权归 Estate of Saul Leiter 所有。基金会未注明拍摄者，本项目不将其认定为自拍。"
              />
            </div>
          </div>

          <div className="statement__body">
            <div className="statement__text" data-reveal="group">
              <p className="prose dropcap">{copy.paragraphs[0]}</p>
              <p className="prose">{copy.paragraphs[1]}</p>
              <p className="prose">{copy.paragraphs[2]}</p>
            </div>

            <blockquote className="statement__quote" data-reveal="text">
              <p lang="zh-Hans">{copy.pullquote}</p>
              <cite>— 策展笔记</cite>
            </blockquote>

            <div className="statement__foot" data-reveal="text">
              <span className="meta">{copy.signature}</span>
              <ArrowLink href="/vision/">进入视觉专题</ArrowLink>
            </div>

            <dl className="statement__facts" data-reveal="text">
              <div>
                <dt className="meta">EXHIBITION</dt>
                <dd>11 SECTIONS / 16 PLATES</dd>
              </div>
              <div>
                <dt className="meta">EDITION</dt>
                <dd>2026 / ONLINE</dd>
              </div>
              <div>
                <dt className="meta">ARCHIVE</dt>
                <dd>AQG-001 — AQG-016</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
