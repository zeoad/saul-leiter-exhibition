/**
 * Generates responsive WebP variants for every image under public/images.
 *
 * For each source image `name.webp` this emits `name-480.webp`,
 * `name-960.webp` and `name-1600.webp` — but only for widths strictly
 * smaller than the source, so files are never upscaled.
 *
 * It also writes src/generated/image-manifest.json mapping each public
 * src ("/images/...") to the available variant widths. The custom
 * next/image loader (src/lib/image-loader.ts) reads that manifest to
 * build srcset URLs; widths above the largest variant resolve to the
 * original file.
 *
 * Runs automatically via the `predev`/`prebuild` npm hooks, or directly:
 *   node scripts/responsive-images.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGES_ROOT = path.resolve("public/images");
const MANIFEST_PATH = path.resolve("src/generated/image-manifest.json");
const WIDTHS = [480, 960, 1600];
const QUALITY = 80;
// Matches only our generated buckets — source names like "plate-01.webp"
// or "detail-05.webp" must NOT be treated as variants.
const VARIANT_SUFFIX = /-(480|960|1600)\.webp$/;

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith(".webp")) yield full;
  }
}

const toPublicSrc = (file) =>
  `/${path.relative(path.resolve("public"), file).split(path.sep).join("/")}`;

async function isFresh(file, sourceMtime) {
  try {
    const stat = await fs.stat(file);
    return stat.mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

async function main() {
  const manifest = {};
  let generated = 0;
  let skipped = 0;

  for await (const file of walk(IMAGES_ROOT)) {
    if (VARIANT_SUFFIX.test(file)) continue;

    const source = sharp(file);
    const metadata = await source.metadata();
    const sourceWidth = metadata.width ?? 0;
    const widths = WIDTHS.filter((width) => width < sourceWidth);
    if (widths.length === 0) continue;

    const src = toPublicSrc(file);
    manifest[src] = widths;

    const sourceMtime = (await fs.stat(file)).mtimeMs;
    for (const width of widths) {
      const outFile = file.replace(/\.webp$/, `-${width}.webp`);
      if (await isFresh(outFile, sourceMtime)) {
        skipped += 1;
        continue;
      }
      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outFile);
      generated += 1;
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  );
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);

  console.log(
    `Responsive images: ${generated} generated, ${skipped} up to date, ` +
      `${Object.keys(sorted).length} sources in manifest.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
