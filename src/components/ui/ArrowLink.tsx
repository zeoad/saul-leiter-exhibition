import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export default function ArrowLink({
  href,
  children,
  className,
  ariaLabel,
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={["link-line", className ?? ""].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      {children}
      <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
    </Link>
  );
}
