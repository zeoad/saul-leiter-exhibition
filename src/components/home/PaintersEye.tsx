import Figure from "@/components/ui/Figure";
import PlateFigure from "@/components/ui/PlateFigure";
import ArrowLink from "@/components/ui/ArrowLink";
import { homeCopy, painterPoints } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";

export default function PaintersEye() {
  const copy = homeCopy.painter;
  const blueSkirt = getPhotographBySlug("blue-skirt");

  return (
    <section
      id="painters-eye"
      className="section painter theme-paper"
      aria-labelledby="painter-title"
    >
      <div className="container">
        <header className="painter__head">
          <div>
            <span className="eyebrow">SECTION 08 / A PAINTER&apos;S EYE</span>
            <h2 id="painter-title" className="display display--lg" lang="en">
              A PAINTER&apos;S
              <br />
              <em>EYE</em>
            </h2>
          </div>

          <div className="painter__head-aside">
            <p className="kicker">画家的眼睛</p>
            <p className="lead">{copy.standfirst}</p>
          </div>
        </header>

        <div className="painter__diptych">
          {blueSkirt ? (
            <PlateFigure
              photo={blueSkirt}
              className="painter__figure painter__figure--left"
              ratio="4 / 3"
              sizes="(max-width: 767px) 100vw, 44vw"
              note={copy.comparisonLabels.left}
            />
          ) : null}

          <Figure
            className="painter__figure painter__figure--right"
            src="/images/details/detail-02.webp"
            alt="《Red Curtain》细节：红色窗帘的褶皱与窗外的光。"
            width={900}
            height={900}
            ratio="1 / 1"
            title="Red, Detail"
            meta="PHOTOGRAPHIC DETAIL"
            index="STUDY 02"
            reveal={false}
            sizes="(max-width: 767px) 100vw, 30vw"
            note={copy.comparisonLabels.right}
          />
        </div>

        <div className="painter__body">
          <div className="painter__text" data-reveal="group">
            <p className="prose dropcap">{copy.paragraphs[0]}</p>
            <p className="prose">{copy.paragraphs[1]}</p>
            <p className="prose">{copy.paragraphs[2]}</p>
            <p className="painter__note meta">{copy.note}</p>
          </div>

          <div className="painter__points" data-reveal="group">
            {painterPoints.map((point) => (
              <div className="painter__point" key={point.label}>
                <span className="meta meta--accent">{point.label}</span>
                <p>{point.body}</p>
              </div>
            ))}
            <ArrowLink href="/life/">了解他的绘画经历</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
