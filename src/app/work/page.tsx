import type { Metadata } from "next";

import PageHero from "@/components/ui/PageHero";
import WorkIndex from "@/components/gallery/WorkIndex";
import {
  getAllPhotographs,
  getCategoryCounts,
  getDatedCount,
  getPlateCountLabel,
} from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "The Work — Sixteen Plates",
  description:
    "索尔·雷特作品索引：十六幅摄影作品，按色彩、遮挡、雨雪、街头、肖像与抽象分类，进入每一张底片的档案页。",
  path: "/work/",
});

export default function WorkPage() {
  const total = getAllPhotographs().length;
  const categories = getCategoryCounts().length;
  const dated = getDatedCount();

  return (
    <>
      <PageHero
        kicker="THE WORK / 01"
        topRight="SIXTEEN PLATES · AQG REGISTER"
        bg="/images/photographs/plate-06.webp"
        bgAlt="《Taxi》，索尔·雷特：黄色车顶与红色车身占据画面边缘。"
        position="50% 52%"
        title={
          <>
            THE
            <br />
            <em>WORK.</em>
          </>
        }
        lead="这里不是完整的作品目录，只是一次可以慢慢走过的挑选：十六张照片，从最普通的街道开始，一直走到它们的边缘。"
        aside={
          <>
            <span>{getPlateCountLabel()}</span>
            <span>{categories} CATEGORIES</span>
            <span>{dated} DATED WORKS</span>
            <span>© ESTATE OF SAUL LEITER</span>
          </>
        }
      />

      <section className="work-index" aria-label="作品索引">
        <div className="wrap">
          <p className="work-index__intro">
            <span className="eyebrow" lang="en">
              THE REGISTER
            </span>
            <span>
              筛选会重新排列这一面墙。每一张照片都保留编号、年份与权利状态，
              点击进入单独的档案页，或直接打开大图。
            </span>
            <span className="mono" lang="en">
              {String(total).padStart(2, "0")} ENTRIES / AQG-001—016
            </span>
          </p>

          <WorkIndex />
        </div>
      </section>
    </>
  );
}
