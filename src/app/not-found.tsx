import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Nothing Here",
  description: "这一格画面里没有内容。回到展览首页继续观看。",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="not-found theme-ink">
      <div className="container">
        <div className="not-found__inner">
          <span className="eyebrow">404 / OFF THE FRAME</span>

          <h1 className="display display--xl not-found__title" lang="en">
            NOTHING
            <br />
            <em>HERE.</em>
          </h1>

          <p className="not-found__text">
            这一格画面里没有内容。也许它被前景遮挡了，
            也许它从未被拍摄。回到展厅，那里还有很多值得停留的角落。
          </p>

          <div className="not-found__actions">
            <Link href="/" className="btn btn--ghost-light">
              返回展览首页
            </Link>
            <Link href="/work/" className="btn btn--ghost-light">
              浏览作品集
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
