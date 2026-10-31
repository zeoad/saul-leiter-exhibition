import type { VisionChapter } from "@/types";

/**
 * The four visual chapters of THE VISION.
 * Each chapter is designed to be read as a magazine feature: a key visual,
 * a standfirst, an argument in three movements, and a small group of plates.
 */
export const chapters: VisionChapter[] = [
  {
    id: "color",
    number: "01",
    kicker: "THE LANGUAGE OF COLOR",
    title: "Color as a\nSecond Language",
    titleCn: "色彩，是他的第二母语",
    standfirst: "在黑白仍是正统的年代，他选择让颜色先说话。",
    intro: [
      "在 1950 年代的纽约，严肃摄影几乎默认是黑白的。彩色胶片的颗粒粗、宽容度低，被看作广告与杂志的媒材。索尔·雷特却在那时开始大量拍摄彩色照片，用当时并不便宜的柯达克罗姆记录街道。",
      "他对颜色的兴趣并不来自「鲜艳」，而来自颜色之间的关系：一片灰绿如何让一块赭色变得温暖，一扇红门如何让整条街安静下来。颜色在他的画面里很少是主角，更多时候它是一种语气。",
      "这也解释了他的照片为何常被形容为「像绘画」。他并不追求准确还原，而是把现实重新配平：降低饱和、保留脏色、允许阴影发灰，让画面获得一种被时间抚摸过的温度。",
    ],
    quote: "颜色不是被看见的，是被等待的。",
    quoteNote: "策展笔记 —— 关于雷特色彩节奏的观察",
    analysis: [
      {
        label: "PALETTE",
        body: "有限色板：以灰绿、赭褐、纸白为底，只允许一处暖红或暗黄进入。颜色数目越少，彼此的张力越清楚。",
      },
      {
        label: "WEIGHT",
        body: "把最强的颜色放在非中心位置。视线被拉向边缘，画面因此产生一种不安定的平衡。",
      },
      {
        label: "TEMPERATURE",
        body: "冷调背景包裹暖调主体，或反过来。色温的冲突代替了明暗对比，成为构图的主要动力。",
      },
    ],
    detailNote:
      "观察画面中红色的面积：它往往不足十分之一，却决定了整张照片的情绪。再看那些「不干净」的灰色——它们不是失误，而是让颜色显得可信的关键。",
    works: ["taxi", "blue-skirt", "san-carlo-restaurant", "graffiti-heads", "mirrors"],
    hero: {
      src: "/images/photographs/plate-06.webp",
      alt: "《Taxi》（出租车），1957，索尔·雷特：黄色车顶、红色车身与司机手臂的近距离裁切。",
      width: 1350,
      height: 899,
    },
    heroWork: "taxi",
    theme: "paper",
  },
  {
    id: "obstruction",
    number: "02",
    kicker: "OBSTRUCTION",
    title: "The World\nBehind Glass",
    titleCn: "世界在玻璃之后",
    standfirst: "他不把遮挡当作障碍，而是当作观看的条件。",
    intro: [
      "雷特最容易被辨认的手法，是把镜头对准玻璃：橱窗、车窗、咖啡馆的窗、雨天的玻璃。真实的街道因此被叠上第二层空间——反射、水汽、灯光、以及观者自己的影子。",
      "遮挡让画面变得不完整，也让画面变得诚实。我们从来不是站在城市中央观看城市，我们总是隔着什么在看：一层玻璃、一段距离、一段时间。",
      "在构图层面，这些前景往往占据很大的面积，甚至压住主体。它们迫使视线绕行，把「看见」变成一件需要耐心的事。这种延迟，正是他照片里安静感的来源。",
    ],
    quote: "不完整的画面，更接近真实的观看。",
    quoteNote: "策展笔记 —— 关于遮挡与距离",
    analysis: [
      {
        label: "LAYERS",
        body: "至少三层空间：玻璃后的对象、玻璃上的反射、玻璃前的人。三层各自清晰，整体却无法被完全解读。",
      },
      {
        label: "FRAME",
        body: "窗框与门框成为画面中的第二个画框。它切割现实，也提醒观者：这是一个被选择过的视角。",
      },
      {
        label: "FOCUS",
        body: "焦点常常落在玻璃表面而非主体。人物的模糊不是失败，而是把观看的位置交代清楚。",
      },
    ],
    detailNote:
      "试着分辨哪些亮部来自玻璃后面，哪些来自玻璃表面。当两者无法分开时，照片便获得了它真正的主题：不确定性。",
    works: ["through-boards", "phone-call", "mirrors", "walking", "canopy"],
    hero: {
      src: "/images/photographs/plate-04.webp",
      alt: "《Mirrors》（镜子），约 1962，索尔·雷特：街边多面镜子同时映出行人、建筑与橱窗。",
      width: 1500,
      height: 997,
    },
    heroWork: "mirrors",
    theme: "ink",
  },
  {
    id: "rain-and-snow",
    number: "03",
    kicker: "RAIN & SNOW",
    title: "Weather as\nAtmosphere",
    titleCn: "天气，是城市的语气",
    standfirst: "雨和雪改变了光的性质，也改变了人走路的方式。",
    intro: [
      "坏天气通常被认为不适合拍照。雷特却反复走进雨里、雪里、雾里。天气在他的画面中不是背景，而是显影液：它让灯光扩散，让人群变形，让熟悉的街道变得难以确认。",
      "雨把城市变成一面镜子。雪则相反，它吸收声音与细节，把街道还原成几块柔和的形状。两种天气对应两种观看：一种向外扩散，一种向内收拢。",
      "在潮湿的空气里，颜色会变得更脏、更厚。这种「不干净」恰好是雷特想要的效果——它让照片保留了身体感，而不是印刷品式的洁净。",
    ],
    quote: "雨让城市暂时失去了边界。",
    quoteNote: "策展笔记 —— 天气与画面的呼吸",
    analysis: [
      {
        label: "DIFFUSION",
        body: "雨雾把硬光变软，高光向外扩散。轮廓因此变得不确定，画面获得了呼吸的空间。",
      },
      {
        label: "REFLECTION",
        body: "湿路面把光源拉成纵向的色带。倒影不是重复，而是对城市的一次改写。",
      },
      {
        label: "SILENCE",
        body: "雪降低对比与细节，形成高调画面。留白越多，人物越显得孤立，也越显得珍贵。",
      },
    ],
    detailNote:
      "注意画面里被天气抹掉的信息：招牌、面孔、街道尽头的建筑。被抹掉的部分，往往比留下的部分更能说明那一刻的空气。",
    works: ["rain", "snow", "canopy", "san-carlo-restaurant"],
    hero: {
      src: "/images/photographs/plate-11.webp",
      alt: "《Rain》（雨），1950 年代，索尔·雷特：雨中的湿街道与撑伞行人的黑色剪影。",
      width: 1000,
      height: 656,
    },
    heroWork: "rain",
    theme: "teal",
  },
  {
    id: "the-ordinary",
    number: "04",
    kicker: "THE ORDINARY",
    title: "Nothing\nHappens Here",
    titleCn: "什么也没有发生",
    standfirst: "他的照片很少讲述事件，它们只负责让某一刻停下来。",
    intro: [
      "雷特的街头照片里，很少出现决定性的冲突、戏剧性的动作或明确的故事。更多时候，只是一个行人、一段墙、一块反光、一个没有被注意的转弯。",
      "这种「什么也没有发生」的美学，今天看来近乎奢侈。它要求摄影师相信日常本身足够丰富，也要求观者愿意在没有情节的地方停留。",
      "他的方法可以拆成三件事：等待、裁切、放弃。等待光线与行人刚好重叠；裁切掉解释性的信息；放弃对意义的强求。剩下的画面因此显得松弛，却异常持久。",
    ],
    quote: "真正值得观看的东西，不一定发生在遥远的地方。",
    quoteNote: "策展笔记 —— 日常的诗意",
    analysis: [
      {
        label: "GESTURE",
        body: "一个转身、一次抬手，就足够撑起一张照片。动作越小，观看越近。",
      },
      {
        label: "CROP",
        body: "切掉人物的脸、切掉建筑的地基。不完整让人产生代入，而不是疏离。",
      },
      {
        label: "PATIENCE",
        body: "把快门留到最后一刻。日常的照片不靠捕捉，靠等待。",
      },
    ],
    detailNote:
      "把注意力放在画面边缘：半个行人、一截衣角、一道门缝。雷特经常把「重要的事」放在不会第一眼看到的地方。",
    works: ["sidewalk", "man-in-straw-hat", "foot-on-el", "times-square-new-years-eve", "taxi"],
    hero: {
      src: "/images/photographs/plate-13.webp",
      alt: "《Sidewalk》（人行道），1954，索尔·雷特：黑色剪影般的男人站在被强光切开的空街上。",
      width: 1000,
      height: 657,
    },
    heroWork: "sidewalk",
    theme: "paper-dark",
  },
];

export default chapters;
