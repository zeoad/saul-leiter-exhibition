import Link from "next/link";

import { credits, navLinks, site } from "@/data/exhibition";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="footer-brand">
            <p className="footer-brand__title" lang="en">
              SAUL LEITER
              <br />
              <em>A Quiet Gaze</em>
            </p>
            <p className="footer-brand__statement">
              一场关于观看方式的展览。不是回顾一位大师，而是借用他的眼睛，
              重新看一眼我们每天经过的城市。
            </p>
            <p className="meta" style={{ color: "rgba(234,230,222,.42)" }}>
              静默的凝视 · 在日常中发现诗意
            </p>
          </div>

          <nav className="footer-nav" aria-label="页脚导航">
            <p className="footer-heading">EXHIBITION</p>
            <div className="footer-links">
              <Link href="/">
                <span className="footer-links__index">00</span> HOME
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="footer-links__index">{link.index}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="footer-index">
            <p className="footer-heading">COLOPHON</p>
            <div className="footer-index__item">
              <span>EDITION</span>
              <span>{credits.edition}</span>
            </div>
            <div className="footer-index__item">
              <span>PLATES</span>
              <span>16 / SAUL LEITER</span>
            </div>
            <div className="footer-index__item">
              <span>BUILT WITH</span>
              <span>NEXT.JS / GSAP</span>
            </div>
            <div className="footer-index__item">
              <span>TYPE</span>
              <span>SERIF / SANS / SONG</span>
            </div>
          </div>

          <div className="footer-note">
            <p>
              <strong style={{ color: "rgba(234,230,222,.72)" }}>
                关于图像：
              </strong>{" "}
              {site.assetNotice}{" "}
              <Link href="/archive/#credits">查看素材与版权说明 →</Link>
            </p>
            <p>
              <strong style={{ color: "rgba(234,230,222,.72)" }}>
                关于本站：
              </strong>{" "}
              {site.disclaimer}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 A QUIET GAZE — INDEPENDENT EDITORIAL PROJECT</span>
          <span>
            <a href="#top">BACK TO TOP ↑</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
