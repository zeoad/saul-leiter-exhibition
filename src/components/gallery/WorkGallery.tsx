"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Figure from "@/components/ui/Figure";
import {
  categoryFromSlug,
  categoryToSlug,
  displayYear,
  getAllPhotographs,
  getCategoryCounts,
  getLightboxCaption,
  getPhotographsByCategory,
  getOrientation,
} from "@/lib/gallery";
import type { Category } from "@/types";

type Filter = "All" | Category;

export default function WorkGallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const [ready, setReady] = useState(false);

  const counts = useMemo(() => getCategoryCounts(), []);
  const total = useMemo(() => getAllPhotographs().length, []);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "category"
    );

    if (requested) {
      const match = categoryFromSlug(requested);
      if (match) setFilter(match);
    }

    setReady(true);
  }, []);

  const photographs = useMemo(() => {
    if (filter === "All") return getAllPhotographs();
    return getPhotographsByCategory(filter);
  }, [filter]);

  const applyFilter = (next: Filter) => {
    setFilter(next);
    const query = next === "All" ? "" : `?category=${categoryToSlug(next)}`;
    window.history.replaceState(null, "", `${window.location.pathname}${query}`);
  };

  return (
    <div className="work-gallery__inner">
      <div className="work-toolbar">
        <div className="work-toolbar__filters" role="group" aria-label="按类别筛选作品">
          <button
            type="button"
            className="chip"
            aria-pressed={filter === "All"}
            onClick={() => applyFilter("All")}
          >
            ALL
            <span className="chip__count">{total}</span>
          </button>

          {counts.map(({ category, count }) => (
            <button
              key={category}
              type="button"
              className="chip"
              aria-pressed={filter === category}
              onClick={() => applyFilter(category)}
            >
              {category.toUpperCase()}
              <span className="chip__count">{count}</span>
            </button>
          ))}
        </div>

        <p className="work-toolbar__count meta" aria-live="polite">
          {String(photographs.length).padStart(2, "0")} / {String(total).padStart(2, "0")} PLATES
        </p>
      </div>

      <div
        className={`work-grid ${ready ? "is-ready" : ""}`}
        aria-busy={!ready}
      >
        {photographs.map((photo) => {
          const orientation = getOrientation(photo);

          return (
            <article className="plate-card" key={photo.slug}>
              <Figure
                className="plate-card__figure"
                src={photo.image.src}
                alt={photo.image.alt}
                width={photo.image.width}
                height={photo.image.height}
                ratio={
                  orientation === "portrait"
                    ? "4 / 5"
                    : orientation === "square"
                      ? "1 / 1"
                      : "3 / 2"
                }
                title={photo.title}
                meta={`${photo.category.join(" · ")} · ${displayYear(photo)}`}
                index={photo.plate}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 48vw, 31vw"
                note={
                  <span className="plate-card__actions">
                    <Link
                      href={`/work/${photo.slug}/`}
                      className="works__detail-link"
                    >
                      作品详情 ↗
                    </Link>
                    <span className="plate-card__id meta">{photo.id}</span>
                  </span>
                }
                lightbox={{ caption: getLightboxCaption(photo) }}
              />
            </article>
          );
        })}
      </div>

      {photographs.length === 0 ? (
        <div className="work-empty">
          <p className="display display--md">No plates in this category.</p>
          <button type="button" className="link-line" onClick={() => applyFilter("All")}>
            查看全部作品
          </button>
        </div>
      ) : null}
    </div>
  );
}
