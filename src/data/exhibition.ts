import type { HomeChapter, NavLink } from "@/types";

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

export const homeChapters: HomeChapter[] = [
  { id: "cover", number: "01", label: "COVER", title: "Exhibition Cover" },
  { id: "statement", number: "02", label: "STATEMENT", title: "The Art of Looking" },
  { id: "new-york", number: "03", label: "NEW YORK", title: "Through His Eyes" },
  { id: "color", number: "04", label: "COLOR", title: "The Language of Color" },
  { id: "behind-the-glass", number: "05", label: "OBSTRUCTION", title: "Behind the Glass" },
  { id: "rain-and-snow", number: "06", label: "WEATHER", title: "Rain & Snow" },
  { id: "the-ordinary", number: "07", label: "ORDINARY", title: "The Ordinary" },
  { id: "painters-eye", number: "08", label: "PAINTER", title: "A Painter's Eye" },
  { id: "selected-works", number: "09", label: "WORKS", title: "Selected Works" },
  { id: "life", number: "10", label: "LIFE", title: "The Life" },
  { id: "closing", number: "11", label: "CLOSING", title: "Look Again" },
];

/**
 * THE ART OF SEEING — the seven exhibition scenes. Each maps to a section
 * anchor on the home page (or a route for the archive); the scene index
 * overlay and its scroll-spy read this list.
 */
export interface Scene {
  id: string;
  number: string;
  label: string;
  title: string;
  /** Section anchor on `/`, or a route path. */
  target: string;
}

export const homeScenes: Scene[] = [
  { id: "cover", number: "01", label: "THE COVER", title: "Enter the Exhibition", target: "#cover" },
  { id: "window", number: "02", label: "A WINDOW", title: "A Window Between Us", target: "#behind-the-glass" },
  { id: "colors", number: "03", label: "THE COLORS", title: "The Language of Color", target: "#color" },
  { id: "photographs", number: "04", label: "PHOTOGRAPHS", title: "A Collection of Moments", target: "#selected-works" },
  { id: "moment", number: "05", label: "THE MOMENT", title: "A Life Through Time", target: "#life" },
  { id: "archive", number: "06", label: "THE ARCHIVE", title: "The Photographic Archive", target: "/archive/" },
  { id: "exit", number: "07", label: "THE EXIT", title: "The End Is Another Beginning", target: "#closing" },
];

export const colorObservations = [
  {
    name: "VERMILION",
    hex: "#A64B3C",
    note: "画面里最暖的一点红，通常出现在边缘，而不是中心。它负责让整张照片突然有了体温。",
  },
  {
    name: "OCHRE",
    hex: "#B8A990",
    note: "被阳光晒旧的墙面，是很多照片的底。它不抢眼，却决定了画面是冷还是暖。",
  },
  {
    name: "SLATE",
    hex: "#85877C",
    note: "灰绿让红显得更红，也让城市显得更旧。它是最接近「阴天下午」的颜色。",
  },
  {
    name: "TEAL",
    hex: "#52605E",
    note: "阴影不是黑色的，它总是偏向蓝绿。这个偏移让画面保留了空气感。",
  },
  {
    name: "PAPER",
    hex: "#EAE6DE",
    note: "高光被允许过曝一点点，像一张被反复翻看的纸。缺陷在这里是可贵的。",
  },
];

export const glassNotes = [
  {
    label: "THE SURFACE",
    text: "玻璃首先是一层表面：水汽、指纹、灰尘、雨痕。它们让影像变脏，也让影像变得可信。",
  },
  {
    label: "THE REFLECTION",
    text: "反射把街道折叠进橱窗。两个空间同时存在，观者必须选择看哪一层——通常两者都看。",
  },
  {
    label: "THE FRAME",
    text: "窗框与门框切掉了多余的现实。遮挡不是画面的缺口，而是构图真正的起点。",
  },
];

export const ordinaryNotes = [
  {
    number: "01",
    title: "A WALK",
    text: "一个人走过一堵墙，只用了两秒。照片把这两秒变成了可以被反复观看的一段时间。",
  },
  {
    number: "02",
    title: "A PAUSE",
    text: "抬手、低头、点烟、等红灯。雷特拍下的多是动作之间的空隙，而不是动作本身。",
  },
  {
    number: "03",
    title: "A CORNER",
    text: "街角、台阶、门廊、半开的窗。城市最不重要的地方，往往藏着最完整的画面。",
  },
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

export const homeCopy = {
  opening: {
    eyebrow: "OPENING STATEMENT",
    titleLines: ["THE ART", "OF LOOKING"],
    paragraphs: [
      "索尔·雷特（1923—2013）在纽约生活了将近七十年。他画画，也拍照；他拍时尚，也拍街头。但在所有工作之外，他真正做的事情只有一件：长时间地看着窗外。",
      "他的照片很少有戏剧性。一扇被雨水打湿的窗、一段被玻璃折叠的街景、一个从画面边缘经过的人——这些片段如果被随手拍下，大概不会有人多看一眼。雷特的不同之处在于，他愿意等：等光落在正确的位置，等一个人走进他预先留好的空白。",
      "这次展览不打算把他解释成一位「街头摄影大师」。我们更想邀请你进入他的观看方式——先看颜色，再看遮挡，然后注意天气，最后回到那些最普通的日常。当你走出展厅时，也许会发现，刚才路过的那面墙，其实一直很好看。",
    ],
    signature: "A QUIET GAZE 策展组",
    pullquote: "摄影不是关于你看见什么，而是关于你愿意看多久。",
    portrait: {
      src: "/images/hero/statement-portrait.webp",
      alt: "索尔·雷特肖像，约 1950 年代：戴眼镜的男子在窗边低头，手中拿着相机。",
      width: 864,
      height: 1080,
    },
  },
  newYork: {
    eyebrow: "NEW YORK THROUGH HIS EYES",
    titleLines: ["NEW YORK", "THROUGH", "HIS EYES"],
    standfirst: "纽约不是他拍摄的对象，而是他观看的借口。",
    paragraphs: [
      "他很少站在街道中央。更多时候，他在窗后、在门廊里、在玻璃的另一侧，从一个略微偏离的位置看出去。这个位置让城市变得不那么确定：行人被切掉一半，招牌只剩几个字母，街道尽头被一片反光吞没。",
      "但他并不因此显得冷漠。相反，正是这些偏移让画面有了温度。橱窗里的商品、等车的人、被雨困住的伞、掠过墙面的车灯——它们不再是被记录的对象，而是一同存在于那个下午的事物。",
      "对他而言，纽约最动人的部分从来不是天际线，而是这些几乎不会被记住的瞬间：一堵墙的颜色，一段人行道的阴影，一个人刚好走进光里。",
    ],
    quote: "他拍摄的不是纽约，而是纽约在他眼里短暂呈现的样子。",
    quoteNote: "CURATORIAL NOTE",
  },
  color: {
    eyebrow: "THE LANGUAGE OF COLOR",
    titleLines: ["THE LANGUAGE", "OF COLOR"],
    standfirst: "在他的画面里，颜色从来不是装饰，而是句法。",
    paragraphs: [
      "1950 年代的纽约，严肃摄影几乎默认是黑白的。彩色胶片昂贵、颗粒粗糙，被认为属于广告。雷特却从那时开始大量拍摄彩色照片，用颜色记录城市里那些难以言说的情绪。",
      "他使用颜色非常节省。一张画面通常只有三种主要色相：一片灰绿、一块赭色、一处红。颜色越少，关系越清楚；最强的颜色往往被放在边缘，让视线不得不移动。",
      "这不是对现实的忠实还原，而是一种重新配平。降低饱和、保留脏色、允许阴影发灰——这些选择让照片保留了时间感，也让平凡街景获得了接近绘画的气息。",
    ],
    note: "下面的色值来自本项目的设计系统，用于描述雷特画面中反复出现的色彩倾向，并非作品本身的取色。",
  },
  glass: {
    eyebrow: "BEHIND THE GLASS",
    titleLines: ["BEHIND", "THE GLASS"],
    standfirst: "他不把遮挡当作障碍，而是当作观看的条件。",
    paragraphs: [
      "玻璃是他最常用的镜头。橱窗、车窗、咖啡馆的窗、雨天的玻璃——真实的街道因此被叠上第二层空间：反射、水汽、灯光，以及观者自己的影子。",
      "遮挡让画面变得不完整，也让画面变得诚实。我们从来不是站在城市中央观看城市，我们总是隔着什么在看：一层玻璃、一段距离、一段时间。",
      "因此，他愿意让前景占据画面的大半，让人物模糊，让重要的东西出现在角落里。观看在这类照片中不是瞬间完成的，它需要一点耐心。",
    ],
    pullquote: "不完整的画面，更接近真实的观看。",
  },
  weather: {
    eyebrow: "RAIN & SNOW",
    titleLines: ["RAIN, SNOW", "& SILENCE"],
    standfirst: "天气不是背景，而是显影液。",
    paragraphs: [
      "坏天气通常被认为不适合拍照。雷特却反复走进雨里、雪里、雾里。雨把灯光扩散，让行人变形；雪吸收声音，把街道还原成几块柔和的形状。",
      "湿路面是他的另一块画布。倒影把城市拉长、打碎，又重新拼好。在潮湿的空气里，颜色会变得更脏、更厚——这种「不干净」恰好是照片想要保留的身体感。",
      "天气真正改变的不是画面，而是人的速度。下雨时，所有人都慢下来；下雪时，城市暂时安静。雷特的照片记录的，正是这种被天气改变的时间。",
    ],
    quote: "雨让城市暂时失去了边界。",
  },
  ordinary: {
    eyebrow: "THE ORDINARY",
    titleLines: ["THE ORDINARY", "POETRY"],
    standfirst: "他的照片很少讲述事件，它们只负责让某一刻停下来。",
    paragraphs: [
      "雷特的街头照片里，很少出现决定性的冲突或明确的叙事。更多时候，只是一个行人、一段墙、一块反光、一个没有被注意的转弯。",
      "这种「什么也没有发生」的美学，今天看来近乎奢侈。它要求摄影师相信日常本身足够丰富，也要求观者愿意在没有情节的地方停留。",
    ],
    manifesto: "真正值得观看的东西，不一定发生在遥远的地方。",
  },
  painter: {
    eyebrow: "A PAINTER'S EYE",
    titleLines: ["A PAINTER'S", "EYE"],
    standfirst: "摄影是他的第二语言，绘画才是母语。",
    paragraphs: [
      "在成为摄影师之前，雷特想成为画家。他到纽约的初衷是画画，相机是后来才出现的。这个顺序很重要：他不是用摄影模仿绘画，而是始终用绘画的方式思考画面。",
      "他一生都在画画。工作室里堆着画布、颜料和未完成的作品；拍照的间隙，他就回到画架前。两种媒材共享同一种关切：颜色的关系、平面的结构、光线如何落在物体上。",
      "所以他的照片常常显得「不像照片」：没有明确的焦点，没有完整的主体，边缘被切断，空间被压平。这些在摄影里可能被视为问题的特征，在绘画里却是理所当然的选择。",
    ],
    comparisonLabels: {
      left: "PHOTOGRAPH / BLUE SKIRT, 1950s",
      right: "PHOTOGRAPHIC DETAIL / RED CURTAIN, 1956",
    },
    note: "本节不复制雷特的绘画作品。所示图像均为其摄影作品中的细节与构图，用来讨论绘画与摄影共享的色彩结构。",
  },
  closing: {
    eyebrow: "CLOSING ESSAY",
    titleLines: ["LOOK", "AGAIN."],
    paragraphs: [
      "展览到这里就结束了，但观看不必结束。雷特留给我们的不是一套风格，而是一种许可：允许自己在一件不重要的事情上停留久一点。",
      "你会发现，他的照片里几乎没有必须要看的东西。没有新闻，没有结论，没有需要被理解的故事。只有颜色、光线、天气，和一个刚好经过的人。",
      "所以，离开之前，请再看一次。看那张你觉得「没什么」的照片，看它的边缘，看它最暗的角落。也许那里，正是他真正想让你看到的地方。",
    ],
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
