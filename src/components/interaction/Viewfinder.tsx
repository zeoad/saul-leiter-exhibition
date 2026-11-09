"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

import { photographs } from "@/data/photographs";
import { startScroll, stopScroll } from "@/lib/lenis";
import {
  OPEN_EVENT,
  PROGRESS_EVENT,
  plateNumber,
  readFound,
  writeFound,
} from "@/lib/viewfinder";

/**
 * THE VIEWFINDER — a capture game laid over the exhibition.
 *
 * Focus the reticle: move the pointer (or drag on touch) over a plate. When the
 * reticle locks a photograph the AF brackets close and the HUD names it. Shoot
 * (click the shutter, Space or Enter) to add it to your film. Progress persists
 * in localStorage, so the collection keeps growing between visits.
 *
 * Nothing here is decorative-only: the plates are the real photographs of the
 * exhibition, and the readouts are exposed for screen readers as status text.
 */

const TOTAL = photographs.length;

interface Target {
  plate: number;
  rect: DOMRect;
}

export default function Viewfinder() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState<number[]>([]);
  const [locked, setLocked] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [intro, setIntro] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLSpanElement>(null);
  const shutterRef = useRef<HTMLSpanElement>(null);

  const targetsRef = useRef<Target[]>([]);
  const lockedRef = useRef<number | null>(null);
  const foundRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
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

  const flashNow = useCallback(() => {
    window.clearTimeout(flashTimer.current);
    setFlash(true);
    flashTimer.current = window.setTimeout(() => setFlash(false), 300);
  }, []);

  /* ---- collect the plate anchors currently on screen -------------------- */
  const collectTargets = useCallback(() => {
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
      if (rect.width < 96 || rect.height < 72) return;
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      next.push({ plate, rect });
    });

    targetsRef.current = next;
    if (overlayRef.current) {
      overlayRef.current.dataset.targets = String(next.length);
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
          ".vf__bar, .vf__controls, .vf__strip, .vf__close"
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

      /* Focus lock: the pointer being inside a plate's box counts as a hit. */
      const hit =
        targetsRef.current.find(
          (target) =>
            clientX >= target.rect.left - 12 &&
            clientX <= target.rect.right + 12 &&
            clientY >= target.rect.top - 12 &&
            clientY <= target.rect.bottom + 12
        ) ?? null;
      const plate = hit?.plate ?? null;

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
    stopScroll();
    setIntro(true);

    const frame = window.requestAnimationFrame(() => {
      collectTargets();
      place(window.innerWidth / 2, window.innerHeight / 2);
    });

    introTimer.current = window.setTimeout(() => setIntro(false), 3_600);

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      place(event.clientX, event.clientY);
    };
    const onPointerDown = (event: PointerEvent) => {
      place(event.clientX, event.clientY);
    };
    const onResize = () => {
      collectTargets();
      place(window.innerWidth / 2, window.innerHeight / 2);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", onResize);

    /* Keep the plate map fresh: images may still be loading when the HUD
       opens, which changes the anchor geometry. */
    const refresh = window.setInterval(collectTargets, 900);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(refresh);
      window.clearTimeout(introTimer.current);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("vf-open");
      startScroll();
    };
  }, [open, collectTargets, place]);

  /* ---- capture ---------------------------------------------------------- */
  const capture = useCallback(() => {
    flashNow();
    const plate = lockedRef.current;

    if (!plate) {
      toastNow("NO FRAME IN FOCUS — move over a photograph");
      return;
    }

    const photo = photographs.find((p) => plateNumber(p.plate) === plate);
    const current = foundRef.current;

    if (current.includes(plate)) {
      toastNow(`${photo?.plate ?? ""} is already in your film`);
      return;
    }

    const next = [...current, plate].sort((a, b) => a - b);
    foundRef.current = next;
    setFound(next);
    writeFound(next);
    toastNow(
      `${photo?.plate ?? `PL. 0${plate}`} — ${photo?.title.toUpperCase() ?? ""} captured`
    );
  }, [flashNow, toastNow]);

  /* ---- exit + shooting keys --------------------------------------------- */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key === " " || event.key === "Enter") {
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

  if (!mounted) return null;

  return createPortal(
    <>
      {open ? (
        <div
          ref={overlayRef}
          className="vf"
          data-flash={flash}
          role="dialog"
          aria-modal="true"
          aria-label="取景器：在展览中寻找照片"
          onClick={(event) => {
            if (
              (event.target as HTMLElement).closest(
                ".vf__close, .vf__bar, .vf__strip, .vf__shutter"
              )
            ) {
              return;
            }
            capture();
          }}
        >
          <div className="vf__grain" aria-hidden="true" />
          <div className="vf__vignette" aria-hidden="true" />

          <header className="vf__bar">
            <span className="vf__title" lang="en">
              <i className="vf__rec" aria-hidden="true" />
              VIEWFINDER · 取景器
            </span>
            <span className="vf__count" lang="en">
              {String(found.length).padStart(2, "0")} / {TOTAL}
            </span>
            <button
              type="button"
              className="vf__close"
              onClick={() => setOpen(false)}
              aria-label="退出取景器"
            >
              <X aria-hidden="true" strokeWidth={1.5} />
            </button>
          </header>

          <div
            ref={reticleRef}
            className="vf__reticle"
            data-lock={locked ? "true" : "false"}
            aria-hidden="true"
          >
            <i className="vf__corner vf__corner--tl" />
            <i className="vf__corner vf__corner--tr" />
            <i className="vf__corner vf__corner--bl" />
            <i className="vf__corner vf__corner--br" />
            <i className="vf__cross" />
            <span className="vf__reticle-label" lang="en">
              {lockedPhoto
                ? `${lockedPhoto.plate} · ${lockedPhoto.title.toUpperCase()}`
                : "SEARCHING"}
            </span>
            <span className="vf__af" aria-hidden="true">
              AF
            </span>
          </div>

          <div className="vf__readouts" aria-hidden="true">
            <span className="vf__readout">
              <small>APERTURE</small>
              <span ref={apertureRef}>f/2.8</span>
            </span>
            <span className="vf__readout">
              <small>SHUTTER</small>
              <span ref={shutterRef}>1/250</span>
            </span>
            <span className="vf__readout">
              <small>ISO</small>
              <span>3200</span>
            </span>
          </div>

          <div className="vf__controls">
            <p className="vf__hint" lang="en">
              MOVE TO FOCUS · CLICK OR SPACE TO SHOOT · ESC TO EXIT
            </p>
            <button
              type="button"
              className="vf__shutter"
              onClick={capture}
              aria-label="拍摄对焦框中的照片"
            >
              <span aria-hidden="true" />
            </button>
          </div>

          {collected.length > 0 ? (
            <ul className="vf__strip" aria-label="已收集的照片">
              {collected.map((photo) => (
                <li key={photo.slug} className="vf__strip-item">
                  <span className="vf__strip-media">
                    <Image
                      src={photo.image.src}
                      alt=""
                      fill
                      sizes="72px"
                      className="vf__strip-img"
                    />
                  </span>
                  <span lang="en">{photo.plate}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {intro ? (
            <div className="vf__intro" lang="en">
              <span>MOVE THE FRAME OVER A PHOTOGRAPH</span>
              <span>LOCK IT — THEN SHOOT</span>
            </div>
          ) : null}

          <div className="vf__toast" role="status" aria-live="polite">
            {toast}
          </div>
        </div>
      ) : null}
    </>,
    document.body
  );
}
