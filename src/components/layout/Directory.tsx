"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { getPhotographBySlug } from "@/lib/gallery";
import { scrollToTarget, startScroll, stopScroll } from "@/lib/lenis";

/** The exhibition is four rooms plus the cover they hang behind. */
const ROWS = [
  { index: "00", href: "/", title: "The Cover", cn: "封面", slug: "taxi" },
  { index: "01", href: "/work/", title: "The Work", cn: "印相校样", slug: "red-curtain" },
  { index: "02", href: "/vision/", title: "The Vision", cn: "四种观看", slug: "mirrors" },
  { index: "03", href: "/life/", title: "The Life", cn: "灯下的房间", slug: "man-in-straw-hat" },
  { index: "04", href: "/archive/", title: "The Archive", cn: "作品登记", slug: "sidewalk" },
];

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

  const activeRow = ROWS.find((row) => row.href === active);
  const activePhoto = activeRow
    ? getPhotographBySlug(activeRow.slug)
    : undefined;

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

        <nav className="directory__list" aria-label="展厅目录">
          {ROWS.map((row, index) => (
            <Link
              key={row.href}
              ref={index === 0 ? firstRowRef : undefined}
              href={row.href}
              className="directory__row"
              onPointerEnter={() => setActive(row.href)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(row.href)}
              onBlur={() => setActive(null)}
              onClick={(event) => {
                if (pathname === "/" && row.href === "/") {
                  event.preventDefault();
                  onClose();
                  window.setTimeout(() => {
                    scrollToTarget(0);
                    window.history.replaceState(null, "", "/");
                  }, 260);
                  return;
                }
                onClose();
              }}
            >
              <i>{row.index}</i>
              <span className="directory__row-title" lang="en">
                {row.title}
              </span>
              <span className="directory__row-cn">{row.cn}</span>
            </Link>
          ))}
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
        {activePhoto ? (
          <Image
            src={activePhoto.image.src}
            alt=""
            fill
            sizes="(max-width: 1023px) 0px, 320px"
          />
        ) : null}
      </div>
    </div>
  );
}
