import manifest from "@/generated/image-manifest.json";

/**
 * Custom next/image loader for the static export.
 *
 * scripts/responsive-images.mjs pre-generates `name-{480,960,1600}.webp`
 * variants next to each source image and records them in the manifest.
 * The loader picks the smallest variant that covers the requested width
 * and falls back to the original file when none is large enough — so
 * images are never upscaled and never 404.
 */
const widthsBySrc = manifest as Record<string, number[]>;

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const available = widthsBySrc[src];
  if (!available) return src;
  const target = available.find((candidate) => candidate >= width);
  if (target === undefined) return src;
  return src.replace(/\.webp$/, `-${target}.webp`);
}
