import Figure from "@/components/ui/Figure";
import PlateFigure from "@/components/ui/PlateFigure";
import ArrowLink from "@/components/ui/ArrowLink";
import { glassNotes, homeCopy } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";

export default function BehindGlass() {
  const copy = homeCopy.glass;
  const mirrors = getPhotographBySlug("mirrors");
  const boards = getPhotographBySlug("through-boards");

  if (!mirrors || !boards) return null;

  return (
    <section
      id="behind-the-glass"
      className="section glass theme-paper"
      aria-labelledby="glass-title"
    >
      <div className="container">
        <header className="glass__head">
          <div>
            <span className="eyebrow">SECTION 05 / OBSTRUCTION</span>
            <h2 id="glass-title" className="display display--lg" lang="en">
              BEHIND
              <br />
              <em>THE GLASS</em>
            </h2>
          </div>

          <div className="glass__head-aside">
            <p className="kicker">玻璃之后</p>
            <p className="lead">{copy.standfirst}</p>
          </div>
        </header>

        <div className="glass__stage">
          <div className="glass__sticky">
            <div className="glass__sticky-inner" data-reveal="group">
              <p className="prose dropcap">{copy.paragraphs[0]}</p>
              <p className="prose">{copy.paragraphs[1]}</p>

              <ol className="glass__notes">
                {glassNotes.map((note, index) => (
                  <li className="glass__note" key={note.label}>
                    <span className="glass__note-index">0{index + 1}</span>
                    <span>
                      <span className="glass__note-label">{note.label}</span>
                      <span className="glass__note-text">{note.text}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <blockquote className="glass__quote">
                <p className="cn">{copy.pullquote}</p>
              </blockquote>

              <ArrowLink href="/vision/#obstruction">阅读遮挡专题</ArrowLink>
            </div>
          </div>

          <div className="glass__stack">
            <PlateFigure
              photo={mirrors}
              className="glass__figure glass__figure--lead"
              ratio="16 / 10"
              sizes="(max-width: 1023px) 100vw, 52vw"
              captionPosition="none"
            />

            <PlateFigure
              photo={boards}
              className="glass__figure glass__figure--overlap"
              sizes="(max-width: 1023px) 76vw, 28vw"
              captionPosition="none"
            >
              <span className="figure__overlay-label">
                THROUGH BOARDS, 1957 — PL. 001
              </span>
            </PlateFigure>

            <Figure
              className="glass__figure glass__figure--detail"
              src="/images/details/detail-03.webp"
              alt="《Mirrors》细节：镜面中重叠的行人、建筑与橱窗。"
              width={1150}
              height={850}
              ratio="4 / 3"
              title="Mirrors, Detail"
              meta="DETAIL — MIRRORS, C. 1962"
              reveal={false}
              captionPosition="none"
              sizes="(max-width: 1023px) 60vw, 20vw"
            >
              <span className="figure__overlay-label">
                MIRRORS — DETAIL
              </span>
            </Figure>

            <p className="glass__stack-caption">
              <span>MIRRORS, C. 1962 — PL. 004</span>
              <span>OBSTRUCTION · ABSTRACT</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
