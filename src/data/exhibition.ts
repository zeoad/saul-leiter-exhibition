import type { NavLink } from "@/types";

export const site = {
  name: "SAUL LEITER",
  subtitle: "A QUIET GAZE",
  titleCn: "静默的凝视：在日常中发现诗意",
  edition: "AN INDEPENDENT DIGITAL EXHIBITION",
  season: "2026 EDITION",
  years: "1923 — 2013",
  city: "NEW YORK / ONLINE",
  curator: "CURATED BY THE A QUIET GAZE EDITORIAL TEAM",
  description:
    "一场关于索尔·雷特的独立线上摄影展：从色彩、遮挡、雨雪到日常，进入他安静而持久的观看方式。",
  disclaimer:
    "这是一个独立的编辑性学习展览项目，不是索尔·雷特的官方网站，也不代表摄影师本人、索尔·雷特基金会或任何版权方的授权。",
  assetNotice:
    "展览中的摄影作品由索尔·雷特创作，版权归 Estate of Saul Leiter 所有。本站以非商业的编辑性研究方式呈现这些作品，未获遗产管理方或 Saul Leiter Foundation 的授权；任何公开或商业使用前须取得许可。",
  rightsLine:
    "© Estate of Saul Leiter. Images: Saul Leiter Foundation. All rights reserved.",
} as const;

export const navLinks: NavLink[] = [
  { label: "THE WORK", href: "/work/", index: "01" },
  { label: "THE VISION", href: "/vision/", index: "02" },
  { label: "THE LIFE", href: "/life/", index: "03" },
  { label: "ARCHIVE", href: "/archive/", index: "04" },
];

export const painterPoints = [
  {
    label: "01 / SURFACE",
    body: "绘画教会他信任平面。照片不必制造纵深，色块本身就可以构成空间。",
  },
  {
    label: "02 / EDITING",
    body: "像调整画面一样调整构图：删掉多余的东西，只留下颜色之间的关系。",
  },
  {
    label: "03 / PERMISSION",
    body: "绘画不要求叙事，摄影也不必。他从未觉得照片需要解释自己。",
  },
];

/**
 * The two pieces of curatorial copy that outlived the long home page:
 * the painter's-eye essay now closes `/vision`, and the closing line
 * rests under LOOK AGAIN.
 */
export const homeCopy = {
  painter: {
    standfirst: "摄影是他的第二语言，绘画才是母语。",
    paragraphs: [
      "在成为摄影师之前，雷特想成为画家。他到纽约的初衷是画画，相机是后来才出现的。这个顺序很重要：他不是用摄影模仿绘画，而是始终用绘画的方式思考画面。",
      "他一生都在画画。工作室里堆着画布、颜料和未完成的作品；拍照的间隙，他就回到画架前。两种媒材共享同一种关切：颜色的关系、平面的结构、光线如何落在物体上。",
      "所以他的照片常常显得「不像照片」：没有明确的焦点，没有完整的主体，边缘被切断，空间被压平。这些在摄影里可能被视为问题的特征，在绘画里却是理所当然的选择。",
    ],
    note: "本节不复制雷特的绘画作品。所示图像均为其摄影作品中的细节与构图，用来讨论绘画与摄影共享的色彩结构。",
  },
  closing: {
    closingLine: "世界从未缺少美，只是我们偶尔走得太快。",
  },
} as const;

export const credits = {
  exhibition: "SAUL LEITER — A QUIET GAZE",
  edition: "V2.0 / 2026",
  curator: "A QUIET GAZE Editorial Team",
  design: "Editorial art direction & digital exhibition design",
  typefaces: "Local serif & sans stacks (Cormorant Garamond / DM Sans / Noto Serif SC with system fallbacks)",
  technology: "Next.js 15 · React 19 · TypeScript · Tailwind CSS · GSAP · Lenis · PhotoSwipe",
  colophon:
    "本站为独立编辑性学习项目，所有文字为策展写作，不构成学术结论。图像版权归 Estate of Saul Leiter 所有，仅用于非商业性的编辑研究。",
};
