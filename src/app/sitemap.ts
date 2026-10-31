import type { MetadataRoute } from "next";

import { getAllPhotographs } from "@/lib/gallery";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-01-01T00:00:00.000Z");

  const pages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/work/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/vision/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/life/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/archive/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const plates: MetadataRoute.Sitemap = getAllPhotographs().map((photo) => ({
    url: `${SITE_URL}/work/${photo.slug}/`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...plates];
}
