"use client";

import { useEffect, useRef, useState } from "react";

import { chapters } from "@/data/chapters";
import { scrollToTarget } from "@/lib/lenis";

/**
 * THE GATE — a sticky register of the four acts, drawn in difference so it
 * stays legible over paper and over the black of the screening room alike.
 * The hairline under it is the length of the reel already played.
 */
export default function VisionTrack() {
  const [active, setActive] = useState(chapters[0]?.id ?? "");
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const outro = document.querySelector<HTMLElement>(".voutro");
    let frame = 0;

    const update = () => {
      const scroll = window.scrollY;
      const marker = scroll + window.innerHeight * 0.38;
      let current = sections[0];

      for (const section of sections) {
        if (section.offsetTop <= marker) current = section;
      }

      setActive((previous) => (previous === current.id ? previous : current.id));

      if (outro) {
        setHidden(scroll + window.innerHeight > outro.offsetTop + 80);
      }

      if (barRef.current) {
        const start = sections[0].offsetTop;
        const end =
          sections[sections.length - 1].offsetTop +
          sections[sections.length - 1].offsetHeight -
          window.innerHeight;
        const progress =
          end > start ? Math.min(1, Math.max(0, (scroll - start) / (end - start))) : 0;
        barRef.current.style.transform = `scaleX(${progress.toFixed(3)})`;
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
    <nav className="vision-track" aria-label="章节导航" data-hidden={hidden}>
      <span className="vision-track__label" lang="en" aria-hidden="true">
        FOUR WAYS OF LOOKING
      </span>

      <ol className="vision-track__list">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              data-active={active === chapter.id}
              aria-current={active === chapter.id ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget(`#${chapter.id}`, -72);
                window.history.replaceState(null, "", `#${chapter.id}`);
              }}
            >
              <i lang="en">{chapter.number}</i>
              <span lang="en">{chapter.kicker}</span>
            </a>
          </li>
        ))}
      </ol>

      <span className="vision-track__bar" aria-hidden="true">
        <i ref={barRef} />
      </span>
    </nav>
  );
}
