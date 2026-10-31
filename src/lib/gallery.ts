import { photographs } from "@/data/photographs";
import type { Category, Photograph } from "@/types";

export const CATEGORIES: Category[] = [
  "Color",
  "Obstruction",
  "Rain & Snow",
  "Street Life",
  "Portrait",
  "Abstract",
];

export function getAllPhotographs(): Photograph[] {
  return photographs;
}

export function getFeaturedPhotographs(): Photograph[] {
  return photographs.filter((photo) => photo.featured);
}

export function getPhotographBySlug(slug: string): Photograph | undefined {
  return photographs.find((photo) => photo.slug === slug);
}

export function getPhotographsBySlugs(slugs: string[]): Photograph[] {
  return slugs
    .map((slug) => getPhotographBySlug(slug))
    .filter((photo): photo is Photograph => Boolean(photo));
}

export function getPhotographsByCategory(category: Category): Photograph[] {
  return photographs.filter((photo) => photo.category.includes(category));
}

export function getCategoryCounts(): { category: Category; count: number }[] {
  return CATEGORIES.map((category) => ({
    category,
    count: getPhotographsByCategory(category).length,
  }));
}

export function getAdjacentPhotographs(slug: string): {
  previous: Photograph;
  next: Photograph;
} {
  const index = photographs.findIndex((photo) => photo.slug === slug);
  const safeIndex = index === -1 ? 0 : index;
  const total = photographs.length;

  return {
    previous: photographs[(safeIndex - 1 + total) % total],
    next: photographs[(safeIndex + 1) % total],
  };
}

export function getRelatedPhotographs(
  photograph: Photograph,
  limit = 3
): Photograph[] {
  const scored = photographs
    .filter((candidate) => candidate.slug !== photograph.slug)
    .map((candidate) => ({
      candidate,
      score: candidate.category.filter((category) =>
        photograph.category.includes(category)
      ).length,
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.candidate);
}

/** Only documented years are returned; approximations are kept verbatim. */
export function getVerifiedYears(): string[] {
  return Array.from(
    new Set(
      photographs
        .map((photo) => photo.year)
        .filter((year): year is string => Boolean(year))
    )
  ).sort((a, b) => {
    const first = Number(a.match(/\d+/)?.[0] ?? 0);
    const second = Number(b.match(/\d+/)?.[0] ?? 0);
    return first - second || a.localeCompare(b);
  });
}

export function getDatedCount(): number {
  return photographs.filter((photo) => Boolean(photo.year)).length;
}

/** Standard caption used by the site-wide PhotoSwipe instance. */
export function getLightboxCaption(photo: Photograph): string {
  const date = photo.year ? `, ${photo.year}` : "";
  return `${photo.title}${date} — Saul Leiter. © Estate of Saul Leiter. Image source: Saul Leiter Foundation. Editorial study copy.`;
}

export function getUsageLabel(usage: Photograph["usage"]): string {
  if (usage === "licensed") return "LICENSED";
  if (usage === "placeholder") return "PLACEHOLDER";
  return "STUDY COPY";
}

/** Ratio used when a work is cropped to a consistent magazine shape. */
export function getDisplayRatio(photo: Photograph): string {
  const orientation = getOrientation(photo);
  if (orientation === "portrait") return "4 / 5";
  if (orientation === "square") return "1 / 1";
  return "3 / 2";
}

export function getOrientation(
  photograph: Photograph
): "portrait" | "landscape" | "square" {
  const { width, height } = photograph.image;
  if (width === height) return "square";
  return width > height ? "landscape" : "portrait";
}

export function displayYear(photograph: Photograph): string {
  return photograph.year ?? "N.D.";
}

export function getPlateCountLabel(): string {
  return `${String(photographs.length).padStart(2, "0")} PLATES`;
}

/** URL-safe category token used by filters and deep links. */
export function categoryToSlug(category: Category): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/\s+/g, "-");
}

export function categoryFromSlug(value: string): Category | null {
  return (
    CATEGORIES.find((category) => categoryToSlug(category) === value) ?? null
  );
}
