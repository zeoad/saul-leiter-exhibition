import type { ReactNode } from "react";

type PageHeroProps = {
  kicker: string;
  topRight: string;
  title: ReactNode;
  lead: string;
  aside?: ReactNode;
  theme?: "paper" | "ink" | "paper-dark" | "teal";
};

export default function PageHero({
  kicker,
  topRight,
  title,
  lead,
  aside,
  theme = "paper",
}: PageHeroProps) {
  return (
    <section className={`page-hero theme-${theme}`}>
      <div className="container">
        <div className="page-hero__top">
          <span className="eyebrow">{kicker}</span>
          <span className="meta">{topRight}</span>
        </div>

        <h1 className="page-hero__title display" lang="en">
          {title}
        </h1>

        <div className="page-hero__bottom">
          <p className="page-hero__lead">{lead}</p>
          {aside ? <div className="page-hero__aside">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
