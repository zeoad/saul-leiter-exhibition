import type { ReactNode } from "react";
import Image from "next/image";

type PageHeroProps = {
  kicker: string;
  topRight: string;
  title: ReactNode;
  lead: string;
  aside?: ReactNode;
  theme?: "paper" | "ink" | "paper-dark" | "teal";
  /** Background photograph; the hero reads as a lit wall. */
  bg: string;
  bgAlt?: string;
  position?: string;
};

/**
 * The opening wall of every subpage. A single photograph sits behind the
 * title at low exposure, so the chapter starts already inside the exhibition.
 */
export default function PageHero({
  kicker,
  topRight,
  title,
  lead,
  aside,
  theme = "ink",
  bg,
  bgAlt = "",
  position = "50% 50%",
}: PageHeroProps) {
  const paper = theme === "paper" || theme === "paper-dark";

  return (
    <section className={`page-hero${paper ? " page-hero--paper" : ""}`}>
      <div className="page-hero__bg" aria-hidden="true">
        <Image
          src={bg}
          alt={bgAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: position }}
        />
      </div>
      <div className="page-hero__scrim" aria-hidden="true" />

      <div className="wrap page-hero__inner">
        <div className="page-hero__top">
          <span className="eyebrow" lang="en">
            {kicker}
          </span>
          <span className="mono" lang="en">
            {topRight}
          </span>
        </div>

        <h1 className="page-hero__title display" lang="en">
          {title}
        </h1>

        <div className="page-hero__foot">
          <p className="page-hero__lede">{lead}</p>
          {aside ? (
            <div className="page-hero__aside" lang="en">
              {aside}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
