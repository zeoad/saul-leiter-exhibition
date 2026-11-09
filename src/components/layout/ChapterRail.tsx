"use client";

import { useEffect, useState } from "react";

import { homeChapters } from "@/data/exhibition";
import { scrollToTarget } from "@/lib/lenis";

/**
 * THE REGISTER — a thin vertical index on the right edge of the exhibition.
 * It knows which room you are standing in, and will take you to another.
 */
export default function ChapterRail() {
  const [active, setActive] = useState("cover");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sections = homeChapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const footer = document.querySelector<HTMLElement>(".site-footer");

    if (!sections.length) return;

    let frame = 0;

    const update = () => {
      const marker = window.scrollY + window.innerHeight * 0.42;
      let current = sections[0];

      for (const section of sections) {
        if (section.offsetTop <= marker) current = section;
      }

      setActive((previous) => (previous === current.id ? previous : current.id));

      if (footer) {
        setHidden(window.scrollY + window.innerHeight > footer.offsetTop + 80);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      className="chapter-marks"
      data-hidden={hidden}
      aria-label="展览章节导航"
    >
      <ul className="chapter-marks__list">
        {homeChapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              className="chapter-marks__item"
              data-active={active === chapter.id}
              href={`#${chapter.id}`}
              aria-label={`${chapter.number} — ${chapter.title}`}
              aria-current={active === chapter.id ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget(`#${chapter.id}`, -72);
                window.history.replaceState(null, "", `#${chapter.id}`);
              }}
            >
              <span className="chapter-marks__label" aria-hidden="true">
                {chapter.number} / {chapter.label}
              </span>
              <span className="chapter-marks__tick" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
