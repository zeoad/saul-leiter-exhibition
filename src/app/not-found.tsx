import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * 404 — a blank frame on the contact sheet.
 */
export default function NotFound() {
  return (
    <section className="notfound tone-dark" aria-labelledby="notfound-title">
      <div className="notfound__bg" aria-hidden="true">
        <Image
          src="/images/photographs/plate-16.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: "50% 40%" }}
        />
      </div>
      <div className="notfound__gate" aria-hidden="true" />

      <div className="wrap notfound__inner">
        <span className="eyebrow" lang="en">
          404 / LOST FRAME
        </span>

        <p className="notfound__num" aria-hidden="true">
          4<em>0</em>4
        </p>

        <h1 id="notfound-title" className="page-hero__title display" lang="en">
          THIS FRAME
          <br />
          <em>IS EMPTY.</em>
        </h1>

        <div className="notfound__copy">
          <p>
            你走到了一张没有曝光的底片。它可能被移走了，也可能从未存在。
            回到展厅，那里还有十六张照片在等你。
          </p>

          <div className="page-outro__actions">
            <Link href="/work/" className="btn">
              <ArrowLeft aria-hidden="true" strokeWidth={1.5} />
              返回作品集
            </Link>
            <Link href="/" className="btn">
              回到封面
              <ArrowRight aria-hidden="true" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
