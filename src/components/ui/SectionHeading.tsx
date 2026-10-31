import type { ReactNode } from "react";

type SectionHeadingProps = {
  number: string;
  label: string;
  lines: string[];
  cn?: string;
  aside?: ReactNode;
  emphasis?: "none" | "last" | "first" | "all";
  width?: "default" | "wide";
  className?: string;
};

export default function SectionHeading({
  number,
  label,
  lines,
  cn,
  aside,
  emphasis = "last",
  width = "default",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={[
        "section-head",
        width === "wide" ? "section-head--wide" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="section-head__label">
        <span className="eyebrow">{label}</span>
        <span className="section-number">SECTION {number}</span>
        {cn ? <span className="kicker">{cn}</span> : null}
      </div>

      <h2 className="display display--lg section-head__title" lang="en">
        {lines.map((line, index) => (
          <span className="section-head__line" key={`${line}-${index}`}>
            {emphasis === "all" ||
            (emphasis === "last" && index === lines.length - 1) ||
            (emphasis === "first" && index === 0) ? (
              <em>{line}</em>
            ) : (
              line
            )}
            {index < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </h2>

      {aside ? <div className="section-head__aside">{aside}</div> : null}
    </header>
  );
}
