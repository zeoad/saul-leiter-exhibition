"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { photographs } from "@/data/photographs";
import type { Photograph } from "@/types";
import { startScroll, stopScroll } from "@/lib/lenis";
import {
  PROGRESS_EVENT,
  openViewfinder,
  plateNumber,
  readFound,
} from "@/lib/viewfinder";

/**
 * LITTLE CAMERA — the exhibition's desk companion and the door to the
 * viewfinder game.
 *
 *   · always present (no persisted hiding: a refresh brings it back)
 *   · breathes, blinks, follows the cursor with its lens
 *   · click → opens THE VIEWFINDER
 *   · five rapid clicks → the hidden darkroom
 *   · linger 8s on a plate → "Look closer."
 *   · reach the exit scene → "Wait. One more photograph."
 */

type CameraState = "idle" | "hover" | "click" | "follow" | "sleep" | "secret";

interface Bubble {
  text: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const SLEEP_AFTER = 60_000;
const DWELL_NEEDED = 8_000;
const CLICK_WINDOW = 2_500;
const CLICKS_NEEDED = 5;

const HOVER_LINES = [
  "Take me to the viewfinder.",
  "Press me — let's go looking.",
  "There is more here than you think.",
];

export default function LittleCamera() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
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

  /* ---- greeting: one quiet line per page load ---------------------------- */
  useEffect(() => {
    if (!mounted || dismissed) return;
    if (pathname !== "/") return;
    /* Keep the cover unobstructed on phones; the camera itself stays put. */
    if (window.innerWidth < 768) return;
    const timer = window.setTimeout(() => {
      showBubble(
        {
          text: "I can show you the whole exhibition. Click me.",
          actionLabel: "OPEN THE VIEWFINDER",
          onAction: openViewfinder,
        },
        7_000
      );
    }, 2_800);
    return () => window.clearTimeout(timer);
  }, [mounted, dismissed, pathname, showBubble]);

  /* ---- blinking ---------------------------------------------------------- */
  useEffect(() => {
    if (!mounted || dismissed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const loop = () => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 160);
      blinkTimer.current = window.setTimeout(loop, 3_200 + Math.random() * 3_800);
    };
    blinkTimer.current = window.setTimeout(loop, 2_400);
    return () => window.clearTimeout(blinkTimer.current);
  }, [mounted, dismissed]);

  /* ---- SLEEP: idle timeout, wake on pointer activity ------------------- */
  useEffect(() => {
    if (!mounted || dismissed) return;

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
  }, [mounted, dismissed]);

  /* ---- FOLLOW: subtle vertical drift with scroll ----------------------- */
  useEffect(() => {
    if (!mounted || dismissed) return;
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
  }, [mounted, dismissed]);

  /* ---- the lens watches the cursor -------------------------------------- */
  useEffect(() => {
    if (!mounted || dismissed) return;
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
  }, [mounted, dismissed, state]);

  /* ---- Egg: reaching the exit scene ------------------------------------- */
  useEffect(() => {
    if (!mounted || dismissed) return;
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
              text: "Wait. One more photograph.",
              actionLabel: "OPEN THE DARKROOM",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, dismissed]);

  /* ---- Egg: lingering 8s over one photograph ---------------------------- */
  useEffect(() => {
    if (!mounted || dismissed) return;

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
          text: "Look closer.",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, dismissed]);

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

  /* ---- click → viewfinder (or the five-click secret) ---------------------- */
  const onClick = () => {
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
          text: "Click! A hidden frame, just for you.",
          actionLabel: `${pick.plate} · ${pick.title.toUpperCase()}`,
          onAction: () => openDarkroom(pick),
        },
        0
      );
      return;
    }

    showBubble({ text: "Opening the viewfinder…" }, 1_200);
    window.setTimeout(() => {
      setBubble(null);
      openViewfinder();
    }, 360);
  };

  const dismiss = () => setDismissed(true);

  if (!mounted || dismissed) return null;

  return (
    <>
      <div
        ref={rootRef}
        className="little-camera"
        data-state={state}
        data-blink={blink}
        onMouseEnter={() => {
          setState((s) => (s === "sleep" ? s : "hover"));
          showBubble({
            text: HOVER_LINES[Math.floor(Math.random() * HOVER_LINES.length)],
          });
        }}
        onMouseLeave={() => {
          setState((s) => (s === "hover" ? "idle" : s));
          setBubble((b) =>
            b && !b.actionLabel && HOVER_LINES.includes(b.text) ? null : b
          );
        }}
      >
        <button
          type="button"
          className="little-camera__body"
          onClick={onClick}
          aria-label="Little Camera：打开取景器，在展览里寻找照片"
        >
          <span className="little-camera__counter" lang="en">
            {String(foundCount).padStart(2, "0")}
          </span>

          <svg viewBox="0 0 96 76" aria-hidden="true" className="little-camera__svg">
            {/* strap */}
            <path
              d="M12 22 C2 26 -2 44 4 58 L10 56 C6 44 8 32 16 28 Z"
              fill="#596760"
              opacity="0.55"
            />
            {/* body */}
            <rect x="10" y="24" width="76" height="44" rx="4" fill="#343833" />
            <rect
              x="10"
              y="24"
              width="76"
              height="44"
              rx="4"
              fill="none"
              stroke="#596760"
              strokeWidth="1"
            />
            {/* top plate + prism */}
            <path
              d="M26 24 L34 12 H54 L62 24 Z"
              fill="#343833"
              stroke="#596760"
              strokeWidth="1"
            />
            <rect x="12" y="24" width="12" height="5" fill="#596760" opacity="0.6" />
            {/* shutter */}
            <circle
              cx="76"
              cy="18"
              r="6"
              fill="#A54838"
              className="little-camera__shutter"
            />
            <circle cx="76" cy="18" r="6" fill="none" stroke="#c4af91" strokeWidth="0.8" opacity="0.7" />
            {/* finder window */}
            <rect
              x="17"
              y="32"
              width="12"
              height="9"
              rx="1"
              fill="#252622"
              stroke="#85877c"
              strokeWidth="1"
            />
            <rect x="19" y="34" width="8" height="5" fill="#536d78" opacity="0.55" />
            {/* lens */}
            <circle cx="48" cy="46" r="15" fill="#252622" stroke="#85877c" strokeWidth="1.6" />
            <circle cx="48" cy="46" r="12" fill="none" stroke="#596760" strokeWidth="1" />
            <circle cx="48" cy="46" r="9" fill="#1b1d1a" />
            <circle
              ref={pupilRef}
              cx="48"
              cy="46"
              r="5.5"
              fill="#C4AF91"
              className="little-camera__pupil"
            />
            <circle cx="48" cy="46" r="2.2" fill="#252622" className="little-camera__pupil-core" />
            {/* eyelid for blinking / sleeping */}
            <rect
              x="33"
              y="31"
              width="30"
              height="30"
              rx="15"
              fill="#343833"
              className="little-camera__lid"
            />
            {/* film advance knob + counter */}
            <circle cx="70" cy="34" r="4" fill="#596760" opacity="0.7" />
            <rect x="66" y="55" width="14" height="8" rx="1" fill="#252622" stroke="#596760" strokeWidth="0.8" />
            {/* flash */}
            <circle
              cx="48"
              cy="46"
              r="20"
              fill="#F3F0E9"
              className="little-camera__flash"
            />
          </svg>
        </button>

        {bubble && (
          <div className="little-camera__bubble" role="status">
            <span className="little-camera__bubble-text" lang="en">
              {bubble.text}
            </span>
            {bubble.actionHref ? (
              <Link
                href={bubble.actionHref}
                className="little-camera__bubble-action"
                lang="en"
              >
                {bubble.actionLabel} →
              </Link>
            ) : null}
            {bubble.onAction ? (
              <button
                type="button"
                className="little-camera__bubble-action"
                onClick={bubble.onAction}
                lang="en"
              >
                {bubble.actionLabel} →
              </button>
            ) : null}
          </div>
        )}

        <button
          type="button"
          className="little-camera__dismiss"
          onClick={dismiss}
          aria-label="收起小相机"
          title="收起小相机（刷新后重新出现）"
        >
          <X aria-hidden="true" strokeWidth={2} />
        </button>
      </div>

      {/* Hidden darkroom */}
      {panelPhoto && (
        <div
          className="darkroom"
          role="dialog"
          aria-modal="true"
          aria-label="隐藏暗房"
        >
          <div className="darkroom__inner">
            <header className="darkroom__head">
              <span className="darkroom__eyebrow" lang="en">
                THE HIDDEN DARKROOM
              </span>
              <button
                type="button"
                className="darkroom__close"
                onClick={closeDarkroom}
                aria-label="关闭隐藏暗房"
              >
                <X aria-hidden="true" strokeWidth={1.5} />
              </button>
            </header>

            <figure className="darkroom__figure">
              <span className="darkroom__media">
                <Image
                  src={panelPhoto.image.src}
                  alt={panelPhoto.image.alt}
                  fill
                  sizes="(max-width: 767px) 92vw, 46vw"
                  className="darkroom__img"
                />
              </span>
              <figcaption className="darkroom__caption">
                <span lang="en">
                  {panelPhoto.plate} — {panelPhoto.title.toUpperCase()}
                </span>
                <span lang="en">{panelPhoto.year ?? "UNDATED"}</span>
              </figcaption>
            </figure>

            <div className="darkroom__foot">
              <p>
                你找到了暗房里的一张底片。它一直在那里，等一个愿意停留的人。
              </p>
              <Link
                href={`/work/${panelPhoto.slug}/`}
                className="darkroom__link"
                lang="en"
              >
                ENTER THE PLATE →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
