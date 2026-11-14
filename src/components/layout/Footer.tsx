import Link from "next/link";

import { site } from "@/data/exhibition";

const SOURCES = [
  { label: "Saul Leiter Foundation", href: "https://www.saulleiterfoundation.org/" },
  { label: "The Museum of Modern Art", href: "https://www.moma.org/" },
  { label: "Steidl", href: "https://steidl.de/" },
];

/**
 * The footer is a single end-credit line, not another index. The long-form
 * rights copy lives in a native disclosure so it costs one line until opened.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__line">
          <span className="site-footer__mark">
            © 2026 A QUIET GAZE · EDITORIAL STUDY
          </span>

          <div className="site-footer__sources">
            <span lang="en">SOURCES</span>
            {SOURCES.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {source.label}
              </a>
            ))}
          </div>

          <div className="site-footer__actions">
            <details className="footer-colophon">
              <summary>
                <span lang="en">COLOPHON</span>
              </summary>
              <div className="footer-colophon__body">
                <p>{site.description}</p>
                <p>{site.disclaimer}</p>
                <p>{site.rightsLine}</p>
                <p>{site.assetNotice}</p>
              </div>
            </details>

            <Link href="#top" className="site-footer__top" lang="en">
              BACK TO TOP ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
