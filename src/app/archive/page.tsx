import type { Metadata } from "next";
import Link from "next/link";

import ArchiveIndex from "@/components/gallery/ArchiveIndex";
import { credits, site } from "@/data/exhibition";
import { sources } from "@/data/timeline";
import {
  getAllPhotographs,
  getCategoryCounts,
  getDatedCount,
} from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Archive — Digital Image Index",
  description:
    "数字摄影档案：按标题、编号、类别与年份检索 16 幅索尔·雷特作品，查看缩略图、来源、年份与版权状态。",
  path: "/archive/",
});

export default function ArchivePage() {
  const total = getAllPhotographs().length;
  const categories = getCategoryCounts().length;
  const dated = getDatedCount();

  return (
    <>
      <section className="archive" aria-label="数字档案索引">
        <div className="wrap">
          <div className="archive__top">
            <Link href="/" className="eyebrow" lang="en">
              ← BACK TO THE EXHIBITION
            </Link>
            <p className="archive__lead">
              一个关于影像、时间与观看方式的索引。每一条记录都标明来源、
              年份与权利状态；它不是完整的作品目录，但每一条都尽量准确。
            </p>
            <span className="archive__count" lang="en">
              {String(total).padStart(2, "0")} PLATES · {categories} CATEGORIES
              · {dated} DATED
            </span>
          </div>

          <ArchiveIndex />
        </div>
      </section>

      <section className="archive-credits tone-paper" id="credits">
        <div className="wrap">
          <header className="archive-credits__head">
            <div>
              <span className="eyebrow" lang="en">
                IMAGE POLICY / 版权与素材
              </span>
              <h2 className="display" lang="en">
                HONEST
                <br />
                <em>MATERIALS.</em>
              </h2>
            </div>
            <p>
              一个摄影展如果对素材来源含糊，就很难谈「观看」。这里把话说清楚：
              图像是索尔·雷特的原作，版权属于遗产管理方；本站是非商业的独立
              研究，不是官方发布，也没有获得授权。
            </p>
          </header>

          <div className="archive-credits__grid">
            <article className="archive-credit">
              <span className="archive-credit__label" lang="en">
                01 / IMAGES
              </span>
              <h3>这些照片是什么</h3>
              <p>{site.assetNotice}</p>
              <p>
                完整的逐张清单、尺寸、作品名与年份，见{" "}
                <a
                  href="/images/ASSET-CREDITS.md"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  素材与版权清单（Markdown）
                </a>
                。
              </p>
            </article>

            <article className="archive-credit">
              <span className="archive-credit__label" lang="en">
                02 / DATING
              </span>
              <h3>年份如何标注</h3>
              <p>
                作品名与年份依据 Saul Leiter Foundation 的公开作品目录。
                目录中的「c.」「1950s」「1952–1953」等表述被原样保留，不擅自
                补写成精确年份，也不为了整齐而统一年代。
              </p>
              <p>
                档案中的年份筛选基于这些标注，因此会把约数与区间视为独立条目。
              </p>
            </article>

            <article className="archive-credit">
              <span className="archive-credit__label" lang="en">
                03 / LICENSING
              </span>
              <h3>授权状态</h3>
              <p>
                本站在 <code>usage</code> 字段中记录权利状态。当前 16 件均为{" "}
                <code>editorial-study</code>：真实作品，但没有商业授权。
                公开部署或任何商业使用前，必须向 Estate of Saul Leiter /
                Saul Leiter Foundation 取得许可。
              </p>
              <p>
                若取得授权，将对应记录改为{" "}
                <code>usage: &quot;licensed&quot;</code> 并更新{" "}
                <code>rights</code> 字段，界面会自动显示为已授权。
              </p>
            </article>

            <article className="archive-credit">
              <span className="archive-credit__label" lang="en">
                04 / EDITION
              </span>
              <h3>版本与声明</h3>
              <p>{site.disclaimer}</p>
              <p>
                展览文字为策展写作，不构成学术结论。年表来源见{" "}
                <Link href="/life/">生平页面</Link>。
              </p>
            </article>
          </div>

          <div className="archive-credits__sources">
            <p className="mono" lang="en">
              SOURCES / 参考资料
            </p>
            <ul>
              {sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span lang="en">{source.label}</span>
                    <span className="archive-credits__note">
                      {source.note}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="archive-colophon">
            <p className="mono">COLOPHON</p>
            <dl>
              <div>
                <dt>CURATOR</dt>
                <dd>{credits.curator}</dd>
              </div>
              <div>
                <dt>TYPE</dt>
                <dd>{credits.typefaces}</dd>
              </div>
              <div>
                <dt>TECHNOLOGY</dt>
                <dd>{credits.technology}</dd>
              </div>
              <div>
                <dt>NOTE</dt>
                <dd>{credits.colophon}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="page-outro tone-dark">
        <div className="wrap page-outro__inner">
          <span className="eyebrow" lang="en">
            END OF INDEX
          </span>
          <h2 className="display" lang="en">
            KEEP
            <br />
            <em>LOOKING.</em>
          </h2>
          <p>索引只是入口。真正值得花时间的，仍然是那些画面本身。</p>
          <div className="page-outro__actions">
            <Link href="/work/" className="btn">
              返回作品集
            </Link>
            <Link href="/vision/" className="btn">
              重读视觉专题
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
