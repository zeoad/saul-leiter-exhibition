"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * The interactive layer: the desk camera and the viewfinder game.
 *
 * Both are heavy client components (state machines, pointer maths, localStorage)
 * that nobody needs on first paint — they only become relevant after the page
 * is quiet or the visitor touches something. Loading them through `next/dynamic`
 * keeps their code out of the initial route bundle; mounting them on idle keeps
 * their DOM out of the initial hydrate.
 */

const LittleCamera = dynamic(() => import("./LittleCamera"), { ssr: false });
const Viewfinder = dynamic(() => import("./Viewfinder"), { ssr: false });

/** Never hold the camera back longer than this on a busy main thread. */
const IDLE_TIMEOUT = 2_500;
/** Fallback for browsers without requestIdleCallback. */
const FALLBACK_DELAY = 1_500;

export default function InteractiveLayer() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timer: number | undefined;

    const cleanUp = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };

    const activate = () => {
      if (cancelled) return;
      cleanUp();
      setReady(true);
    };

    window.addEventListener("pointerdown", activate, { passive: true });
    window.addEventListener("keydown", activate);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(activate, { timeout: IDLE_TIMEOUT });
    } else {
      timer = window.setTimeout(activate, FALLBACK_DELAY);
    }

    return () => {
      cancelled = true;
      cleanUp();
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <LittleCamera />
      <Viewfinder />
    </>
  );
}
