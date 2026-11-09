/**
 * Shared state for THE VIEWFINDER — the small capture game layered over the
 * exhibition. Kept in one module so the desk camera, the HUD and any future
 * entry point agree on the storage key and the progress event.
 */

export const FOUND_KEY = "saul-leiter:viewfinder:found:v1";
export const PROGRESS_EVENT = "viewfinder:progress";
export const OPEN_EVENT = "viewfinder:open";

export function readFound(): number[] {
  try {
    const raw = window.localStorage.getItem(FOUND_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (value): value is number => typeof value === "number" && Number.isFinite(value)
    );
  } catch {
    return [];
  }
}

export function writeFound(next: number[]) {
  try {
    window.localStorage.setItem(FOUND_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — progress stays for this session only */
  }
  window.dispatchEvent(
    new CustomEvent<number>(PROGRESS_EVENT, { detail: next.length })
  );
}

export function openViewfinder() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/** "PL. 006" → 6 */
export function plateNumber(plate: string): number {
  return Number(plate.replace(/\D/g, ""));
}
