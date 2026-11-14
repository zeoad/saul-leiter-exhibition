import type { Metadata } from "next";

import IntroSequence from "@/components/animation/IntroSequence";
import ChapterRail from "@/components/layout/ChapterRail";
import Closing from "@/components/home/Closing";
import Cover from "@/components/home/Cover";
import Programme from "@/components/home/Programme";
import "@/styles/home.css";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Saul Leiter — A Quiet Gaze | 静默的凝视",
  description:
    "进入索尔·雷特的观看方式：封面之后是四道门——作品、视觉语言、生平与数字档案。先选一间，再往下走。",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Saul Leiter — A Quiet Gaze",
  alternateName: "静默的凝视：在日常中发现诗意",
  url: SITE_URL,
  description:
    "An independent editorial exhibition on Saul Leiter's visual language: color, obstruction, weather and the ordinary.",
  inLanguage: ["zh-Hans", "en"],
  about: {
    "@type": "Person",
    name: "Saul Leiter",
    birthDate: "1923-12-03",
    deathDate: "2013-11-26",
    jobTitle: "Photographer and painter",
  },
  publisher: {
    "@type": "Organization",
    name: "A QUIET GAZE Editorial Team",
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <IntroSequence />
      <ChapterRail />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Cover />
      <Programme />
      <Closing />
    </>
  );
}
