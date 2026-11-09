"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
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
  getUsageLabel,
} from "@/lib/gallery";
import type { Category } from "@/types";

gsap.registerPlugin(Flip);

type Filter = "All" | Category;

const LAYOUTS = [
  "work-card--banner",
  "work-card--wide work-card--tall",
  "work-card--wide work-card--square",
  "work-card--wide work-card--land",
  "work-card--wide work-card--tall",
  "work-card--wide work-card--square",
  "work-card--wide work-card--land",
  "work-card--wide work-card--tall",
];

function layoutFor(index: number): string {
  if (index === 0) return LAYOUTS[0];
  if (index === 9) return LAYOUTS[0];
  return LAYOUTS[1 + ((index - 1) % 7)];
}

/**
 * /work — the register, arranged as a wall of plates.
 * Filtering is animated with Flip, so each print keeps its identity while
 * the wall recomposes around it.
 */
export default function WorkIndex() {
  const gridRef = useRef<HTMLDivElement>(null);
  const pending = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [ready, setReady] = useState(false);

  const total = getAllPhotographs().length;
  const counts = useMemo(() => getCategoryCounts(), []);

  const photographs = useMemo(
    () =>
      filter === "All"
        ? getAllPhotographs()
        : getPhotographsByCategory(filter),
    [filter]
  );

  /* Deep links such as /work/?category=obstruction */
  useLayoutEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "category"
    );
    const match = requested ? categoryFromSlug(requested) : null;
    if (match) setFilter(match);
    setReady(true);
  }, []);

  const applyFilter = (next: Filter) => {
    const grid = gridRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!grid || reduce) {
      setFilter(next);
      return;
    }

    pending.current = Flip.getState(
      grid.querySelectorAll(".work-card")
    );

    setFilter(next);

    const query = next === "All" ? "" : `?category=${categoryToSlug(next)}`;
    window.history.replaceState(null, "", `${window.location.pathname}${query}`);
  };

  useLayoutEffect(() => {
    if (!pending.current) return;

    const state = pending.current;
    pending.current = null;

    const animation = Flip.from(state, {
      duration: 0.62,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.035,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.94, y: 26 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.04,
          }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.94,
          duration: 0.4,
          ease: "power2.in",
        }),
    });

    return () => {
      animation.kill();
    };
  }, [filter]);

  return (
    <>
      <div className="work-bar">
        <div
          className="work-bar__filters"
          role="group"
          aria-label="按类别筛选作品"
        >
          <button
            type="button"
            className="work-filter"
            aria-pressed={filter === "All"}
            onClick={() => applyFilter("All")}
          >
            ALL / {total}
          </button>
          {categoriesWithCounts(counts).map(({ category, count }) => (
            <button
              key={category}
              type="button"
              className="work-filter"
              aria-pressed={filter === category}
              onClick={() => applyFilter(category)}
            >
              {category.toUpperCase()} / {count}
            </button>
          ))}
        </div>

        <span className="work-bar__count" aria-live="polite">
          <b>{String(photographs.length).padStart(2, "0")}</b>
          {ready ? "PLATES IN VIEW" : "LOADING"}
        </span>
      </div>

      <div ref={gridRef} className="work-grid">
        {photographs.map((photo, index) => (
          <Link
            key={photo.slug}
            href={`/work/${photo.slug}/`}
            className={`work-card ${layoutFor(index)}`}
            data-cursor="view"
          >
            <span className="work-card__frame">
              <Image
                src={photo.image.src}
                alt={photo.image.alt}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1023px) 50vw, 36vw"
                style={{ objectFit: "cover" }}
              />
              <span className="work-card__veil" aria-hidden="true">
                <span>OPEN PLATE</span>
              </span>
              <span className="work-card__no" aria-hidden="true">
                {photo.plate.replace("PL. ", "")}
              </span>
            </span>

            <span className="work-card__info">
              <b className="work-card__title">{photo.title}</b>
              <span className="work-card__meta">
                {photo.year ?? "N.D."} · {getUsageLabel(photo.usage)}
              </span>
            </span>

            <span className="work-card__note">{photo.description}</span>
          </Link>
        ))}
      </div>
    </>
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
