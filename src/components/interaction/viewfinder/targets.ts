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

/**
 * Re-scan the exhibition for plate anchors that are currently on screen.
 * Anchors move as images settle or the viewport changes, so the HUD calls this
 * on open, on resize, and on a slow interval while it is visible.
 */
export function collectPlateTargets(): Target[] {
  const nodes = document.querySelectorAll<HTMLAnchorElement>(
    'a[data-pswp-lightbox]'
  );
  const next: Target[] = [];

  nodes.forEach((node) => {
    const href = node.getAttribute("href") ?? "";
    const match = href.match(/plate-(\d+)/);
    if (!match) return;

    const plate = Number(match[1]);
    const photo = photographs.find((p) => plateNumber(p.plate) === plate);
    if (!photo) return;

    const rect = node.getBoundingClientRect();
    if (rect.width < MIN_WIDTH || rect.height < MIN_HEIGHT) return;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    next.push({ plate, rect });
  });

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
