import type { Photograph } from "@/types";

/**
 * The exhibition's plate register: sixteen photographs by Saul Leiter.
 *
 * PROVENANCE
 * The image files were supplied by the project owner from a study deck whose
 * sources are the Saul Leiter Foundation's public colour and black-and-white
 * catalogues. Titles and years follow that curated metadata; "c." and decade
 * ranges are kept as approximations rather than resolved into false precision.
 *
 * RIGHTS
 * All works remain © Estate of Saul Leiter. They are reproduced here for an
 * independent, non-commercial editorial study. This project is not affiliated
 * with, endorsed by, or authorised by the Estate or the Foundation.
 */
const SOURCE_COLOR = "Saul Leiter Foundation — Colour catalogue";
const SOURCE_BW = "Saul Leiter Foundation — Black and White catalogue";
const CREDIT = "© Estate of Saul Leiter. Image source: Saul Leiter Foundation.";
const RIGHTS =
  "All rights reserved. Reproduced for an independent, non-commercial editorial study. Not affiliated with or authorised by the Estate of Saul Leiter or the Saul Leiter Foundation. Permission required for any public or commercial use.";
const COLOR_URL = "https://www.saulleiterfoundation.org/color";
const BW_URL = "https://www.saulleiterfoundation.org/black-and-white";

const APPROX = "年份沿用基金会目录中的约数表述，未作更精确推断。";

const photographs: Photograph[] = [
  {
    id: "AQG-001",
    slug: "through-boards",
    plate: "PL. 001",
    title: "Through Boards",
    titleCn: "隔板之间",
    year: "1957",
    category: ["Obstruction", "Street Life"],
    description:
      "木板把街道压成一条细缝，白色汽车只露出一点。画面的大部分被夺走，观看因此变得迫切。",
    curatorNote:
      "遮挡在这里不是构图技巧，而是叙事策略：当视野被削减到一条窄缝，观者会主动补全看不见的部分。深色前景与远处高光的对比，把空间压成前后两层。",
    image: {
      src: "/images/photographs/plate-01.webp",
      alt: "《Through Boards》（隔板之间），1957，索尔·雷特：深色木板遮住街道，只露出一线白色汽车。",
      width: 852,
      height: 1290,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-002",
    slug: "red-curtain",
    plate: "PL. 002",
    title: "Red Curtain",
    titleCn: "红色窗帘",
    year: "1956",
    category: ["Color", "Obstruction"],
    description:
      "红色窗帘占住画面左侧，窗外的人小得几乎可以忽略。颜色先到，故事随后才出现。",
    curatorNote:
      "窗帘的饱和度远高于街景，它是画面的音量旋钮。人物靠近边缘，暗示摄影师的视线只是偶然掠过；正是这种偶然，让红色有了情绪。",
    image: {
      src: "/images/photographs/plate-02.webp",
      alt: "《Red Curtain》（红色窗帘），1956，索尔·雷特：红色窗帘作为前景，窗外有一个渺小的行人。",
      width: 820,
      height: 1218,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-003",
    slug: "canopy",
    plate: "PL. 003",
    title: "Canopy",
    titleCn: "雨篷",
    year: "1958",
    category: ["Obstruction", "Rain & Snow"],
    description:
      "巨大的黑色雨篷压在上方，雪地里的人缩成几个小点。莱特用一块黑，量出了冬天的空旷。",
    curatorNote:
      "黑白影像里，雨篷几乎占据上半幅，只留下一条窄街。人影的尺度被压到极小，天气因此成为真正的主体。前景的实与远景的空，构成画面全部的张力。",
    image: {
      src: "/images/photographs/plate-03.webp",
      alt: "《Canopy》（雨篷），1958，索尔·雷特：黑色雨篷遮住画面大半，雪街上行人渺小。",
      width: 1054,
      height: 1600,
    },
    source: SOURCE_BW,
    sourceUrl: BW_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: false,
  },
  {
    id: "AQG-004",
    slug: "mirrors",
    plate: "PL. 004",
    title: "Mirrors",
    titleCn: "镜子",
    year: "c. 1962",
    yearNote: APPROX,
    category: ["Obstruction", "Abstract"],
    description:
      "几面镜子把街道折成几个方向。真实与反射互相打断，你越仔细看，越难判断哪一层才是外面。",
    curatorNote:
      "画面由多个视点拼接而成，镜面边缘成为隐形的画框。人物在反射中重复出现，却不指向同一个空间。观看在这里变成一次空间推理。",
    image: {
      src: "/images/photographs/plate-04.webp",
      alt: "《Mirrors》（镜子），约 1962，索尔·雷特：街边多面镜子同时映出行人、建筑与橱窗。",
      width: 1500,
      height: 997,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-005",
    slug: "phone-call",
    plate: "PL. 005",
    title: "Phone Call",
    titleCn: "电话",
    year: "1957",
    category: ["Obstruction", "Street Life"],
    description:
      "电话亭的玻璃上叠着街景、灯箱和打电话的人。三层空间同时存在，城市在他身后不断说话。",
    curatorNote:
      "玻璃把街道的橙红色反光带入室内，人物轮廓被压平。招牌文字、电话机和手臂构成三条水平线，稳定住一个本应混乱的场面。",
    image: {
      src: "/images/photographs/plate-05.webp",
      alt: "《Phone Call》（电话），1957，索尔·雷特：男人在电话亭中通话，玻璃上叠着街道反光与招牌。",
      width: 1170,
      height: 782,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: false,
  },
  {
    id: "AQG-006",
    slug: "taxi",
    plate: "PL. 006",
    title: "Taxi",
    titleCn: "出租车",
    year: "1957",
    category: ["Color", "Street Life"],
    description:
      "黄色车顶、红色车身和司机的手臂挤在一起，几乎没有完整的车。颜色代替叙事，速度就是内容。",
    curatorNote:
      "极近的裁切取消了交通场景的全貌，只留下色块和局部动作。黄与红的碰撞被黑色车窗隔开，画面因此获得一种近乎抽象的节奏。",
    image: {
      src: "/images/photographs/plate-06.webp",
      alt: "《Taxi》（出租车），1957，索尔·雷特：黄色出租车顶、红色车身，司机的右手搭在车窗内。",
      width: 1350,
      height: 899,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-007",
    slug: "blue-skirt",
    plate: "PL. 007",
    title: "Blue Skirt",
    titleCn: "蓝裙",
    year: "1950s",
    yearNote: APPROX,
    category: ["Color", "Abstract"],
    description:
      "画面大部分是暗的，只有一条蓝裙在光里露出来。身体被藏起来，布料和动作替她说话。",
    curatorNote:
      "蓝色的面积不大，却足以改变整张照片的温度。人物被切掉上半身，身份被让渡给衣料与姿态；这是莱特式的距离——看见，但不占有。",
    image: {
      src: "/images/photographs/plate-07.webp",
      alt: "《Blue Skirt》（蓝裙），1950 年代，索尔·雷特：暗色画面中一条蓝色裙摆在光里移动。",
      width: 1347,
      height: 894,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-008",
    slug: "graffiti-heads",
    plate: "PL. 008",
    title: "Graffiti Heads",
    titleCn: "涂鸦头像",
    year: "1950",
    category: ["Abstract", "Street Life"],
    description:
      "墙上的涂鸦、撕破的海报和路人的影子叠在一起。人走了，图像和笔迹继续说话。",
    curatorNote:
      "纪实与抽象在同一平面上相遇：涂鸦的脸、真实的脸、投射的影子彼此干扰。画面的重心不在任何一个人身上，而在整面墙的噪音。",
    image: {
      src: "/images/photographs/plate-08.webp",
      alt: "《Graffiti Heads》（涂鸦头像），1950，索尔·雷特：墙面涂鸦、撕破海报与行人倒影重叠。",
      width: 855,
      height: 1315,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: false,
  },
  {
    id: "AQG-009",
    slug: "san-carlo-restaurant",
    plate: "PL. 009",
    title: "San Carlo Restaurant",
    titleCn: "圣卡洛餐厅",
    year: "1952",
    category: ["Color", "Rain & Snow"],
    description:
      "雪落在餐厅门口，绿色墙面、红色招牌和两把伞同时出现。莱特没有等雪停，也没有把颜色调干净。",
    curatorNote:
      "橱窗内的暖光与街道的冷雪形成两层色温。招牌绿、砖红和雪的灰白彼此抵消，让节日般的色彩显得克制而日常。",
    image: {
      src: "/images/photographs/plate-09.webp",
      alt: "《San Carlo Restaurant》（圣卡洛餐厅），1952，索尔·雷特：雪中餐厅门口，绿墙、红招牌与撑伞行人。",
      width: 724,
      height: 1079,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-010",
    slug: "snow",
    plate: "PL. 010",
    title: "Snow",
    titleCn: "雪",
    year: "1970",
    category: ["Rain & Snow", "Color"],
    description:
      "雪把街道的声音吸走，只剩一个人和几辆车慢慢移动。他拍雪，不是拍白，而是拍白里那一点颜色和体温。",
    curatorNote:
      "高调画面里，黄色交通灯成为唯一的暖色锚点。人物被虚化成一片移动的灰，天气因此获得了时间的重量。",
    image: {
      src: "/images/photographs/plate-10.webp",
      alt: "《Snow》（雪），1970，索尔·雷特：大雪中的街道、模糊行人，远处有一点黄色灯光。",
      width: 905,
      height: 1353,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-011",
    slug: "rain",
    plate: "PL. 011",
    title: "Rain",
    titleCn: "雨",
    year: "1950s",
    yearNote: APPROX,
    category: ["Rain & Snow", "Street Life"],
    description:
      "雨把街道磨成一片反光，行人只剩黑色轮廓。莱特没有躲雨，他让雨替城市加了一层滤镜。",
    curatorNote:
      "黑白剥离了颜色，湿路面只能靠明暗说话。倒影被打碎成不连续的片段，画面因此显得既冷静又潮湿。",
    image: {
      src: "/images/photographs/plate-11.webp",
      alt: "《Rain》（雨），1950 年代，索尔·雷特：雨中的湿街道与撑伞行人的黑色剪影。",
      width: 1000,
      height: 656,
    },
    source: SOURCE_BW,
    sourceUrl: BW_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: false,
  },
  {
    id: "AQG-012",
    slug: "walking",
    plate: "PL. 012",
    title: "Walking",
    titleCn: "行走",
    year: "1956",
    category: ["Obstruction", "Street Life"],
    description:
      "女人走在玻璃后面，身体被反光切成几段。我们看见她，却无法确认她在哪里。",
    curatorNote:
      "双层曝光般的反射把人物与街景压在同一平面。她的脚步、橱窗里的灯和建筑线条同时运动，让画面失去稳定的中心。",
    image: {
      src: "/images/photographs/plate-12.webp",
      alt: "《Walking》（行走），1956，索尔·雷特：隔着玻璃行走的女子，身体被反光分割成几段。",
      width: 776,
      height: 1166,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: false,
  },
  {
    id: "AQG-013",
    slug: "sidewalk",
    plate: "PL. 013",
    title: "Sidewalk",
    titleCn: "人行道",
    year: "1954",
    category: ["Street Life", "Abstract"],
    description:
      "男人站在人行道上，影子被光拉得很长。一个背影和一条空街，就是城市里最普通的等待。",
    curatorNote:
      "极端的明暗对比把主体变成剪影，周围几乎没有细节。空的街道提供了阅读的余地：他在等什么，照片并不回答。",
    image: {
      src: "/images/photographs/plate-13.webp",
      alt: "《Sidewalk》（人行道），1954，索尔·雷特：黑色剪影般的男人站在被强光切开的空街上。",
      width: 1000,
      height: 657,
    },
    source: SOURCE_BW,
    sourceUrl: BW_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
  {
    id: "AQG-014",
    slug: "times-square-new-years-eve",
    plate: "PL. 014",
    title: "Times Square, New Year's Eve",
    titleCn: "时代广场，新年前夜",
    year: "1952–1953",
    yearNote: "年份沿用基金会目录中的时间区间。",
    category: ["Street Life", "Portrait"],
    description:
      "跨年夜的人挤在黑暗里，光从侧面切过来。莱特没有拍狂欢全景，只拍几张被照亮的脸。",
    curatorNote:
      "闪光与人群的暗部形成强硬的切割，面孔在过曝中变得陌生。公共事件被还原为若干张局部的脸，历史感因此变得私密。",
    image: {
      src: "/images/photographs/plate-14.webp",
      alt: "《Times Square, New Year's Eve》（时代广场，新年前夜），1952–1953，索尔·雷特：黑暗中被人造光照亮的人群面孔。",
      width: 1000,
      height: 651,
    },
    source: SOURCE_BW,
    sourceUrl: BW_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: false,
  },
  {
    id: "AQG-015",
    slug: "foot-on-el",
    plate: "PL. 015",
    title: "Foot on El",
    titleCn: "高架列车上的脚",
    year: "1954",
    category: ["Portrait", "Abstract"],
    description:
      "高架列车里，一只脚、一把椅子和窗外的光构成一个不完整的故事。莱特裁掉了人的大部分，只留下局部。",
    curatorNote:
      "画面拒绝提供身份，只给出一段裤脚、一只手和座椅的纹理。熟悉的公共空间因此变得陌生，像一次偷看。",
    image: {
      src: "/images/photographs/plate-15.webp",
      alt: "《Foot on El》（高架列车上的脚），1954，索尔·雷特：车厢内座椅、裤脚与窗外光线构成的局部。",
      width: 876,
      height: 1295,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: false,
  },
  {
    id: "AQG-016",
    slug: "man-in-straw-hat",
    plate: "PL. 016",
    title: "Man in Straw Hat",
    titleCn: "戴草帽的男人",
    year: "c. 1955",
    yearNote: APPROX,
    category: ["Portrait", "Street Life"],
    description:
      "戴草帽的男人站在黄色出租车旁，像从另一部电影里走出来。一个人和一座城市恰好对上。",
    curatorNote:
      "草帽的浅色与车身黄色互相呼应，人物因此融进城市的色温里。背景的橱窗和招牌被压成模糊的装饰，只有姿态保持清晰。",
    image: {
      src: "/images/photographs/plate-16.webp",
      alt: "《Man in Straw Hat》（戴草帽的男人），约 1955，索尔·雷特：戴草帽的男人站在黄色出租车与橱窗前。",
      width: 776,
      height: 1159,
    },
    source: SOURCE_COLOR,
    sourceUrl: COLOR_URL,
    credit: CREDIT,
    rights: RIGHTS,
    usage: "editorial-study",
    featured: true,
  },
];

export { photographs };
export default photographs;
