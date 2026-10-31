import type Lenis from "lenis";

/**
 * A single module-level handle on the Lenis instance so that unrelated client
 * components (header menu lock, chapter rail) can coordinate smooth scrolling
 * without React context or prop drilling.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function scrollToTarget(target: string | number, offset = -88) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.15 });
    return;
  }

  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches
    ? "auto"
    : "smooth";

  if (typeof target === "string") {
    const element = document.querySelector<HTMLElement>(target);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    }
    return;
  }

  window.scrollTo({ top: target, behavior });
}

export function stopScroll() {
  getLenis()?.stop();
}

export function startScroll() {
  getLenis()?.start();
}
