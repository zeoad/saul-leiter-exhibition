import Figure from "@/components/ui/Figure";
import PlateFigure from "@/components/ui/PlateFigure";
import ArrowLink from "@/components/ui/ArrowLink";
import { timeline } from "@/data/timeline";
import { getPhotographBySlug } from "@/lib/gallery";

export default function LifePreview() {
  const events = timeline.filter((event) => event.highlight).slice(0, 6);
  const timesSquare = getPhotographBySlug("times-square-new-years-eve");

  return (
    <section
      id="life"
      className="section life-preview theme-ink"
      aria-labelledby="life-title"
    >
      <div className="container">
        <div className="life-preview__grid">
          <header className="life-preview__head">
            <span className="eyebrow">SECTION 10 / THE LIFE</span>
            <h2 id="life-title" className="display display--lg" lang="en">
              A QUIET
              <br />
              <em>LIFE</em>
            </h2>
            <p className="kicker">生平 · 1923—2013</p>
          </header>

          <div className="life-preview__media">
            <Figure
              className="life-preview__figure"
              src="/images/portraits/leiter-portrait.webp"
              alt="索尔·雷特肖像，约 1950 年代：他戴着眼镜，在窗边低头，胸前挂着一台相机。"
              width={925}
              height={1080}
              ratio="4 / 5"
              title="Saul Leiter, c. 1950s"
              meta="PORTRAIT · SAUL LEITER FOUNDATION"
              index="FIG. 01"
              sizes="(max-width: 1023px) 100vw, 38vw"
            />

            {timesSquare ? (
              <PlateFigure
                photo={timesSquare}
                className="life-preview__media-alt"
                sizes="(max-width: 1023px) 44vw, 18vw"
                captionPosition="none"
                ratio="4 / 3"
              >
                <span className="figure__overlay-label">
                  TIMES SQUARE, 1952–53
                </span>
              </PlateFigure>
            ) : null}

            <p className="life-preview__caption">
              1923 年出生于匹兹堡，2013 年在纽约去世。近七十年里，
              他几乎每天都在这座城市里散步、画画、拍照。
              图片版权归 Estate of Saul Leiter 所有。
            </p>
          </div>

          <div className="life-preview__body">
            <ol className="life-preview__timeline">
              {events.map((event) => (
                <li className="life-preview__event" key={event.year}>
                  <span className="life-preview__year">{event.year}</span>
                  <div className="life-preview__event-body">
                    <h3 className="life-preview__event-title">
                      {event.titleCn}
                    </h3>
                    <p className="life-preview__event-text">{event.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="life-preview__foot">
              <ArrowLink href="/life/">阅读完整生平</ArrowLink>
              <span className="meta">YEARBOOK / 11 ENTRIES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
