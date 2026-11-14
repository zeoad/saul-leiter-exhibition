"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { photographs } from "@/data/photographs";
import {
  GUIDE_KEY,
  OPEN_EVENT,
  PROGRESS_EVENT,
  plateNumber,
  readFound,
  writeFound,
} from "@/lib/viewfinder";
import { collectPlateTargets, matchTarget, type Target } from "./targets";

/** Below this width the HUD is used with thumbs, not a mouse. */
const INTRO_MS = 3_600;

/**
 * THE VIEWFINDER — game state, input handling and progress persistence.
 *
 * Input contract:
 *   · pointer (mouse or pen) moves the reticle continuously
 *   · touch drags the reticle; a tap places it and shoots
 *   · arrow keys move it by 18px (48px with Shift)
 *   · Space / Enter shoots, Escape exits
 *   · the plate list (toggled from the HUD) captures without a pointer at all
 *
 * Anything that announces to assistive technology goes through `announce`,
 * which feeds a polite live region owned by the HUD.
 */
export function useViewfinderGame() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState<number[]>([]);
  const [locked, setLocked] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [intro, setIntro] = useState(true);
  const [listOpen, setListOpen] = useState(false);
  const [guide, setGuide] = useState(false);
  const [targetCount, setTargetCount] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLSpanElement>(null);
  const shutterRef = useRef<HTMLSpanElement>(null);

  const targetsRef = useRef<Target[]>([]);
  const lockedRef = useRef<number | null>(null);
  const foundRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const toastTimer = useRef(0);
  const flashTimer = useRef(0);
  const introTimer = useRef(0);

  /* ---- mount + persisted progress -------------------------------------- */
  useEffect(() => {
    setMounted(true);
    const stored = readFound();
    foundRef.current = stored;
    setFound(stored);
  }, []);

  useEffect(() => {
    foundRef.current = found;
  }, [found]);

  /* ---- entry points: desk camera event + V key -------------------------- */
  useEffect(() => {
    const onOpen = () => setOpen(true);

    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "v" || event.key === "V") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const toastNow = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 2_600);
  }, []);

  const announce = useCallback((message: string) => {
    setLive(message);
  }, []);

  const flashNow = useCallback(() => {
    window.clearTimeout(flashTimer.current);
    setFlash(true);
    flashTimer.current = window.setTimeout(() => setFlash(false), 300);
  }, []);

  /* ---- collect the plate anchors currently on screen -------------------- */
  const collectTargets = useCallback(() => {
    targetsRef.current = collectPlateTargets();
    setTargetCount(targetsRef.current.length);
    if (overlayRef.current) {
      overlayRef.current.dataset.targets = String(targetsRef.current.length);
    }
  }, []);

  /* ---- reticle placement + focus lock ---------------------------------- */
  const place = useCallback(
    (clientX: number, clientY: number) => {
      const reticle = reticleRef.current;
      if (!reticle) return;

      /* Reaching for the shutter must not drop the focus lock: ignore pointer
         travel that lands on the HUD itself. */
      const elementAtPoint = document.elementFromPoint(clientX, clientY);
      if (
        elementAtPoint?.closest(
          ".vf__bar, .vf__controls, .vf__strip, .vf__close, .vf__list, .vf__guide, .vf__complete, .vf__empty, .vf__egg"
        )
      ) {
        return;
      }

      pointerRef.current = { x: clientX, y: clientY };

      /* Anchors move when the viewport resizes or the page settles. Re-scan
         lazily rather than only once at open. */
      if (targetsRef.current.length === 0) collectTargets();

      const w = reticle.offsetWidth;
      const h = reticle.offsetHeight;
      const half = 16;

      const px = Math.min(
        Math.max(clientX, w / 2 + half),
        window.innerWidth - w / 2 - half
      );
      const py = Math.min(
        Math.max(clientY, h / 2 + half),
        window.innerHeight - h / 2 - half
      );

      reticle.style.transform = `translate3d(${px - w / 2}px, ${
        py - h / 2
      }px, 0)`;

      const plate = matchTarget(targetsRef.current, clientX, clientY);

      if (plate !== lockedRef.current) {
        lockedRef.current = plate;
        setLocked(plate);
      }

      if (apertureRef.current) {
        const f = (1.4 + (clientX / Math.max(window.innerWidth, 1)) * 6.6).toFixed(1);
        apertureRef.current.textContent = `f/${f}`;
      }
      if (shutterRef.current) {
        const denominator = Math.round(
          90 + (clientY / Math.max(window.innerHeight, 1)) * 910
        );
        shutterRef.current.textContent = `1/${denominator}`;
      }
    },
    [collectTargets]
  );

  /* ---- open: lock scroll, build targets, centre reticle ----------------- */
  useEffect(() => {
    if (!open) return;

    document.documentElement.classList.add("vf-open");
    setIntro(true);

    let guideSeen = false;
    try {
      guideSeen = window.localStorage.getItem(GUIDE_KEY) === "1";
    } catch {
      /* storage unavailable — show the guide every time */
    }
    setGuide(!guideSeen);
    if (!guideSeen) setIntro(false);

    announce("取景器已打开。移动取景框对准照片，按空格或回车拍摄，按 Esc 退出。");

    const frame = window.requestAnimationFrame(() => {
      collectTargets();
      place(window.innerWidth / 2, window.innerHeight / 2);
    });

    introTimer.current = window.setTimeout(() => setIntro(false), INTRO_MS);

    const onPointerMove = (event: PointerEvent) => {
      /* Touch only steers while a finger is down: a resting finger must not
         drag the frame around. */
      if (event.pointerType === "touch" && !draggingRef.current) return;
      place(event.clientX, event.clientY);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") draggingRef.current = true;
      place(event.clientX, event.clientY);
    };
    const endDrag = () => {
      draggingRef.current = false;
    };
    const onResize = () => {
      collectTargets();
      place(window.innerWidth / 2, window.innerHeight / 2);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", endDrag, { passive: true });
    window.addEventListener("pointercancel", endDrag, { passive: true });
    window.addEventListener("resize", onResize);

    /* Keep the plate map fresh: images may still be loading when the HUD
       opens, which changes the anchor geometry. */
    const refresh = window.setInterval(collectTargets, 900);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(refresh);
      window.clearTimeout(introTimer.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("vf-open");
    };
  }, [open, collectTargets, place, announce]);

  /* ---- focus: move into the dialog, trap Tab, hand focus back on exit --- */
  useEffect(() => {
    if (!open) return;

    const overlay = overlayRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => overlay?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !overlay) return;
      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open]);

  /* ---- capture ---------------------------------------------------------- */
  const capture = useCallback(
    (explicitPlate?: number) => {
      if (guide) return;
      flashNow();

      if (foundRef.current.length >= photographs.length) {
        toastNow("CONTACT SHEET COMPLETE — 16 / 16");
        announce("全部 16 张照片都已收集。");
        return;
      }

      const plate =
        typeof explicitPlate === "number" ? explicitPlate : lockedRef.current;

      if (!plate) {
        toastNow("NO FRAME IN FOCUS — move over a photograph");
        announce("没有对准照片。请移动取景框，或打开目标列表。");
        return;
      }

      const photo = photographs.find((p) => plateNumber(p.plate) === plate);
      const current = foundRef.current;

      if (current.includes(plate)) {
        toastNow(`${photo?.plate ?? ""} is already in your film`);
        announce(`${photo?.plate ?? "这张照片"} 已经在你的胶片里。`);
        return;
      }

      const next = [...current, plate].sort((a, b) => a - b);
      foundRef.current = next;
      setFound(next);
      writeFound(next);
      toastNow(
        `${photo?.plate ?? `PL. 0${plate}`} — ${photo?.title.toUpperCase() ?? ""} captured`
      );
      announce(
        `已收集 ${photo?.plate ?? ""} ${photo?.title ?? ""}。共 ${next.length} / ${photographs.length} 张。`
      );
    },
    [announce, flashNow, toastNow, guide]
  );

  /* ---- exit + shooting keys --------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      /* Space/Enter on a focused button or link belongs to that control. */
      const interactive = (event.target as HTMLElement | null)?.closest?.(
        "button, a, input, textarea, select"
      );
      if ((event.key === " " || event.key === "Enter") && !interactive) {
        event.preventDefault();
        capture();
        return;
      }

      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        const step = event.shiftKey ? 48 : 18;
        const { x, y } = pointerRef.current;
        if (event.key === "ArrowUp") place(x, y - step);
        if (event.key === "ArrowDown") place(x, y + step);
        if (event.key === "ArrowLeft") place(x - step, y);
        if (event.key === "ArrowRight") place(x + step, y);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, capture, place]);

  /* ---- progress mirrored from other tabs/windows ------------------------ */
  useEffect(() => {
    const onProgress = () => {
      const stored = readFound();
      foundRef.current = stored;
      setFound(stored);
    };
    window.addEventListener(PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, onProgress);
  }, []);

  const lockedPhoto = locked
    ? photographs.find((p) => plateNumber(p.plate) === locked)
    : undefined;
  const collected = photographs.filter((photo) =>
    found.includes(plateNumber(photo.plate))
  );

  const close = useCallback(() => setOpen(false), []);
  const toggleList = useCallback(() => setListOpen((value) => !value), []);

  const dismissGuide = useCallback(
    (persist: boolean) => {
      setGuide(false);
      if (persist) {
        try {
          window.localStorage.setItem(GUIDE_KEY, "1");
        } catch {
          /* storage unavailable — the guide will show again next time */
        }
      }
      announce("开始拍摄。移动取景框对准照片，画面锁定后按下快门。");
    },
    [announce]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        (event.target as HTMLElement).closest(
          ".vf__close, .vf__bar, .vf__strip, .vf__shutter, .vf__list, .vf__guide, .vf__complete, .vf__empty, .vf__egg"
        )
      ) {
        return;
      }
      capture();
    },
    [capture]
  );

  return {
    mounted,
    open,
    found,
    locked,
    lockedPhoto,
    collected,
    flash,
    toast,
    live,
    intro,
    listOpen,
    guide,
    targetCount,
    overlayRef,
    reticleRef,
    apertureRef,
    shutterRef,
    close,
    capture,
    toggleList,
    dismissGuide,
    handleOverlayClick,
  };
}
