import Link from "next/link";

import { navLinks, site } from "@/data/exhibition";

const SOURCES = [
  { label: "Saul Leiter Foundation", href: "https://www.saulleiterfoundation.org/" },
  { label: "The Museum of Modern Art", href: "https://www.moma.org/" },
  { label: "Steidl", href: "https://steidl.de/" },
];

const CHAPTERS = [
  { label: "The Cover", href: "/#cover" },
  { label: "Opening Statement", href: "/#statement" },
  { label: "New York", href: "/#new-york" },
  { label: "The Language of Color", href: "/#color" },
  { label: "Behind the Glass", href: "/#behind-the-glass" },
  { label: "Rain & Snow", href: "/#rain-and-snow" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span className="site-footer__word" lang="en">
          A QUIET <em>GAZE</em>.
        </span>

        <div className="site-footer__grid">
          <div>
            <p className="footer-col__head" lang="en">
              The Exhibition
            </p>
            <div className="footer-col__list">
              {CHAPTERS.map((chapter, index) => (
                <Link
                  key={chapter.href}
                  href={chapter.href}
                  className="footer-col__link"
                  lang="en"
                >
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  {chapter.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-col__head" lang="en">
              Rooms
            </p>
            <div className="footer-col__list">
              <Link href="/" className="footer-col__link" lang="en">
                <i>00</i>Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-col__link"
                  lang="en"
                >
                  <i>{link.index}</i>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-col__head" lang="en">
              Sources
            </p>
            <div className="footer-col__list">
              {SOURCES.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-col__link"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col--statement">
            <p className="footer-col__head" lang="en">
              Colophon
            </p>
            <p className="footer-statement">
              {site.description}
              <br />
              <span className="footer-note">
                {site.disclaimer}
              <br />
                {site.rightsLine}
              </span>
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 A QUIET GAZE · EDITORIAL STUDY</span>
          <span lang="en">NEW YORK / ONLINE — 1923—2013</span>
          <Link href="#top" lang="en">
            BACK TO TOP ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
