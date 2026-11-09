"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { homeChapters } from "@/data/exhibition";
import { photographs } from "@/data/photographs";
import { scrollToTarget, startScroll, stopScroll } from "@/lib/lenis";

const CN: Record<string, string> = {
  cover: "封面",
  statement: "开幕陈述",
  "new-york": "纽约",
  color: "色彩",
  "behind-the-glass": "遮挡",
  "rain-and-snow": "雨雪",
  "the-ordinary": "日常",
  "painters-eye": "画家之眼",
  "selected-works": "精选作品",
  life: "生平",
  closing: "回望",
};

/**
 * THE EXHIBITION DIRECTORY — every room of the show, in one list.
 * Hovering a room brings its plate up beside the pointer.
 */
export default function Directory({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    stopScroll();
    document.documentElement.classList.add("menu-open");
    const timer = window.setTimeout(() => firstRowRef.current?.focus(), 380);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      startScroll();
      document.documentElement.classList.remove("menu-open");
      setActive(null);
    };
  }, [open, onClose]);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const preview = previewRef.current;
    if (!preview) return;

    const width = preview.offsetWidth || 220;
    let x = event.clientX + 28;
    if (x + width > window.innerWidth - 24) {
      x = event.clientX - width - 28;
    }

    preview.style.left = `${x}px`;
    preview.style.top = `${event.clientY}px`;
  };

  return (
    <div
      id="exhibition-directory"
      className="directory"
      data-open={open}
      aria-hidden={!open}
      inert={!open ? true : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="展览目录"
      onPointerMove={onPointerMove}
    >
      <div className="directory__inner">
        <div className="directory__head">
          <h2 lang="en">The Exhibition Index</h2>
          <button
            type="button"
            className="directory__close"
            onClick={onClose}
            aria-label="关闭展览目录"
          >
            <X aria-hidden="true" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="directory__list" aria-label="展览章节">
          {homeChapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              ref={index === 0 ? firstRowRef : undefined}
              href={`/#${chapter.id}`}
              className="directory__row"
              onPointerEnter={() => setActive(chapter.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(chapter.id)}
              onBlur={() => setActive(null)}
              onClick={(event) => {
                if (pathname === "/") {
                  event.preventDefault();
                  onClose();
                  window.setTimeout(() => {
                    scrollToTarget(`#${chapter.id}`, -72);
                    window.history.replaceState(null, "", `#${chapter.id}`);
                  }, 260);
                  return;
                }
                onClose();
              }}
            >
              <i>{chapter.number}</i>
              <span className="directory__row-title" lang="en">
                {chapter.title}
              </span>
              <span className="directory__row-cn">{CN[chapter.id]}</span>
            </Link>
          ))}

          <Link
            href="/archive/"
            className="directory__row"
            onPointerEnter={() => setActive("archive")}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive("archive")}
            onBlur={() => setActive(null)}
            onClick={onClose}
          >
            <i>12</i>
            <span className="directory__row-title" lang="en">
              The Archive
            </span>
            <span className="directory__row-cn">作品档案</span>
          </Link>
        </nav>

        <div className="directory__foot">
          <span lang="en">SAUL LEITER · A QUIET GAZE · 2026</span>
          <span lang="en">ESC TO CLOSE</span>
        </div>
      </div>

      <div
        ref={previewRef}
        className="directory__preview"
        data-show={Boolean(active)}
        aria-hidden="true"
      >
        {active ? (
          <Image
            src={
              active === "archive"
                ? photographs[15].image.src
                : photographs[
                    Math.min(
                      photographs.length - 1,
                      homeChapters.findIndex((c) => c.id === active) * 2
                    )
                  ]?.image.src
            }
            alt=""
            fill
            sizes="(max-width: 1023px) 0px, 320px"
          />
        ) : null}
      </div>
    </div>
  );
}
