import type { Metadata } from "next";

/**
 * The production URL is read from NEXT_PUBLIC_SITE_URL at build time.
 * Set it in .env before `npm run build` so canonical URLs, Open Graph images,
 * robots.txt and sitemap.xml point at the real deployment.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://a-quiet-gaze.example";

export const SITE_NAME = "Saul Leiter — A Quiet Gaze";
export const SITE_DESCRIPTION =
  "静默的凝视：一场关于索尔·雷特的独立线上摄影展。通过色彩、遮挡、雨雪与日常，进入他安静而持久的观看方式。";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Path relative to /public. Defaults to the exhibition cover. */
  image?: string;
  type?: "website" | "article";
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/og/cover.jpg",
  type = "website",
}: PageMetaInput): Metadata {
  const canonical = path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: "zh_CN",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "A QUIET GAZE — an independent Saul Leiter exhibition",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
