"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { timeline } from "@/data/timeline";
import { getPhotographBySlug } from "@/lib/gallery";

const NODE_PHOTO_SLUGS: Record<string, string> = {
  "1950s–70s": "red-curtain",
  "2006": "taxi",
};

/**
 * 10 · THE LIFE — a chronology you walk down.
 * The big year on the left changes when an entry passes through the middle
 * band of the viewport; hover and focus do the same thing by hand.
 */
export default function LifePreview() {
  const axisRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(timeline[0].sortYear);
  const seen = useRef(timeline[0].sortYear);

  const current =
    timeline.find((event) => event.sortYear === active) ?? timeline[0];

  useEffect(() => {
    const axis = axisRef.current;
    if (!axis) return;

    const entries = Array.from(
      axis.querySelectorAll<HTMLElement>("[data-sort-year]")
    );

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.find((record) => record.isIntersecting);
        if (!visible) return;

        const year = Number((visible.target as HTMLElement).dataset.sortYear);
        seen.current = year;
        setActive(year);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );

    entries.forEach((entry) => observer.observe(entry));

    return () => observer.disconnect();
  }, []);

  const focusYear = (sortYear: number) => setActive(sortYear);

  const releaseYear = () => setActive(seen.current);

  return (
    <section
      id="life"
      className="scene scene-life tone-paper"
      aria-labelledby="life-title"
    >
      <span className="ghost-num" aria-hidden="true">
        10
      </span>

      <div className="wrap scene-head">
        <div className="scene-head__meta">
          <span className="eyebrow" lang="en">
            10 / THE LIFE
          </span>
          <span className="caption" lang="en">
            1923 — 2013 · NEW YORK
          </span>
        </div>

        <div className="scene-head__title">
          <h2 id="life-title" className="title display">
            A LIFE
            <br />
            <em>THROUGH TIME</em>
          </h2>
        </div>

        <div className="scene-head__aside">
          <p className="lede">近七十年里，他几乎每天都在这座城市里散步、画画、拍照。</p>
        </div>
      </div>

      <div className="wrap life__grid">
        <aside className="life__aside">
          <b className="life__year" aria-live="polite">
            {current.sortYear}
            <small>
              {current.year} · {current.title.toUpperCase()}
            </small>
          </b>

          <div className="life__portrait">
            <div className="plate__frame" style={{ aspectRatio: "4 / 5" }}>
              <Image
                src="/images/portraits/leiter-portrait.webp"
                alt="索尔·雷特肖像，约 1950 年代：他戴着眼镜，在窗边低头，胸前挂着一台相机。"
                fill
                sizes="(max-width: 1023px) 46vw, 22vw"
                className="plate__img"
                style={{ objectPosition: "50% 30%" }}
              />
              <span className="plate__grain" aria-hidden="true" />
              <span className="plate__marks" aria-hidden="true" />
            </div>
          </div>

          <p className="life__portrait-cn">
            1923 年出生于匹兹堡，2013 年在纽约去世。图片版权归 Estate of Saul
            Leiter 所有。
          </p>
        </aside>

        <div ref={axisRef} className="life__axis" data-reveal-group>
          {timeline.map((event) => {
            const slug = NODE_PHOTO_SLUGS[event.year];
            const photo = slug ? getPhotographBySlug(slug) : undefined;

            return (
              <article
                key={event.year}
                className="life__event"
                data-sort-year={event.sortYear}
                data-active={active === event.sortYear ? "true" : "false"}
                onPointerEnter={() => focusYear(event.sortYear)}
                onPointerLeave={releaseYear}
                onFocus={() => focusYear(event.sortYear)}
                onBlur={releaseYear}
                tabIndex={0}
              >
                <span className="life__event-year">{event.year}</span>

                <div className="life__event-body">
                  <h3>
                    {event.titleCn}
                    <span>{event.title}</span>
                  </h3>
                  <p>{event.body}</p>

                  {event.source ? (
                    <a
                      className="life__event-source"
                      href={event.source.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      SOURCE · {event.source.label.toUpperCase()}
                    </a>
                  ) : null}
                </div>

                {photo ? (
                  <span className="life__event-thumb" aria-hidden="true">
                    <Image
                      src={photo.image.src}
                      alt=""
                      fill
                      sizes="150px"
                      className="plate__img"
                    />
                  </span>
                ) : null}
              </article>
            );
          })}

          <div className="life__foot">
            <Link href="/life/" className="linkline">
              阅读完整生平
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
            </Link>
            <span className="mono" lang="en">
              YEARBOOK / 11 ENTRIES
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
