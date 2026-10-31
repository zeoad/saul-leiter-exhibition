import type { TimelineEvent } from "@/types";

/**
 * A short, sourced chronology of Saul Leiter's life.
 *
 * Editorial policy: every date here is a widely published fact; where a year
 * is approximate the field says so explicitly. No awards, exhibition titles or
 * addresses have been invented. Sources are linked at the foot of /life/.
 *
 * Birth: December 3, 1923, Pittsburgh, Pennsylvania.
 * Death: November 26, 2013, New York City.
 */
export const timeline: TimelineEvent[] = [
  {
    year: "1923",
    sortYear: 1923,
    title: "Born in Pittsburgh",
    titleCn: "出生于匹兹堡",
    body: "12 月 3 日，索尔·雷特出生于宾夕法尼亚州匹兹堡的一个犹太教正统家庭。父亲是一位塔木德学者，家中更看重经文与律法，而不是艺术。",
    kind: "life",
    highlight: true,
    source: { label: "Saul Leiter Foundation", href: "https://www.saulleiterfoundation.org/" },
  },
  {
    year: "1930s",
    sortYear: 1935,
    title: "Painting, Against Expectation",
    titleCn: "在期待之外开始画画",
    body: "少年时期的雷特开始画画。这在家庭内部并不是一个被鼓励的选择，但绘画成为他最早、也最持久的表达方式。日后他始终同时是画家与摄影师，而非两者之一。",
    kind: "life",
  },
  {
    year: "1946",
    sortYear: 1946,
    title: "New York, to Be a Painter",
    titleCn: "去纽约，做一个画家",
    body: "1946 年，他离开匹兹堡前往纽约，决心以绘画为生。在纽约，他结识了画家理查德·波塞特-达特（Richard Pousette-Dart），并进入了抽象表现主义者的圈子。",
    kind: "life",
    highlight: true,
    source: { label: "Saul Leiter Foundation", href: "https://www.saulleiterfoundation.org/" },
  },
  {
    year: "1947–48",
    sortYear: 1947,
    title: "The Camera Appears",
    titleCn: "相机进入他的生活",
    body: "在波塞特-达特的鼓励下，雷特开始拍照。他很快转向彩色胶片，用柯达克罗姆记录纽约街头——在那个年代，这既昂贵，也不被视为「严肃摄影」的正途。",
    kind: "work",
  },
  {
    year: "1953",
    sortYear: 1953,
    title: "Museum of Modern Art",
    titleCn: "进入现代艺术博物馆",
    body: "爱德华·史泰钦（Edward Steichen）将雷特的作品选入现代艺术博物馆（MoMA）的展览《Always the Young Strangers》。这是他的作品第一次进入重要美术馆的视野。",
    kind: "exhibition",
    source: { label: "MoMA", href: "https://www.moma.org/" },
  },
  {
    year: "1950s–60s",
    sortYear: 1955,
    title: "Fashion, and a Living",
    titleCn: "时尚摄影与生计",
    body: "为了谋生，他进入商业摄影领域，为 Harper's Bazaar、Elle、Esquire 等刊物拍摄时尚与广告照片，并与艺术指导亨利·沃尔夫（Henry Wolf）长期合作。商业工作稳定，却从未取代他的个人创作。",
    kind: "work",
    highlight: true,
  },
  {
    year: "1950s–70s",
    sortYear: 1960,
    title: "The Street, in Color",
    titleCn: "彩色的街道",
    body: "在商业拍摄之外，他持续拍摄纽约：橱窗、玻璃、雨雪、行人和被遮挡的街景。这些照片大多没有在当时发表，被安静地收在公寓里。",
    kind: "work",
  },
  {
    year: "1980s–90s",
    sortYear: 1985,
    title: "Out of View",
    titleCn: "远离聚光灯",
    body: "商业摄影的委托逐渐减少，他的名字也慢慢从公众视野中淡出。他继续画画、继续拍照，在曼哈顿东村的公寓里过着近乎隐居的生活。",
    kind: "life",
  },
  {
    year: "2006",
    sortYear: 2006,
    title: "Early Color",
    titleCn: "《Early Color》出版",
    body: "Steidl 出版《Saul Leiter: Early Color》，由马丁·哈里森（Martin Harrison）撰写文章。这本画册让他的彩色摄影重新进入国际视野，也改变了他晚年的生活。",
    kind: "publication",
    highlight: true,
    source: { label: "Steidl", href: "https://steidl.de/" },
  },
  {
    year: "2013",
    sortYear: 2013,
    title: "A Quiet Exit",
    titleCn: "安静的告别",
    body: "11 月 26 日，雷特在纽约去世，享年 89 岁。同年，托马斯·里奇（Tomas Leach）执导的纪录片《In No Great Hurry: 13 Lessons in Life with Saul Leiter》完成，记录了他晚年的日常与工作方式。",
    kind: "life",
    highlight: true,
  },
  {
    year: "2014",
    sortYear: 2014,
    title: "The Archive Is Opened",
    titleCn: "档案被重新打开",
    body: "Saul Leiter 基金会成立，开始系统整理他留下的底片、印片与绘画；Steidl 同年出版《Early Black and White》，让他的黑白作品也获得应有的注视。",
    kind: "publication",
    source: { label: "Saul Leiter Foundation", href: "https://www.saulleiterfoundation.org/" },
  },
];

export const lifeFacts = [
  { label: "BORN", value: "1923 · Pittsburgh, PA" },
  { label: "DIED", value: "2013 · New York City" },
  { label: "MEDIUM", value: "Color photography · Painting" },
  { label: "HELD BY", value: "Saul Leiter Foundation" },
];

export const publications = [
  {
    title: "Saul Leiter: Early Color",
    meta: "Steidl, 2006 · Essay by Martin Harrison",
    note: "第一本系统呈现他 1940–50 年代彩色作品的书，也是他重新被世界看见的起点。",
  },
  {
    title: "Saul Leiter: Early Black and White",
    meta: "Steidl, 2014",
    note: "与彩色作品同时期进行的黑白实验，展示了他对城市质感的另一种处理。",
  },
  {
    title: "In No Great Hurry",
    meta: "Documentary, 2013 · Dir. Tomas Leach",
    note: "在他去世前不久完成的纪录片，记录了他缓慢、固执而自足的观看方式。",
  },
];

export const sources = [
  {
    label: "Saul Leiter Foundation",
    href: "https://www.saulleiterfoundation.org/",
    note: "艺术家档案、生平与合作机构信息",
  },
  {
    label: "The Museum of Modern Art",
    href: "https://www.moma.org/",
    note: "1953 年展览与馆藏记录",
  },
  {
    label: "Steidl",
    href: "https://steidl.de/",
    note: "《Early Color》《Early Black and White》出版信息",
  },
];
