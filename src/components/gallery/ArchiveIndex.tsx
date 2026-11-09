"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import {
  CATEGORIES,
  displayYear,
  getAllPhotographs,
  getCategoryCounts,
} from "@/lib/gallery";
import type { Category, Photograph } from "@/types";

type Filter = "All" | Category;

/**
 * /archive — the register, searched like a contact sheet.
 * Every row answers the pointer with the plate itself, so the index never
 * becomes a list of text only.
 */
export default function ArchiveIndex() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [preview, setPreview] = useState<Photograph | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => getCategoryCounts(), []);
  const total = getAllPhotographs().length;

  const photographs = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return getAllPhotographs().filter((photo) => {
      const inCategory =
        filter === "All" || photo.category.includes(filter);
      if (!inCategory) return false;
      if (!needle) return true;

      const haystack = [
        photo.title,
        photo.titleCn ?? "",
        photo.plate,
        photo.year ?? "",
        photo.category.join(" "),
        photo.id,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [query, filter]);

  const movePreview = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const node = previewRef.current;
    if (!node) return;

    const width = node.offsetWidth || 220;
    const flip = event.clientX + width + 36 > window.innerWidth;

    node.style.left = `${flip ? event.clientX - width - 20 : event.clientX + 20}px`;
    node.style.top = `${event.clientY}px`;
  };

  return (
    <>
      <div className="archive__head">
        <h1 className="display" lang="en">
          THE
          <br />
          <em>ARCHIVE.</em>
        </h1>

        <div className="archive__tools">
          <label className="archive__search">
            <Search aria-hidden="true" strokeWidth={1.5} />
            <input
              type="search"
              value={query}
              placeholder="SEARCH TITLE / PLATE / YEAR"
              aria-label="搜索档案"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <span className="archive__count" aria-live="polite">
            {String(photographs.length).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")} ENTRIES
          </span>
        </div>
      </div>

      <div className="archive__filters" role="group" aria-label="按类别筛选">
        <button
          type="button"
          className="archive__filter"
          aria-pressed={filter === "All"}
          onClick={() => setFilter("All")}
        >
          ALL / {total}
        </button>
        {CATEGORIES.map((category) => {
          const count =
            counts.find((entry) => entry.category === category)?.count ?? 0;
          return (
            <button
              key={category}
              type="button"
              className="archive__filter"
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category.toUpperCase()} / {count}
            </button>
          );
        })}
      </div>

      <div className="archive__rows">
        {photographs.length ? (
          photographs.map((photo) => (
            <Link
              key={photo.slug}
              href={`/work/${photo.slug}/`}
              className="archive__row"
              onPointerEnter={() => setPreview(photo)}
              onPointerLeave={() => setPreview(null)}
              onPointerMove={movePreview}
              onFocus={() => setPreview(photo)}
              onBlur={() => setPreview(null)}
              data-cursor="view"
              data-cursor-label="OPEN ENTRY"
            >
              <span className="archive__row-no">{photo.plate}</span>
              <span className="archive__row-title">
                {photo.title}
                {photo.titleCn ? (
                  <span className="archive__row-cn">{photo.titleCn}</span>
                ) : null}
              </span>
              <span className="archive__row-year">{displayYear(photo)}</span>
              <span className="archive__row-cat">
                {photo.category.join(" / ")}
              </span>
              <span className="archive__row-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))
        ) : (
          <p className="archive__empty">
            NO ENTRIES MATCH “{query}” — TRY ANOTHER WORD.
          </p>
        )}
      </div>

      <div
        ref={previewRef}
        className="archive__preview"
        data-show={preview ? "true" : "false"}
        aria-hidden="true"
      >
        {preview ? (
          <Image
            src={preview.image.src}
            alt=""
            fill
            sizes="260px"
          />
        ) : null}
      </div>
    </>
  );
}
