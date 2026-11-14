/**
 * Shared domain types for the A QUIET GAZE exhibition.
 * Every page reads from the same typed data layer (src/data).
 */

export type Category =
  | "Color"
  | "Obstruction"
  | "Rain & Snow"
  | "Street Life"
  | "Portrait"
  | "Abstract";

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * A single plate in the exhibition.
 *
 * `usage` records the rights status honestly:
 *  - "editorial-study": real work, reproduced without a commercial licence
 *  - "licensed": a licence has been obtained
 *  - "placeholder": a stand-in asset, not a work by the artist
 */
export type UsageStatus = "editorial-study" | "licensed" | "placeholder";

export type Photograph = {
  id: string;
  slug: string;
  plate: string;
  title: string;
  titleCn?: string;
  /** Only set when a reliable publication date is known. */
  year?: string;
  /** Explains approximate or uncertain dating, shown in the UI. */
  yearNote?: string;
  category: Category[];
  description: string;
  curatorNote: string;
  image: ImageAsset;
  source?: string;
  sourceUrl?: string;
  credit?: string;
  rights?: string;
  usage: UsageStatus;
  featured: boolean;
};

export type VisionTheme = "paper" | "paper-dark" | "ink" | "teal";

export type VisionChapter = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  titleCn: string;
  standfirst: string;
  intro: string[];
  quote: string;
  quoteNote: string;
  analysis: { label: string; body: string }[];
  detailNote: string;
  works: string[];
  hero: ImageAsset;
  /** Slug of the photograph used as this chapter's key visual. */
  heroWork: string;
  theme: VisionTheme;
};

export type TimelineKind = "life" | "work" | "publication" | "exhibition";

export type TimelineEvent = {
  year: string;
  sortYear: number;
  title: string;
  titleCn: string;
  body: string;
  kind: TimelineKind;
  highlight?: boolean;
  source?: { label: string; href: string };
};

export type NavLink = {
  label: string;
  href: string;
  index: string;
};
