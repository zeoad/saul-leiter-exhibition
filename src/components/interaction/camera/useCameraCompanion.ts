"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { photographs } from "@/data/photographs";
import type { Photograph } from "@/types";
import { startScroll, stopScroll } from "@/lib/lenis";
import {
  PROGRESS_EVENT,
  openViewfinder,
  plateNumber,
  readFound,
} from "@/lib/viewfinder";
import {
  CLICK_WINDOW,
  CLICKS_NEEDED,
  COPY,
  DWELL_NEEDED,
  HOVER_LINES,
  SLEEP_AFTER,
  type Bubble,
  type CameraState,
} from "./copy";

/**
 * The desk camera's state machine. Everything that touches the DOM (idle
 * timers, scroll drift, cursor tracking, the two hidden eggs) lives here so
 * `LittleCamera` can stay a thin renderer.
 */
export function useCameraCompanion() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [state, setState] = useState<CameraState>("idle");
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [panelPhoto, setPanelPhoto] = useState<Photograph | null>(null);
  const [foundCount, setFoundCount] = useState(0);
  const [blink, setBlink] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);
  const bubbleTimer = useRef(0);
  const sleepTimer = useRef(0);
  const blinkTimer = useRef(0);
  const clickTimes = useRef<number[]>([]);
  const dwell = useRef<{ key: string; start: number } | null>(null);
  const exitSeen = useRef(false);

  /* ---- mount + collection progress -------------------------------------- */
  useEffect(() => {
    setReady(true);
    setFoundCount(readFound().length);
  }, []);

  useEffect(() => {
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail;
      setFoundCount(typeof detail === "number" ? detail : readFound().length);
    };
    window.addEventListener(PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, onProgress);
  }, []);

  const showBubble = useCallback((next: Bubble, autoHide = 4_000) => {
    window.clearTimeout(bubbleTimer.current);
    setBubble(next);
    if (autoHide > 0) {
      bubbleTimer.current = window.setTimeout(() => setBubble(null), autoHide);
    }
  }, []);

  /* ---- Darkroom panel ---------------------------------------------------- */
  const openDarkroom = useCallback((photo?: Photograph) => {
    const pick =
      photo ?? photographs[Math.floor(Math.random() * photographs.length)];
    setPanelPhoto(pick);
    setBubble(null);
    stopScroll();
  }, []);

  const closeDarkroom = useCallback(() => {
    setPanelPhoto(null);
    startScroll();
    setState("idle");
  }, []);

  useEffect(() => {
    if (!panelPhoto) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDarkroom();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelPhoto, closeDarkroom]);

  /* ---- greeting: one quiet line per page load ---------------------------- */
  useEffect(() => {
    if (!ready || dismissed) return;
    if (pathname !== "/") return;
    /* Keep the cover unobstructed on phones; the camera itself stays put. */
    if (window.innerWidth < 768) return;
    /* No unsolicited pop-up for reduced-motion visitors (also keeps the
       visual-regression captures deterministic). */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      showBubble(
        {
          text: COPY.greeting,
          actionLabel: COPY.greetingAction,
          onAction: openViewfinder,
        },
        7_000
      );
    }, 2_800);
    return () => window.clearTimeout(timer);
  }, [ready, dismissed, pathname, showBubble]);

  /* ---- blinking ---------------------------------------------------------- */
  useEffect(() => {
    if (!ready || dismissed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const loop = () => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 160);
      blinkTimer.current = window.setTimeout(loop, 3_200 + Math.random() * 3_800);
    };
    blinkTimer.current = window.setTimeout(loop, 2_400);
    return () => window.clearTimeout(blinkTimer.current);
  }, [ready, dismissed]);

  /* ---- SLEEP: idle timeout, wake on pointer activity ------------------- */
  useEffect(() => {
    if (!ready || dismissed) return;

    const arm = () => {
      window.clearTimeout(sleepTimer.current);
      sleepTimer.current = window.setTimeout(
        () => setState((s) => (s === "idle" ? "sleep" : s)),
        SLEEP_AFTER
      );
    };
    const wake = () => {
      setState((s) => (s === "sleep" ? "idle" : s));
      arm();
    };

    arm();
    window.addEventListener("pointermove", wake, { passive: true });
    return () => {
      window.clearTimeout(sleepTimer.current);
      window.removeEventListener("pointermove", wake);
    };
  }, [ready, dismissed]);

  /* ---- FOLLOW: subtle vertical drift with scroll ----------------------- */
  useEffect(() => {
    if (!ready || dismissed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let drift = 0;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const delta = window.scrollY - lastY;
        lastY = window.scrollY;
        drift = Math.max(-10, Math.min(10, drift + delta * 0.04));
        drift *= 0.85;
        const el = rootRef.current;
        if (el && Math.abs(drift) > 0.15) {
          el.style.transform = `translateY(${drift.toFixed(2)}px)`;
          setState((s) => (s === "idle" ? "follow" : s));
        } else if (el) {
          el.style.transform = "";
          setState((s) => (s === "follow" ? "idle" : s));
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ready, dismissed]);

  /* ---- the lens watches the cursor -------------------------------------- */
  useEffect(() => {
    if (!ready || dismissed) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = rootRef.current;
    const onMove = (event: MouseEvent) => {
      const pupil = pupilRef.current;
      if (!pupil || !root || !rootRef.current) return;
      const rect = root.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const range = state === "hover" ? 3.2 : 2;
      pupil.setAttribute(
        "transform",
        `translate(${(dx / dist) * range} ${(dy / dist) * range})`
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ready, dismissed, state]);

  /* ---- Egg: reaching the exit scene ------------------------------------- */
  useEffect(() => {
    if (!ready || dismissed) return;
    const exit = document.querySelector("[data-exit-scene]");
    if (!exit) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || exitSeen.current) continue;
          exitSeen.current = true;
          setState("secret");
          showBubble(
            {
              text: COPY.exitLine,
              actionLabel: COPY.exitAction,
              onAction: () => openDarkroom(),
            },
            0
          );
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(exit);
    return () => observer.disconnect();
  }, [ready, dismissed, openDarkroom, showBubble]);

  /* ---- Egg: lingering 8s over one photograph ---------------------------- */
  useEffect(() => {
    if (!ready || dismissed) return;

    const onOver = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.(
        "a[data-pswp-lightbox]"
      ) as HTMLAnchorElement | null;
      const href = anchor?.getAttribute("href") ?? "";
      const match = href.match(/plate-(\d+)/);
      if (!match) return;
      const key = match[1];
      if (dwell.current?.key === key) return;
      dwell.current = { key, start: performance.now() };
    };

    const onOut = (event: MouseEvent) => {
      /* Moving between children of the same anchor must not reset the dwell. */
      const from = (event.target as HTMLElement).closest?.(
        "a[data-pswp-lightbox]"
      );
      const to = (event.relatedTarget as HTMLElement | null)?.closest?.(
        "a[data-pswp-lightbox]"
      );
      if (from && from === to) return;
      dwell.current = null;
    };

    const tick = window.setInterval(() => {
      const current = dwell.current;
      if (!current) return;
      if (performance.now() - current.start < DWELL_NEEDED) return;
      const plate = Number(current.key);
      const photo = photographs.find((p) => plateNumber(p.plate) === plate);
      dwell.current = null;
      if (!photo) return;
      setState("secret");
      showBubble(
        {
          text: COPY.dwellLine,
          actionLabel: `${photo.plate} · ${photo.title.toUpperCase()}`,
          actionHref: `/work/${photo.slug}/`,
        },
        0
      );
    }, 500);

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [ready, dismissed, showBubble]);

  /* ---- click → viewfinder (or the five-click secret) ---------------------- */
  const onClick = useCallback(() => {
    setState("click");
    window.setTimeout(() => setState("idle"), 320);

    const now = performance.now();
    clickTimes.current = [...clickTimes.current, now].filter(
      (t) => now - t < CLICK_WINDOW
    );

    if (clickTimes.current.length >= CLICKS_NEEDED) {
      clickTimes.current = [];
      setState("secret");
      const pick = photographs[Math.floor(Math.random() * photographs.length)];
      showBubble(
        {
          text: COPY.secretLine,
          actionLabel: `${pick.plate} · ${pick.title.toUpperCase()}`,
          onAction: () => openDarkroom(pick),
        },
        0
      );
      return;
    }

    showBubble({ text: COPY.opening }, 1_200);
    window.setTimeout(() => {
      setBubble(null);
      openViewfinder();
    }, 360);
  }, [openDarkroom, showBubble]);

  const onEnter = useCallback(() => {
    setState((s) => (s === "sleep" ? s : "hover"));
    showBubble({
      text: HOVER_LINES[Math.floor(Math.random() * HOVER_LINES.length)],
    });
  }, [showBubble]);

  const onLeave = useCallback(() => {
    setState((s) => (s === "hover" ? "idle" : s));
    setBubble((b) =>
      b && !b.actionLabel && HOVER_LINES.includes(b.text) ? null : b
    );
  }, []);

  const dismiss = useCallback(() => setDismissed(true), []);

  return {
    ready,
    dismissed,
    state,
    blink,
    bubble,
    panelPhoto,
    foundCount,
    rootRef,
    pupilRef,
    onClick,
    onEnter,
    onLeave,
    dismiss,
    closeDarkroom,
  };
}
