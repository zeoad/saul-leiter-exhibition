"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

import {
  displayYear,
  getAllPhotographs,
  getCategoryCounts,
  getLightboxCaption,
  getUsageLabel,
  getVerifiedYears,
} from "@/lib/gallery";
import type { Category, Photograph } from "@/types";

type CategoryFilter = "All" | Category;
type SortMode = "plate" | "title";

const allPhotographs = getAllPhotographs();
const verifiedYears = getVerifiedYears();

function matchesQuery(photo: Photograph, needle: string) {
  if (!needle) return true;

  const haystack = [
    photo.title,
    photo.titleCn ?? "",
    photo.id,
    photo.plate,
    photo.slug,
    photo.category.join(" "),
    photo.description,
    photo.source ?? "",
    photo.credit ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

export default function ArchiveExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState<SortMode>("plate");

  const counts = useMemo(() => getCategoryCounts(), []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return allPhotographs
      .filter((photo) => {
        const categoryMatch =
          category === "All" || photo.category.includes(category);
        const yearMatch = year === "All" || photo.year === year;

        return categoryMatch && yearMatch && matchesQuery(photo, needle);
      })
      .sort((a, b) =>
        sort === "plate"
          ? a.plate.localeCompare(b.plate)
          : a.title.localeCompare(b.title)
      );
  }, [query, category, year, sort]);

  const isFiltered =
    query.trim().length > 0 || category !== "All" || year !== "All";

  const reset = () => {
    setQuery("");
    setCategory("All");
    setYear("All");
    setSort("plate");
  };

  return (
    <div className="archive-explorer">
      <div className="archive-controls">
        <label className="archive-search">
          <Search aria-hidden="true" strokeWidth={1.5} />
          <span className="sr-only">搜索作品</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、编号或关键词…"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="archive-search__clear"
              aria-label="清除搜索"
              onClick={() => setQuery("")}
            >
              <X aria-hidden="true" strokeWidth={1.5} />
            </button>
          ) : null}
        </label>

        <div className="archive-filters" role="group" aria-label="按类别筛选">
          <button
            type="button"
            className="chip"
            aria-pressed={category === "All"}
            onClick={() => setCategory("All")}
          >
            ALL
            <span className="chip__count">{allPhotographs.length}</span>
          </button>
          {counts.map(({ category: item, count }) => (
            <button
              key={item}
              type="button"
              className="chip"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item.toUpperCase()}
              <span className="chip__count">{count}</span>
            </button>
          ))}
        </div>

        <div className="archive-selects">
          <label className="archive-select">
            <span className="meta">YEAR</span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              disabled={verifiedYears.length === 0}
              aria-describedby="year-filter-note"
            >
              <option value="All">ALL YEARS</option>
              {verifiedYears.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="archive-select">
            <span className="meta">SORT</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
            >
              <option value="plate">PLATE NO.</option>
              <option value="title">TITLE A–Z</option>
            </select>
          </label>
        </div>
      </div>

      <p id="year-filter-note" className="archive-hint">
        {verifiedYears.length === 0
          ? "年份筛选暂未启用：当前作品没有可靠的创作年份。"
          : `按作品年份筛选（${verifiedYears.length} 个标注；约数与区间保持原样）。`}
      </p>

      <div className="archive-toolbar">
        <p className="meta" aria-live="polite">
          {String(results.length).padStart(2, "0")} ENTRIES
          {isFiltered ? " / FILTERED" : " / COMPLETE REGISTER"}
        </p>

        {isFiltered ? (
          <button type="button" className="archive-reset" onClick={reset}>
            清除筛选
          </button>
        ) : (
          <span className="meta">PLATES AQG-001 — AQG-016</span>
        )}
      </div>

      <div className="archive-table" role="list">
        <div className="archive-table__head" aria-hidden="true">
          <span>NO.</span>
          <span>PLATE</span>
          <span>TITLE / CATEGORY</span>
          <span>YEAR</span>
          <span>STATUS</span>
          <span>VIEW</span>
        </div>

        {results.map((photo) => (
          <article className="archive-row" role="listitem" key={photo.slug}>
            <span className="archive-row__no meta">{photo.id}</span>

            <a
              className="archive-thumb"
              href={photo.image.src}
              data-pswp-lightbox
              data-pswp-width={photo.image.width}
              data-pswp-height={photo.image.height}
              data-pswp-caption={getLightboxCaption(photo)}
              aria-label={`打开大图 — ${photo.title}`}
            >
              <Image
                src={photo.image.src}
                alt=""
                width={160}
                height={120}
                sizes="120px"
              />
            </a>

            <div className="archive-row__title">
              <Link href={`/work/${photo.slug}/`}>
                <span className="archive-row__name">{photo.title}</span>
              </Link>
              <span className="archive-row__meta">
                {photo.plate} · {photo.category.join(" / ")}
              </span>
            </div>

            <span className="archive-row__year meta">
              {displayYear(photo)}
            </span>

            <span className="archive-row__status">
              <span className="tag tag--accent">
                {getUsageLabel(photo.usage)}
              </span>
              <span className="archive-row__source">
                {photo.credit ?? photo.source}
              </span>
            </span>

            <Link
              className="archive-row__open"
              href={`/work/${photo.slug}/`}
              aria-label={`查看 ${photo.title} 的作品档案`}
            >
              OPEN ↗
            </Link>
          </article>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="archive-empty">
          <p className="display display--md">No plates found.</p>
          <p>没有符合条件的作品。试着减少关键词，或清除筛选。</p>
          <button type="button" className="link-line" onClick={reset}>
            重置检索
          </button>
        </div>
      ) : null}

      <noscript>
        <p className="archive-hint">
          搜索与筛选需要启用 JavaScript。完整作品列表仍可通过作品集页面浏览。
        </p>
      </noscript>
    </div>
  );
}
