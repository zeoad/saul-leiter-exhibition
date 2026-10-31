import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PlateFigure from "@/components/ui/PlateFigure";
import { getFeaturedPhotographs, getPlateCountLabel } from "@/lib/gallery";

export default function SelectedWorks() {
  const works = getFeaturedPhotographs();

  return (
    <section
      id="selected-works"
      className="section works theme-paper"
      aria-labelledby="works-title"
    >
      <div className="container">
        <header className="works__head">
          <div>
            <span className="eyebrow">SECTION 09 / SELECTED WORKS</span>
            <h2 id="works-title" className="display display--lg" lang="en">
              SELECTED
              <br />
              <em>WORKS</em>
            </h2>
          </div>

          <div className="works__head-aside">
            <p className="kicker">精选作品</p>
            <p className="prose">
              九张作品，五种观看。点击图片进入大图，作品编号链接至完整档案。
              所有照片均为索尔·雷特原作，版权归 Estate of Saul Leiter 所有。
            </p>
            <Link href="/work/" className="link-line">
              VIEW ALL {getPlateCountLabel()}
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        <div className="works__grid">
          {works.map((photo, index) => (
            <PlateFigure
              key={photo.slug}
              photo={photo}
              className={`works__item works__item--${index + 1}`}
              sizes="(max-width: 767px) 100vw, (max-width: 1180px) 45vw, 30vw"
              detailLink
            />
          ))}
        </div>

        <div className="works__foot">
          <p className="meta">A QUIET GAZE · PLATE REGISTER 001—016</p>
          <Link href="/work/" className="btn">
            浏览全部作品
            <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
