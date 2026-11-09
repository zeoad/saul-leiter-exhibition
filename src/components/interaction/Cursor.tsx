"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * THE POINTER — a small ring that follows the hand, never the mouse alone.
 * It grows over links, announces itself over plates ("VIEW", "DRAG"),
 * and blends with whatever is underneath through difference.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!fine || reduce || !ring || !label) return;

    document.documentElement.classList.add("has-cursor");
    ring.style.display = "grid";

    const moveX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3" });
    const moveY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3" });

    let mode = "";
    let text = "";

    const setMode = (nextMode: string, nextText: string) => {
      if (nextMode === mode && nextText === text) return;
      mode = nextMode;
      text = nextText;

      if (!nextMode) {
        ring.removeAttribute("data-mode");
        label.textContent = "";
        return;
      }

      ring.setAttribute("data-mode", nextMode);
      label.textContent = nextText;
    };

    const inspect = (target: Element | null) => {
      const el = target?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button'], input, select, textarea"
      );

      if (!el) {
        setMode("", "");
        return;
      }

      const preset = el.getAttribute("data-cursor");
      if (preset) {
        setMode(preset, el.getAttribute("data-cursor-label") ?? "");
        return;
      }

      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        setMode("", "");
        return;
      }

      const tag = el.tagName.toLowerCase();
      if (tag === "a" || tag === "button") {
        setMode("link", "");
      } else {
        setMode("", "");
      }
    };

    const onMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      inspect(event.target as Element | null);
      ring.style.opacity = "1";
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.82, duration: 0.18, ease: "power2.out" });
    };

    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3.out" });
    };

    const onLeave = () => {
      ring.style.opacity = "0";
    };

    const onEnter = () => {
      ring.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
      gsap.killTweensOf(ring);
    };
  }, []);

  return (
    <div ref={ringRef} className="cursor" aria-hidden="true">
      <span className="cursor__dot" />
      <span ref={labelRef} className="cursor__label" />
    </div>
  );
}
