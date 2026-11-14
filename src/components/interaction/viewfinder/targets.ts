import { photographs } from "@/data/photographs";
import { plateNumber } from "@/lib/viewfinder";

export interface Target {
  plate: number;
  rect: DOMRect;
}

/** Minimum on-screen size for an anchor to count as a shootable plate. */
const MIN_WIDTH = 96;
const MIN_HEIGHT = 72;
/** Forgiving margin around a plate so the reticle does not demand precision. */
const HIT_MARGIN = 12;

/** "plate-03.webp" and the responsive "plate-03-960.webp" both resolve. */
const PLATE_IN_SRC = /plate-(\d+)/;

function plateFromElement(node: Element): number | null {
  const attr = node.getAttribute("data-vf-plate");
  if (attr) {
    const parsed = Number(attr);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const image = node instanceof HTMLImageElement ? node : null;
  const src = image
    ? `${image.currentSrc || image.src || ""} ${image.getAttribute("src") ?? ""}`
    : node.getAttribute("href") ?? "";
  const match = src.match(PLATE_IN_SRC);
  return match ? Number(match[1]) : null;
}

function isShootable(node: Element, rect: DOMRect): boolean {
  if (rect.width < MIN_WIDTH || rect.height < MIN_HEIGHT) return false;
  if (rect.bottom < 0 || rect.top > window.innerHeight) return false;
  if (rect.right < 0 || rect.left > window.innerWidth) return false;

  const style = window.getComputedStyle(node);
  if (style.visibility === "hidden" || style.opacity === "0") return false;

  return true;
}

/**
 * Re-scan the exhibition for plate targets that are currently on screen.
 *
 * The plates appear in many different shapes across the site — contact-sheet
 * proofs on /work, prints under the lamp on /life, the archive wheel, the four
 * doors on the cover — so the scan looks at the images themselves inside
 * <main>, plus any explicitly tagged `[data-vf-plate]` element. Anchors move as
 * images settle or the viewport changes, so the HUD calls this on open, on
 * resize, and on a slow interval while it is visible.
 */
export function collectPlateTargets(): Target[] {
  const next: Target[] = [];
  const seen = new Set<string>();

  const remember = (node: Element, plate: number) => {
    const rect = node.getBoundingClientRect();
    if (!isShootable(node, rect)) return;

    /* A plate can be printed more than once on a page (proof + enlargement),
       but the exact same frame should not be pushed twice. */
    const key = `${plate}:${Math.round(rect.left)}:${Math.round(rect.top)}:${Math.round(
      rect.width
    )}:${Math.round(rect.height)}`;
    if (seen.has(key)) return;
    seen.add(key);

    next.push({ plate, rect });
  };

  const knownPlate = (plate: number) =>
    photographs.some((photo) => plateNumber(photo.plate) === plate);

  document.querySelectorAll<HTMLElement>("main [data-vf-plate]").forEach((node) => {
    const plate = plateFromElement(node);
    if (plate !== null && knownPlate(plate)) remember(node, plate);
  });

  document.querySelectorAll<HTMLImageElement>("main img").forEach((node) => {
    const plate = plateFromElement(node);
    if (plate !== null && knownPlate(plate)) remember(node, plate);
  });

  /* Fallback for routes that present a plate as a bare lightbox link. */
  if (next.length === 0) {
    document
      .querySelectorAll<HTMLAnchorElement>("a[data-pswp-lightbox]")
      .forEach((node) => {
        const plate = plateFromElement(node);
        if (plate !== null && knownPlate(plate)) remember(node, plate);
      });
  }

  return next;
}

/** Which plate, if any, sits under a point? */
export function matchTarget(
  targets: Target[],
  clientX: number,
  clientY: number
): number | null {
  const hit = targets.find(
    (target) =>
      clientX >= target.rect.left - HIT_MARGIN &&
      clientX <= target.rect.right + HIT_MARGIN &&
      clientY >= target.rect.top - HIT_MARGIN &&
      clientY <= target.rect.bottom + HIT_MARGIN
  );
  return hit?.plate ?? null;
}
