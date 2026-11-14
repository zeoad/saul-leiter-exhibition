import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getPhotographBySlug } from "@/lib/gallery";
import type { Photograph } from "@/types";

const CARD_NUMBERS = ["001", "002", "007", "011", "014", "016"];

function DoorFoot({
  index,
  room,
  hook,
  meta,
  cta,
  href,
}: {
  index: string;
  room: [string, string];
  hook: string;
  meta: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="door__foot">
      <div className="door__id">
        <span className="door__index mono">{index} / ENTER</span>
        <h3 className="door__room display">
          {room[0]} <em>{room[1]}</em>
        </h3>
        <p className="door__hook">{hook}</p>
      </div>
      <span className="door__meta mono">{meta}</span>
      <Link href={href} className="door__cta">
        <span>{cta}</span>
        <ArrowRight aria-hidden="true" strokeWidth={1.4} />
      </Link>
    </div>
  );
}

/**
 * 02 · THE PROGRAMME — four doors, one screen.
 *
 * The home page is a programme, not the exhibition. Each door gets a single
 * preview of the room behind it and one gesture that belongs only to it:
 * a red pencil circling a print, a gate changing frames, a lamp breathing,
 * a register fanning open. Nothing here is a wall of photographs.
 */
export default function Programme() {
  const circled = getPhotographBySlug("red-curtain");
  const reel = ["mirrors", "rain", "sidewalk", "through-boards"]
    .map((slug) => getPhotographBySlug(slug))
    .filter((photo): photo is Photograph => Boolean(photo));

  return (
    <section
      id="programme"
      className="scene scene-programme"
      aria-labelledby="programme-title"
    >
      <header className="programme__head">
        <div>
          <span className="eyebrow" lang="en">
            02 / THE PROGRAMME
          </span>
          <h2 id="programme-title" className="programme__title display">
            四道门，<em>选一间</em>开始。
          </h2>
        </div>
        <p className="programme__count mono" lang="en">
          FOUR ROOMS · ONE GAZE
        </p>
      </header>

      <ol className="programme__grid">
        {/* --- 01 · THE WORK ------------------------------------------------ */}
        <li className="door door--work">
          <Link
            href="/work/"
            className="door__surface"
            aria-label="进入 THE WORK — 一张印相如何被选中"
          >
            <div className="door__stage" aria-hidden="true">
              <span className="workstage">
                <span className="workstage__ghost">
                  {circled ? (
                    <Image
                      src={circled.image.src}
                      alt=""
                      fill
                      sizes="(max-width: 1023px) 60vw, 20vw"
                      className="workstage__ghost-img"
                    />
                  ) : null}
                </span>

                <span className="workstage__sheet">
                  <span className="workstage__print">
                    {circled ? (
                      <Image
                        src={circled.image.src}
                        alt=""
                        fill
                        sizes="(max-width: 1023px) 60vw, 20vw"
                        className="workstage__img"
                      />
                    ) : null}
                  </span>

                  <svg
                    className="workstage__ring"
                    viewBox="0 0 100 80"
                    preserveAspectRatio="none"
                  >
                    <ellipse
                      cx="50"
                      cy="40"
                      rx="45"
                      ry="34"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  <span className="workstage__crop workstage__crop--tl" />
                  <span className="workstage__crop workstage__crop--tr" />
                  <span className="workstage__crop workstage__crop--bl" />
                  <span className="workstage__crop workstage__crop--br" />

                  <span className="workstage__note">SELECT 07 · CROP 4×5</span>
                </span>
              </span>
            </div>
          </Link>

          <DoorFoot
            index="01"
            room={["THE", "WORK"]}
            hook="一张印相如何被选中"
            meta="16 PLATES · 4 STRIPS"
            cta="OPEN THE CONTACT SHEET"
            href="/work/"
          />
        </li>

        {/* --- 02 · THE VISION --------------------------------------------- */}
        <li className="door door--vision">
          <Link
            href="/vision/"
            className="door__surface"
            aria-label="进入 THE VISION — 同一座城市，四种看法"
          >
            <div className="door__stage" aria-hidden="true">
              <span className="visionstage">
                <span className="visionstage__counter">
                  <i className="visionstage__tally" />
                  FRAME 01 / 04
                </span>

                <span className="visionstage__reel">
                  {reel.map((photo, index) => (
                    <span
                      className="visionstage__cell"
                      key={photo.slug}
                      style={{ "--i": index } as CSSProperties}
                    >
                      <Image
                        src={photo.image.src}
                        alt=""
                        fill
                        sizes="(max-width: 1023px) 30vw, 10vw"
                        className="visionstage__img"
                      />
                    </span>
                  ))}
                </span>
              </span>
            </div>
          </Link>

          <DoorFoot
            index="02"
            room={["THE", "VISION"]}
            hook="同一座城市，四种看法"
            meta="04 CHAPTERS"
            cta="ENTER THE SCREENING"
            href="/vision/"
          />
        </li>

        {/* --- 03 · THE LIFE ----------------------------------------------- */}
        <li className="door door--life">
          <Link
            href="/life/"
            className="door__surface"
            aria-label="进入 THE LIFE — 灯亮着，房间在动"
          >
            <div className="door__stage" aria-hidden="true">
              <span className="lifestage">
                <span className="lifestage__swing">
                  <span className="lifestage__cord" />
                  <span className="lifestage__head">
                    <span className="lifestage__shade" />
                    <span className="lifestage__bulb" />
                  </span>
                </span>
                <span className="lifestage__pool" />
                <span className="lifestage__shadow" />
              </span>
            </div>
          </Link>

          <DoorFoot
            index="03"
            room={["THE", "LIFE"]}
            hook="灯亮着，房间在动"
            meta="1923 — 2013"
            cta="STEP INTO THE ROOM"
            href="/life/"
          />
        </li>

        {/* --- 04 · THE ARCHIVE -------------------------------------------- */}
        <li className="door door--archive">
          <Link
            href="/archive/"
            className="door__surface"
            aria-label="进入 THE ARCHIVE — 按年份、颜色、地点翻找"
          >
            <div className="door__stage" aria-hidden="true">
              <span className="archivestage">
                <span className="archivestage__deck">
                  <span className="archivestage__card archivestage__card--c" />
                  <span className="archivestage__card archivestage__card--b" />

                  <span className="archivestage__card archivestage__card--a">
                    <span className="archivestage__tab">AQG · REGISTER</span>
                    <span className="archivestage__window">
                      <span className="archivestage__strip">
                        {CARD_NUMBERS.map((number) => (
                          <span key={number}>{number}</span>
                        ))}
                      </span>
                    </span>
                    <span className="archivestage__rules">
                      <span />
                      <span />
                      <span />
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </Link>

          <DoorFoot
            index="04"
            room={["THE", "ARCHIVE"]}
            hook="按年份、颜色、地点翻找"
            meta="16 ENTRIES · 7 CITIES"
            cta="TURN THE REGISTER"
            href="/archive/"
          />
        </li>
      </ol>
    </section>
  );
}
