import PlateFigure from "@/components/ui/PlateFigure";
import SectionHeading from "@/components/ui/SectionHeading";
import ArrowLink from "@/components/ui/ArrowLink";
import { colorObservations, homeCopy } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";

export default function ColorLanguage() {
  const copy = homeCopy.color;
  const taxi = getPhotographBySlug("taxi");
  const curtain = getPhotographBySlug("red-curtain");
  const blueSkirt = getPhotographBySlug("blue-skirt");
  const sanCarlo = getPhotographBySlug("san-carlo-restaurant");
  const mirrors = getPhotographBySlug("mirrors");

  if (!taxi || !curtain || !blueSkirt || !sanCarlo || !mirrors) return null;

  return (
    <section
      id="color"
      className="section color theme-ink"
      aria-labelledby="color-title"
    >
      <div className="container">
        <SectionHeading
          number="04"
          label="COLOR"
          lines={["THE LANGUAGE", "OF COLOR"]}
          cn={copy.eyebrow}
          aside={
            <>
              <p className="kicker" style={{ color: "var(--fg-muted)" }}>
                色彩的语言
              </p>
              <p className="lead">{copy.standfirst}</p>
            </>
          }
        />

        <div className="color__grid">
          <div className="color__row color__row--one">
            <PlateFigure
              photo={taxi}
              className="color__figure color__figure--wide"
              ratio="3 / 2"
              sizes="(max-width: 767px) 100vw, 56vw"
            />

            <PlateFigure
              photo={curtain}
              className="color__figure color__figure--square"
              ratio="1 / 1"
              sizes="(max-width: 767px) 100vw, 26vw"
            />
          </div>

          <div className="color__row color__row--two">
            <div className="palette" data-reveal="text">
              <p className="meta">PALETTE NOTES / 色彩观察</p>
              <ul className="palette__list">
                {colorObservations.map((colour) => (
                  <li className="palette__item" key={colour.name}>
                    <span
                      className="palette__swatch"
                      style={{ backgroundColor: colour.hex }}
                      aria-hidden="true"
                    />
                    <span className="palette__body">
                      <span className="palette__name">
                        {colour.name}
                        <span className="palette__hex">{colour.hex}</span>
                      </span>
                      <span className="palette__note">{colour.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <PlateFigure
              photo={blueSkirt}
              className="color__figure color__figure--mid"
              ratio="3 / 2"
              sizes="(max-width: 767px) 100vw, 40vw"
            />

            <PlateFigure
              photo={sanCarlo}
              className="color__figure color__figure--lower"
              ratio="1 / 1"
              sizes="(max-width: 767px) 100vw, 26vw"
            />
          </div>

          <div className="color__row color__row--three">
            <PlateFigure
              photo={mirrors}
              className="color__figure color__figure--blue"
              ratio="4 / 3"
              sizes="(max-width: 767px) 100vw, 48vw"
            />

            <div className="color__note" data-reveal="text">
              <p className="meta">ON RESTRAINT / 论克制</p>
              <p className="prose">{copy.paragraphs[0]}</p>
              <p className="prose">{copy.paragraphs[1]}</p>
              <p className="prose">{copy.paragraphs[2]}</p>
              <p className="color__disclaimer meta">{copy.note}</p>
              <ArrowLink href="/vision/#color">阅读色彩专题</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
