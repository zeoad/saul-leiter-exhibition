import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { homeCopy, painterPoints } from "@/data/exhibition";
import { photographs } from "@/data/photographs";

/**
 * The last frame: the whole register runs past the wall — three strips
 * drifting in opposite directions, the way a drying rack of prints moves
 * when the fan is left on.
 */
const ROWS = [
  { duration: "96s", direction: "normal", offset: "0s" },
  { duration: "78s", direction: "reverse", offset: "-24s" },
  { duration: "116s", direction: "normal", offset: "-52s" },
];

export default function VisionOutro() {
  const painter = homeCopy.painter;
  const perRow = Math.ceil(photographs.length / ROWS.length);
  const rows = ROWS.map((spec, index) => {
    const slice = photographs.slice(index * perRow, (index + 1) * perRow);
    return { ...spec, frames: [...slice, ...slice] };
  });

  return (
    <section className="voutro tone-dark" aria-labelledby="voutro-title">
      <div className="voutro__reel" aria-hidden="true">
        {rows.map((row, rowIndex) => (
          <div className="voutro__row" key={rowIndex}>
            <div
              className="voutro__track"
              style={
                {
                  "--reel-dur": row.duration,
                  "--reel-dir": row.direction,
                  "--reel-offset": row.offset,
                } as CSSProperties
              }
            >
              {row.frames.map((photo, index) => (
                <span className="voutro__frame" key={`${photo.slug}-${index}`}>
                  <Image
                    src={photo.image.src}
                    alt=""
                    fill
                    sizes="18vw"
                    className="voutro__img"
                  />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="wrap voutro__inner">
        <span className="eyebrow" lang="en">
          THE LAST WORD
        </span>

        <h2 id="voutro-title" className="display" lang="en">
          BEAUTY IS
          <br />
          <em>EVERYWHERE.</em>
        </h2>

        <p>
          需要的不是更好的相机，而是更慢的眼睛。当你看完这四个章节，再回到街上，
          也许会发现那些原本不存在的东西，一直都在那里。
        </p>

        <div className="voutro__actions">
          <Link href="/life/" className="btn">
            继续了解他的生平
          </Link>
          <Link href="/work/" className="btn">
            回到作品集
          </Link>
        </div>

        <section
          className="voutro__painter"
          aria-labelledby="voutro-painter-title"
        >
          <div className="voutro__painter-head">
            <span className="eyebrow" lang="en">
              A PAINTER&apos;S EYE
            </span>
            <h3 id="voutro-painter-title" className="display" lang="en">
              PAINTING FIRST,
              <br />
              <em>PHOTOGRAPHY SECOND.</em>
            </h3>
            <p className="voutro__painter-lede">{painter.standfirst}</p>
          </div>

          <div className="voutro__painter-body">
            {painter.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph.slice(0, 12)}>{paragraph}</p>
            ))}
            <p className="voutro__painter-note">{painter.note}</p>
          </div>

          <dl className="voutro__painter-points">
            {painterPoints.map((point) => (
              <div key={point.label}>
                <dt>{point.label}</dt>
                <dd>{point.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </section>
  );
}
