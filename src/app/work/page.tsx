import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import WorkGallery from "@/components/gallery/WorkGallery";
import ArrowLink from "@/components/ui/ArrowLink";
import { getCategoryCounts, getPlateCountLabel } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/data/exhibition";

export const metadata: Metadata = createPageMetadata({
  title: "The Work — 16 Plates",
  description:
    "展览作品集：色彩、遮挡、雨雪、街头、肖像与抽象，共 16 件编目作品。可分类筛选、打开大图并查看单件作品档案。",
  path: "/work/",
});

export default function WorkPage() {
  const counts = getCategoryCounts();

  return (
    <>
      <PageHero
        theme="ink"
        kicker="THE COLLECTION / 01"
        topRight={`${getPlateCountLabel()} · ${counts.length} CATEGORIES`}
        title={
          <>
            THE
            <br />
            <em>WORK.</em>
          </>
        }
        lead="十六件作品，六种观看的入口。它们全部是索尔·雷特的原作，每一件都标注了编目编号、年份与权利状态，并附有独立的作品档案。"
        aside={
          <>
            <span className="page-hero__count">16</span>
            <span className="meta">PLATES / 001—016</span>
            <span className="meta">© ESTATE OF SAUL LEITER</span>
          </>
        }
      />

      <section className="section section--tight work-intro theme-paper">
        <div className="container">
          <div className="work-intro__grid">
            <div className="work-intro__label">
              <span className="eyebrow">A VISUAL REGISTER</span>
              <span className="meta">CATALOGUE / V2.0</span>
            </div>

            <div className="work-intro__text">
              <p className="lead">
                摄影并不总是为了说明什么。有时候，它只是让我们停下来，
                重新看一眼那些已经习以为常的事物。
              </p>
              <p className="prose">
                这里的每一格画面都在处理同一件事：如何在普通的城市里，
                保留一次注视的长度。分类只是阅读的辅助，不是结论——
                同一张照片可以同时属于色彩与遮挡，也可以同时属于天气与日常。
              </p>
            </div>

            <dl className="work-intro__facts">
              <div>
                <dt className="meta">PLATES</dt>
                <dd>16</dd>
              </div>
              <div>
                <dt className="meta">CATEGORIES</dt>
                <dd>{counts.length}</dd>
              </div>
              <div>
                <dt className="meta">DATING</dt>
                <dd>1950—1970</dd>
              </div>
              <div>
                <dt className="meta">STATUS</dt>
                <dd>STUDY COPIES</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section
        className="section work-gallery theme-paper"
        id="collection"
        aria-label="作品列表"
      >
        <div className="container">
          <WorkGallery />

          <div className="work-gallery__note">
            <p className="meta">CATALOGUE NOTE</p>
            <p>
              全部 16 幅作品均为索尔·雷特原作，版权归 Estate of Saul Leiter
              所有；本站以非商业的编辑性研究方式呈现，未获遗产管理方或
              Saul Leiter Foundation 的授权。作品年份依据基金会公开目录，
              约数与区间表述保持原样。完整来源与权利说明见{" "}
              <Link href="/archive/#credits">数字档案的版权说明</Link>。
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight work-next theme-paper-dark">
        <div className="container work-next__inner">
          <div>
            <span className="eyebrow">CONTINUE THE EXHIBITION</span>
            <p className="display display--md">阅读观看的方式，而不只是结果。</p>
          </div>
          <div className="cluster">
            <ArrowLink href="/vision/">进入视觉专题</ArrowLink>
            <ArrowLink href="/archive/">打开数字档案</ArrowLink>
          </div>
        </div>
      </section>

      <p className="work-creditline container meta">{site.curator}</p>

      <div className="work-return container">
        <Link href="/" className="link-line">
          返回展览首页
          <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
        </Link>
      </div>
    </>
  );
}
