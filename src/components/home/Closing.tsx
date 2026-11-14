"use client";

import Link from "next/link";

import { homeCopy, navLinks, site } from "@/data/exhibition";
import { getLenis, scrollToTarget } from "@/lib/lenis";

/**
 * 03 · CLOSING — a short register, not an essay.
 *
 * The last screen is deliberately less than half a viewport: the four rooms
 * restated as small type, the exhibition's own credits, and two ways back.
 */
export default function Closing() {
  const { closing } = homeCopy;

  const replay = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("aqg:intro-replay"));
    }, 80);
  };

  return (
    <section
      id="closing"
      className="scene scene-closing tone-dark"
      aria-labelledby="closing-title"
    >
      <span className="closing__perf" aria-hidden="true" />

      <div className="wrap closing__inner">
        <div className="closing__lead">
          <span className="eyebrow" lang="en">
            03 / CLOSING
          </span>

          <h2 id="closing-title" className="closing__title display">
            LOOK <em>AGAIN.</em>
          </h2>

          <p className="closing__line">{closing.closingLine}</p>
        </div>

        <nav className="closing__rooms" aria-label="四个展厅">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="closing__room">
              <i>{link.index}</i>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="closing__foot">
          <span>
            {site.name} — {site.subtitle} · {site.season}
          </span>

          <div className="closing__actions">
            <button
              type="button"
              onClick={() => scrollToTarget("#programme", -40)}
              data-cursor="link"
              data-cursor-label="PROGRAMME"
            >
              BACK TO THE PROGRAMME ↑
            </button>
            <button
              type="button"
              onClick={replay}
              data-cursor="link"
              data-cursor-label="REWIND"
            >
              REPLAY THE OPENING
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
