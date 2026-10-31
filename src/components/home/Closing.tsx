import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { homeCopy, site } from "@/data/exhibition";

export default function Closing() {
  const copy = homeCopy.closing;

  return (
    <section
      id="closing"
      className="closing theme-paper"
      aria-labelledby="closing-title"
    >
      <div className="closing__media">
        <Image
          src="/images/hero/closing-quiet.webp"
          alt="《Sidewalk》（人行道），1954，索尔·雷特：戴礼帽的男人站在被强光切开的空街上。"
          fill
          sizes="100vw"
          className="closing__image"
        />
        <span className="closing__scrim" aria-hidden="true" />

        <div className="container closing__media-inner">
          <span className="eyebrow">SECTION 11 / CLOSING ESSAY</span>
          <h2 id="closing-title" className="closing__title" lang="en">
            LOOK
            <br />
            <em>AGAIN.</em>
          </h2>
          <p className="closing__media-cn">离开之前，再看一次。</p>
          <p className="closing__credit">
            SIDEWALK, 1954 · © ESTATE OF SAUL LEITER
          </p>
        </div>
      </div>

      <div className="container closing__body">
        <div className="closing__essay" data-reveal="group">
          {copy.paragraphs.map((paragraph) => (
            <p className="prose" key={paragraph.slice(0, 12)}>
              {paragraph}
            </p>
          ))}
        </div>

        <p className="closing__line" data-reveal="text">
          {copy.closingLine}
        </p>

        <div className="closing__actions">
          <Link href="/work/" className="btn btn--solid">
            浏览全部作品
            <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
          </Link>
          <Link href="/archive/" className="btn">
            打开数字档案
            <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="closing__signature">
          <span className="meta">{site.curator}</span>
          <span className="meta">{site.season}</span>
          <span className="meta">NEW YORK / ONLINE</span>
        </div>
      </div>
    </section>
  );
}
