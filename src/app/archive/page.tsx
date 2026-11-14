import type { Metadata } from "next";

import ArchiveExperience from "@/components/gallery/ArchiveExperience";
import ArchiveOverture from "@/components/gallery/ArchiveOverture";
import { getAllPhotographs, getCategoryCounts, getPhotographBySlug } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";
import type { Photograph } from "@/types";

export const metadata: Metadata = createPageMetadata({
  title: "Archive — Digital Image Index",
  description:
    "数字摄影档案：按标题、编号、类别与年份检索 16 幅索尔·雷特作品，查看缩略图、来源、年份与版权状态。",
  path: "/archive/",
});

export default function ArchivePage() {
  const total = getAllPhotographs().length;
  const categories = getCategoryCounts().length;
  const drawer = ["red-curtain", "mirrors", "taxi", "rain", "blue-skirt"]
    .map((slug) => getPhotographBySlug(slug))
    .filter((photo): photo is Photograph => Boolean(photo));

  return (
    <>
      <ArchiveOverture photos={drawer} plates={total} categories={categories} />

      <section className="archive tone-dark" aria-label="数字档案索引">
        <div className="wrap">
          <ArchiveExperience plates={total} categories={categories} />
        </div>
      </section>
    </>
  );
}
