import type { Metadata } from "next";

import IntroSequence from "@/components/animation/IntroSequence";
import ChapterRail from "@/components/layout/ChapterRail";
import BehindGlass from "@/components/home/BehindGlass";
import Closing from "@/components/home/Closing";
import ColorLanguage from "@/components/home/ColorLanguage";
import Cover from "@/components/home/Cover";
import LifePreview from "@/components/home/LifePreview";
import NewYork from "@/components/home/NewYork";
import OpeningStatement from "@/components/home/OpeningStatement";
import PaintersEye from "@/components/home/PaintersEye";
import RainSnow from "@/components/home/RainSnow";
import SelectedWorks from "@/components/home/SelectedWorks";
import TheOrdinary from "@/components/home/TheOrdinary";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Saul Leiter — A Quiet Gaze | 静默的凝视",
  description:
    "进入索尔·雷特的观看方式：从纽约街头、色彩与遮挡，到雨雪和日常。十一个章节的独立线上摄影展览。",
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
      <OpeningStatement />
      <NewYork />
      <ColorLanguage />
      <BehindGlass />
      <RainSnow />
      <TheOrdinary />
      <PaintersEye />
      <SelectedWorks />
      <LifePreview />
      <Closing />
    </>
  );
}
