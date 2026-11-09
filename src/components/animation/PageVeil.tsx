"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

/**
 * THE FILM GATE — the transition between two rooms of the exhibition.
 *
 * Two black panels close from the top and bottom edges, a sprocket line and
 * a single word appear, the next route is asked for, then the panels part
 * again. Nothing is shared between routes; the curtain is the point.
 */
export default function PageVeil() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sprocketTopRef = useRef<HTMLDivElement>(null);
  const sprocketBottomRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  const normalise = (path: string) =>
    path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

  const reset = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    root.setAttribute("data-phase", "");
    busyRef.current = false;
  }, []);

  const playOut = useCallback(
    (target: string) => {
      const root = rootRef.current;
      const top = topRef.current;
      const bottom = bottomRef.current;
      const word = wordRef.current;
      const bar = barRef.current;
      const st = sprocketTopRef.current;
      const sb = sprocketBottomRef.current;

      if (!root || !top || !bottom || !word || !bar || !st || !sb) {
        router.push(target);
        return;
      }

      gsap.killTweensOf([top, bottom, word, bar, st, sb]);
      gsap.set(top, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(bottom, { scaleY: 0, transformOrigin: "bottom center" });
      gsap.set([word, st, sb], { opacity: 0 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      root.setAttribute("data-phase", "out");

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(target);
        },
      });

      tl.to([top, bottom], {
        scaleY: 1,
        duration: 0.52,
        ease: "power4.inOut",
      })
        .to([st, sb], { opacity: 1, duration: 0.22, ease: "power2.out" }, 0.18)
        .to(word, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.26)
        .to(bar, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 0.2);

      window.setTimeout(() => {
        if (busyRef.current) reset();
      }, 2400);
    },
    [reset, router]
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;

      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.hasAttribute("data-pswp-lightbox")) return;
      if (anchor.hasAttribute("data-no-transition")) return;

      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(raw, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const nextPath = normalise(url.pathname);
      const currentPath = normalise(window.location.pathname);

      // Same page, only an anchor changes: let the smooth-scroll handler work.
      if (nextPath === currentPath && url.hash) return;
      if (nextPath === currentPath && !url.hash) return;

      if (busyRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      busyRef.current = true;
      pendingRef.current = nextPath;
      playOut(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [playOut]);

  useEffect(() => {
    if (!pendingRef.current) return;
    if (normalise(pathname) !== pendingRef.current) return;

    pendingRef.current = null;

    const root = rootRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const word = wordRef.current;
    const bar = barRef.current;
    const st = sprocketTopRef.current;
    const sb = sprocketBottomRef.current;

    if (!root || !top || !bottom || !word || !bar || !st || !sb) {
      reset();
      return;
    }

    gsap.killTweensOf([top, bottom, word, bar, st, sb]);
    root.setAttribute("data-phase", "in");

    const tl = gsap.timeline({ onComplete: reset });
    tl.to(word, { opacity: 0, duration: 0.22, ease: "power2.in" }, 0)
      .to(bar, { scaleX: 0, duration: 0.3, ease: "power2.in" }, 0)
      .to(
        [top, bottom],
        { scaleY: 0, duration: 0.75, ease: "power4.inOut" },
        0.18
      )
      .to([st, sb], { opacity: 0, duration: 0.18, ease: "power2.in" }, 0.18);

    window.dispatchEvent(new Event("aqg:page"));
  }, [pathname, reset]);

  return (
    <div ref={rootRef} className="veil" aria-hidden="true" data-phase="">
      <div ref={topRef} className="veil__panel veil__panel--top" />
      <div ref={bottomRef} className="veil__panel veil__panel--bottom" />
      <div className="veil__inner">
        <div className="veil__sprocket veil__sprocket--top" ref={sprocketTopRef} />
        <div ref={wordRef} className="veil__word">
          <span>Saul Leiter</span>
          <span>A QUIET GAZE · 1923—2013</span>
        </div>
        <div ref={barRef} className="veil__bar" />
        <div
          className="veil__sprocket veil__sprocket--bottom"
          ref={sprocketBottomRef}
        />
      </div>
    </div>
  );
}
