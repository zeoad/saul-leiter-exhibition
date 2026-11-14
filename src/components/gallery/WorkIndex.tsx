"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import Flip from "gsap/Flip";

import {
  CATEGORIES,
  categoryFromSlug,
  categoryToSlug,
  getAllPhotographs,
  getCategoryCounts,
  getPhotographsByCategory,
} from "@/lib/gallery";
import type { Category, Photograph } from "@/types";

gsap.registerPlugin(Flip);

type Filter = "All" | Category;

const FRAMES_PER_STRIP = 4;
const LOUPE_SIZE = 196;
const LOUPE_ZOOM = 2.3;

function frameNo(photo: Photograph): string {
  return photo.plate.replace(/^PL\.\s*/, "");
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

function Proof({
  photo,
  printed,
  delay,
}: {
  photo: Photograph;
  printed: boolean;
  delay: number;
}) {
  return (
    <Link
      href={`/work/${photo.slug}/`}
      className="proof"
      data-develop
      style={{ "--dev-delay": `${delay}ms` } as CSSProperties}
      aria-label={`${photo.title}${photo.year ? `，${photo.year}` : ""}（${
        photo.plate
      }）— 打开作品档案`}
    >
      <span className="proof__cell">
        <Image
          className="proof__img"
          src={photo.image.src}
          alt={photo.image.alt}
          fill
          sizes="(max-width: 640px) 44vw, (max-width: 1023px) 30vw, 22vw"
          style={{ objectFit: "cover" }}
        />

        <span className="proof__emulsion" aria-hidden="true" />

        {printed ? (
          <svg
            className="proof__mark"
            viewBox="0 0 100 125"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <ellipse className="proof__mark-line" cx="50" cy="62" rx="36" ry="45" />
            <ellipse
              className="proof__mark-line proof__mark-line--soft"
              cx="52"
              cy="63"
              rx="34"
              ry="46"
            />
          </svg>
        ) : null}
      </span>
    </Link>
  );
}

/**
 * /work — one roll, laid flat.
 * The register is printed as 35mm strips: frames that develop as they enter
 * the sheet, an editor's grease-pencil selection, and a loupe for looking
 * closer without leaving the page.
 */
export default function WorkIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const pending = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const [filter, setFilter] = useState<Filter>("All");

  const total = getAllPhotographs().length;
  const counts = useMemo(() => getCategoryCounts(), []);

  const photographs = useMemo(
    () =>
      filter === "All" ? getAllPhotographs() : getPhotographsByCategory(filter),
    [filter]
  );

  const strips = useMemo(
    () => chunk(photographs, FRAMES_PER_STRIP),
    [photographs]
  );

  const printed = photographs[Math.max(0, photographs.length - 2)];

  /* The last four frames are the ones brought to the cutting table. */
  const cutFrames = strips[strips.length - 1] ?? [];
  const cutIndex = cutFrames.findIndex(
    (photo) => photo.slug === printed?.slug
  );
  const cutAt =
    cutIndex < 0 ? 75 : ((cutIndex + 1) / cutFrames.length) * 100;

  /* Deep links such as /work/?category=obstruction */
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "category"
    );
    const match = requested ? categoryFromSlug(requested) : null;
    if (match) setFilter(match);
  }, []);

  const applyFilter = (next: Filter) => {
    const grid = gridRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!grid || reduce) {
      setFilter(next);
      return;
    }

    pending.current = Flip.getState(grid.querySelectorAll(".proof"));
    setFilter(next);
  };

  useLayoutEffect(() => {
    if (!pending.current) return;

    const state = pending.current;
    pending.current = null;

    const tween = Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.02,
    });

    return () => {
      tween.kill();
    };
  }, [filter]);

  useEffect(() => {
    const query = filter === "All" ? "" : `?category=${categoryToSlug(filter)}`;
    window.history.replaceState(null, "", `${window.location.pathname}${query}`);
  }, [filter]);

  /* Development — each frame surfaces out of the paper as it is reached. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const frames = root.querySelectorAll<HTMLElement>("[data-develop]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      frames.forEach((frame) => frame.classList.add("is-developed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-developed");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    frames.forEach((frame) => io.observe(frame));
    return () => io.disconnect();
  }, [photographs]);

  /* The loupe — a 2.3× optic that follows the hand over a frame. */
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const grid = gridRef.current;
    const loupe = loupeRef.current;
    if (!grid || !loupe) return;

    let active: HTMLImageElement | null = null;
    let box: DOMRect | null = null;
    let x = 0;
    let y = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (!active || !box) return;

      loupe.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      loupe.style.backgroundSize = `${box.width * LOUPE_ZOOM}px ${
        box.height * LOUPE_ZOOM
      }px`;
      loupe.style.backgroundPosition = `${
        -(x - box.left) * LOUPE_ZOOM + LOUPE_SIZE / 2
      }px ${-(y - box.top) * LOUPE_ZOOM + LOUPE_SIZE / 2}px`;
    };

    const hide = () => {
      if (!active) return;
      active = null;
      box = null;
      loupe.dataset.active = "false";
      document.documentElement.classList.remove("loupe-on");
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const img = target
        ?.closest(".proof")
        ?.querySelector<HTMLImageElement>(".proof__img");

      if (!img) {
        hide();
        return;
      }

      if (img !== active) {
        active = img;
        box = img.getBoundingClientRect();
        loupe.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
        loupe.dataset.active = "true";
        document.documentElement.classList.add("loupe-on");
      }

      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onScroll = () => {
      if (!active) return;
      box = active.getBoundingClientRect();
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    grid.addEventListener("pointermove", onMove, { passive: true });
    grid.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", hide);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("loupe-on");
    };
  }, []);

  return (
    <div className="sheet__inner" ref={rootRef}>
      <div className="sheet__head" lang="en">
        <span>CONTACT SHEET · AQG ROLL 04</span>
        <span>35 MM · 400 TX · EDGE NO. 001—{String(total).padStart(3, "0")}</span>
        <span>DEVELOPER D-76 · 20°C · 9′00″</span>
      </div>

      <div
        className="sheet__index"
        role="group"
        aria-label="按类别筛选作品"
      >
        <span className="sheet__index-label" lang="en">
          SELECT
        </span>

        <button
          type="button"
          className="sheet__filter"
          aria-pressed={filter === "All"}
          onClick={() => applyFilter("All")}
        >
          ALL<i>{String(total).padStart(2, "0")}</i>
        </button>

        {categoriesWithCounts(counts).map(({ category, count }) => (
          <button
            key={category}
            type="button"
            className="sheet__filter"
            aria-pressed={filter === category}
            onClick={() => applyFilter(category)}
          >
            {category.toUpperCase()}
            <i>{String(count).padStart(2, "0")}</i>
          </button>
        ))}

        <span className="sheet__index-note" aria-live="polite" lang="en">
          {String(photographs.length).padStart(2, "0")} FRAMES IN VIEW
        </span>
      </div>

      <div ref={gridRef}>
        {strips.map((group, stripIndex) => {
          const partial = group.length < FRAMES_PER_STRIP;

          return (
            <div
              className={`strip-set${partial ? " strip-set--partial" : ""}`}
              key={group[0]?.slug ?? stripIndex}
              style={{ "--frames": group.length } as CSSProperties}
            >
              <div className="strip__slate" lang="en">
                <span>
                  STRIP {String(stripIndex + 1).padStart(2, "0")} /{" "}
                  {String(strips.length).padStart(2, "0")}
                </span>
                <span>
                  FRAME {frameNo(group[0])}
                  {group.length > 1
                    ? `—${frameNo(group[group.length - 1])}`
                    : ""}
                </span>
              </div>

              <div
                className={`strip${partial ? " strip--partial" : ""}`}
              >
                <div className="strip__frames">
                  {group.map((photo, index) => (
                    <Proof
                      key={photo.slug}
                      photo={photo}
                      printed={photo.slug === printed?.slug}
                      delay={(index % 4) * 70}
                    />
                  ))}
                </div>
              </div>

              <ol
                className={`strip__index${partial ? " strip__index--partial" : ""}`}
              >
                {group.map((photo) => {
                  const isPrint = photo.slug === printed?.slug;
                  return (
                    <li
                      key={photo.slug}
                      className={isPrint ? "is-print" : undefined}
                    >
                      <span className="strip__no">{frameNo(photo)}</span>
                      <span className="strip__title">{photo.title}</span>
                      {isPrint ? (
                        <i className="strip__flag">PRINT</i>
                      ) : (
                        <span className="strip__year">
                          {photo.year ?? "N.D."}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>

      {printed && cutFrames.length > 1 ? (
        <section
          className="cutscene"
          data-develop
          aria-labelledby="cut-title"
          style={{ "--cut": cutIndex < 0 ? 0.75 : cutAt / 100 } as CSSProperties}
        >
          <div className="cutscene__band" aria-hidden="true">
            <span className="cutscene__perfs" />
            <div className="cutscene__roll">
              {cutFrames.map((photo, index) => (
                <span
                  key={photo.slug}
                  className={`cutscene__cell${
                    photo.slug === printed.slug ? " is-chosen" : ""
                  }${
                    index === cutFrames.length - 1 ? " cutscene__tail" : ""
                  }`}
                >
                  <Image
                    src={photo.image.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 40vw, 24vw"
                    style={{ objectFit: "cover" }}
                  />
                </span>
              ))}
            </div>
            <span className="cutscene__perfs" />
          </div>

          <span className="cutscene__blade" aria-hidden="true" />
          <span className="cutscene__flash" aria-hidden="true" />

          <div className="wrap cutscene__copy">
            <span className="cutscene__meta" lang="en">
              FRAME {frameNo(printed)} · {printed.title} · CUT &amp; PRINT
            </span>
            <h2 id="cut-title" className="cutscene__title" lang="en">
              THE <em>CUT.</em>
            </h2>
            <p className="cutscene__note">
              红笔圈出的那一格，从这里剪下。断口另一头留在桌上，这一格被放大成一张真正的照片。
            </p>
          </div>
        </section>
      ) : null}

      {printed ? (
        <figure className="enlargement" data-develop>
          <div className="enlargement__print">
            <div className="enlargement__window">
              <Image
                className="enlargement__img"
                src={printed.image.src}
                alt={printed.image.alt}
                fill
                sizes="(max-width: 1023px) 92vw, 46vw"
                style={{ objectFit: "cover" }}
              />
              <span className="enlargement__emulsion" aria-hidden="true" />
            </div>

            <span className="stamp" aria-hidden="true" lang="en">
              PROOF · APPROVED
              <small>AQG / 2026</small>
            </span>
          </div>

          <figcaption className="enlargement__caption">
            <span className="enlargement__label" lang="en">
              ENLARGEMENT · 8 × 10 IN · FIBRE PAPER
            </span>

            <h2 className="enlargement__title" lang="en">
              {printed.title}
            </h2>

            <p className="enlargement__note">{printed.curatorNote}</p>

            <div className="enlargement__data" lang="en">
              <span>{printed.plate}</span>
              <span>{printed.year ?? "N.D."}</span>
              <span>{printed.category.join(" / ")}</span>
            </div>

            <Link className="linkline" href={`/work/${printed.slug}/`}>
              查看完整档案
            </Link>
          </figcaption>
        </figure>
      ) : null}

      <div className="sheet__log" lang="en">
        <span>FIXER 5′00″ · WASH 20′ · LINE DRY</span>
        <span>ALL FRAMES · EDITORIAL STUDY COPY</span>
        <span>SHEET 01 OF 01 · DO NOT CUT</span>
      </div>

      <div className="loupe" ref={loupeRef} data-active="false" aria-hidden="true">
        <span className="loupe__readout" lang="en">
          {LOUPE_ZOOM}× LOUPE
        </span>
      </div>
    </div>
  );
}

function categoriesWithCounts(
  counts: { category: Category; count: number }[]
): { category: Category; count: number }[] {
  return CATEGORIES.map(
    (category) =>
      counts.find((entry) => entry.category === category) ?? {
        category,
        count: 0,
      }
  );
}
