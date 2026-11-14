import type { Metadata } from "next";
import { Fragment } from "react";

import "@/styles/vision.css";
import VisionAct from "@/components/vision/VisionAct";
import VisionChangeover from "@/components/vision/VisionChangeover";
import VisionHero from "@/components/vision/VisionHero";
import VisionOutro from "@/components/vision/VisionOutro";
import VisionTrack from "@/components/vision/VisionTrack";
import { chapters } from "@/data/chapters";
import { getPhotographBySlug } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";
import type { Category, Photograph } from "@/types";

export const metadata: Metadata = createPageMetadata({
  title: "The Vision — Four Ways of Looking",
  description:
    "深入索尔·雷特的视觉语言：色彩、遮挡、雨雪与日常。四个章节，四块满屏的表面，移动光标，表面会为你让开。",
  path: "/vision/",
});

const chapterCategory: Record<string, Category> = {
  color: "Color",
  obstruction: "Obstruction",
  "rain-and-snow": "Rain & Snow",
  "the-ordinary": "Street Life",
};

const chapterTone: Record<string, string> = {
  ink: "tone-dark",
  paper: "tone-paper",
  "paper-dark": "tone-paper-deep",
  teal: "tone-teal",
};

/** What covers the print in each act — the surface answers the pointer. */
const chapterVariant = {
  color: "color",
  obstruction: "glass",
  "rain-and-snow": "weather",
  "the-ordinary": "ordinary",
} as const;

const COLOR_SWATCHES = [
  { name: "GREY GREEN", hex: "#6E7566" },
  { name: "OCHRE", hex: "#C9A97A" },
  { name: "VERMILION", hex: "#B3462E" },
];

export default function VisionPage() {
  const hero = getPhotographBySlug("mirrors");

  return (
    <>
      {hero ? <VisionHero photo={hero} /> : null}

      <VisionTrack />

      {chapters.map((chapter, index) => {
        const photo = getPhotographBySlug(chapter.heroWork);
        if (!photo) return null;

        return (
          <Fragment key={chapter.id}>
            {index > 0 ? (
              <VisionChangeover
                number={chapter.number}
                kicker={chapter.kicker}
                titleCn={chapter.titleCn}
              />
            ) : null}

            <VisionAct
              chapter={chapter}
              photo={photo}
              index={index}
              variant={chapterVariant[chapter.id as keyof typeof chapterVariant]}
              toneClass={chapterTone[chapter.theme] ?? "tone-paper"}
              category={chapterCategory[chapter.id]}
              swatches={chapter.id === "color" ? COLOR_SWATCHES : undefined}
              strip={
                chapter.id === "the-ordinary"
                  ? chapter.works
                      .map((slug) => getPhotographBySlug(slug))
                      .filter((item): item is Photograph => Boolean(item))
                      .slice(0, 5)
                  : undefined
              }
            />
          </Fragment>
        );
      })}

      <VisionOutro />
    </>
  );
}
