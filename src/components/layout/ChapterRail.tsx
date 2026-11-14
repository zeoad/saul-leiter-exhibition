"use client";

import Link from "next/link";

import { navLinks } from "@/data/exhibition";
import { scrollToTarget } from "@/lib/lenis";

/**
 * THE ROOM RAIL — the four rooms, always reachable.
 *
 * The home page is only a programme now, so this rail no longer tracks
 * chapters; it simply keeps the exhibition one click away while you read.
 */
export default function ChapterRail() {
  return (
    <nav className="room-rail" aria-label="展厅选择">
      <ul className="room-rail__list">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="room-rail__item"
              aria-label={`${link.index} — ${link.label}`}
              data-cursor="link"
              data-cursor-label="ENTER"
            >
              <span className="room-rail__label" aria-hidden="true">
                {link.index} / {link.label}
              </span>
              <span className="room-rail__tick" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="room-rail__top"
        onClick={() => scrollToTarget(0)}
        data-cursor="link"
        data-cursor-label="TOP"
        aria-label="回到封面"
      >
        <span className="room-rail__label" aria-hidden="true">
          COVER
        </span>
        <span className="room-rail__tick" aria-hidden="true" />
      </button>
    </nav>
  );
}
