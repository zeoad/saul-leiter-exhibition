"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import {
  CATEGORIES,
  displayYear,
  getAllPhotographs,
  getCategoryCounts,
} from "@/lib/gallery";
import type { Category } from "@/types";

type Filter = "All" | Category;

/**
 * LIST — the archive read as a card catalogue.
 *
 * The header always names the entry under the pointer (or the first result),
 * the rows behave like a register, and a print of the current entry sits on the
 * right. Search and category filters stay, because this is the view people use
 * to look something up.
 */
export default function ArchiveList() {
  const all = useMemo(() => getAllPhotographs(), []);
  const counts = useMemo(() => getCategoryCounts(), []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const photographs = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return all.filter((photo) => {
      if (filter !== "All" && !photo.category.includes(filter)) return false;
      if (!needle) return true;

      return [
        photo.title,
        photo.titleCn ?? "",
        photo.plate,
        photo.year ?? "",
        photo.category.join(" "),
        photo.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [all, filter, query]);

  const current =
    photographs.find((photo) => photo.slug === hovered) ??
    photographs[0] ??
    all[0];

  return (
    <div className="arch-list">
      <header className="arch-list__head">
        <div className="arch-list__title">
          <span className="arch-list__kicker" lang="en">
            SAUL LEITER · {current.plate}
          </span>
          <h2 className="display" lang="en">
            {current.title}
          </h2>
          {current.titleCn ? (
            <p className="arch-list__cn">{current.titleCn}</p>
          ) : null}
        </div>
        <span className="arch-list__year" lang="en">
          {displayYear(current)}
        </span>
      </header>

      <div className="arch-list__tools">
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
          {String(all.length).padStart(2, "0")} ENTRIES
        </span>
      </div>

      <div className="archive__filters" role="group" aria-label="按类别筛选">
        <button
          type="button"
          className="archive__filter"
          aria-pressed={filter === "All"}
          onClick={() => setFilter("All")}
        >
          ALL / {all.length}
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

      <div className="arch-list__body">
        <div
          className="archive__rows"
          onPointerLeave={() => setHovered(null)}
        >
          {photographs.length ? (
            photographs.map((photo, index) => (
              <Link
                key={photo.slug}
                href={`/work/${photo.slug}/`}
                className="archive__row"
                data-active={photo.slug === current.slug}
                onPointerEnter={() => setHovered(photo.slug)}
                onFocus={() => setHovered(photo.slug)}
                onBlur={() => setHovered(null)}
                data-cursor="view"
                data-cursor-label="OPEN ENTRY"
              >
                <span className="archive__row-no" lang="en">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="archive__row-title">
                  {photo.title}
                  {photo.titleCn ? (
                    <span className="archive__row-cn">{photo.titleCn}</span>
                  ) : null}
                </span>
                <span className="archive__row-cat">
                  {photo.category.join(" / ")}
                </span>
                <span className="archive__row-year" lang="en">
                  {displayYear(photo)}
                </span>
                <span className="archive__row-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))
          ) : (
            <p className="archive__empty">
              NO ENTRIES MATCH “{query || filter.toUpperCase()}” — TRY ANOTHER
              WORD.
            </p>
          )}
        </div>

        <figure className="arch-list__plate" aria-hidden="true">
          <span className="arch-list__print">
            <Image
              key={current.slug}
              src={current.image.src}
              alt=""
              fill
              sizes="(max-width: 1023px) 1px, 320px"
            />
          </span>
          <figcaption lang="en">{current.plate}</figcaption>
        </figure>
      </div>
    </div>
  );
}
