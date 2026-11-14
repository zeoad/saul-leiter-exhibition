import type { Metadata } from "next";
import Link from "next/link";

import WorkIndex from "@/components/gallery/WorkIndex";
import {
  getAllPhotographs,
  getCategoryCounts,
  getDatedCount,
} from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "The Work — A Contact Sheet",
  description:
    "索尔·雷特作品索引：十六幅摄影作品摊开成一张印相校样，按色彩、遮挡、雨雪、街头、肖像与抽象分类，逐格进入每一张底片的档案页。",
  path: "/work/",
});

export default function WorkPage() {
  const total = getAllPhotographs().length;
  const categories = getCategoryCounts().length;
  const dated = getDatedCount();

  return (
    <>
      <section className="gate" aria-labelledby="work-title">
        <div className="gate__film" aria-hidden="true">
          <span className="gate__perfs" />

          <div className="gate__track">
            {[4, 3, 2, 1].map((count) => (
              <span className="gate__frame" key={count}>
                <span className="gate__ring" />
                <span className="gate__num">{count}</span>
              </span>
            ))}
            <span className="gate__edge">KODAK 400 TX · 35 MM</span>
            <span className="gate__edge">ROLL 04 · AQG</span>
          </div>

          <span className="gate__perfs" />
        </div>

        <span className="gate__flash" aria-hidden="true" />

        <div className="wrap gate__inner">
          <div className="gate__meta" lang="en">
            <span>AQG REGISTER · SHEET 01</span>
            <span>KODAK 400 TX · 35 MM · ROLL 04</span>
            <span>DO NOT CUT</span>
          </div>

          <div className="gate__rest">
            <h1 id="work-title" className="gate__title" lang="en">
              <span>THE</span>
              <em>WORK.</em>
            </h1>

            <div className="gate__foot">
              <p className="gate__lede">
                这里不是完整的作品目录，而是一整卷摊开的印相校样：十六格画面，
                从最普通的街道开始，一直走到它们的边缘。红笔圈出的那一格，
                会被剪下来，放大成一张真正的照片。
              </p>

              <dl className="gate__stats" lang="en">
                <div>
                  <dt>PLATES</dt>
                  <dd>{total}</dd>
                </div>
                <div>
                  <dt>CATEGORIES</dt>
                  <dd>{String(categories).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt>DATED</dt>
                  <dd>{String(dated).padStart(2, "0")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="sheet" aria-label="作品索引 · 印相校样">
        <div className="wrap">
          <WorkIndex />
        </div>
      </section>

      <section className="page-outro tone-dark">
        <div className="wrap page-outro__inner">
          <span className="eyebrow" lang="en">
            THE NEXT FRAME
          </span>
          <h2 className="display" lang="en">
            EVERY PRINT
            <br />
            <em>IS AN ARGUMENT.</em>
          </h2>
          <p>
            校样只是过程的证词。下一页把镜头交还给观看本身：四个章节，
            四种把世界裁成一幅画面的方法。
          </p>
          <div className="page-outro__actions">
            <Link href="/vision/" className="btn">
              进入视觉语言
            </Link>
            <Link href="/archive/" className="btn">
              打开数字档案
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
