"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { getLenis } from "@/lib/lenis";

/**
 * THE PROJECTION — one small engine that every scene listens to.
 *
 *  · writes the live scroll velocity to `--sv` so scenes can lean into a scroll
 *  · moves the warm projector light with the pointer
 *  · arms the site-wide reveal grammar (`html.motion` + IntersectionObserver)
 */
export default function ScrollBus() {
  const pathname = usePathname();

  /* Reveal grammar ------------------------------------------------------- */
  useEffect(() => {
    document.documentElement.classList.add("motion");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const observe = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]")
        .forEach((el) => {
          if (el.dataset.rv) return;
          el.dataset.rv = "1";
          io.observe(el);
        });

      document.querySelectorAll<HTMLElement>(".line-mask").forEach((el) => {
        if (el.dataset.rv) return;
        el.dataset.rv = "1";
        io.observe(el);
      });
    };

    observe();
    const timers = [
      window.setTimeout(observe, 120),
      window.setTimeout(observe, 700),
    ];

    const onPage = () => {
      window.setTimeout(observe, 80);
      window.setTimeout(observe, 900);
    };

    window.addEventListener("aqg:page", onPage);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("aqg:page", onPage);
      io.disconnect();
      document.documentElement.classList.remove("motion");
    };
  }, [pathname]);

  /* Scroll velocity ------------------------------------------------------ */
  useEffect(() => {
    const root = document.documentElement;
    let cleanup: (() => void) | undefined;

    const attach = () => {
      const lenis = getLenis();
      if (!lenis || cleanup) return false;

      let frame = 0;
      let target = 0;

      const flush = () => {
        frame = 0;
        root.style.setProperty("--sv", target.toFixed(3));
        root.classList.toggle("is-scrolling", Math.abs(target) > 0.02);
      };

      const onScroll = (event: { velocity: number }) => {
        target = Math.max(-1, Math.min(1, (event.velocity ?? 0) / 18));
        if (!frame) frame = window.requestAnimationFrame(flush);
      };

      lenis.on("scroll", onScroll);

      cleanup = () => {
        lenis.off("scroll", onScroll);
        if (frame) window.cancelAnimationFrame(frame);
        root.style.setProperty("--sv", "0");
        root.classList.remove("is-scrolling");
      };

      return true;
    };

    if (!attach()) {
      const timer = window.setInterval(() => {
        if (attach()) window.clearInterval(timer);
      }, 120);
      window.setTimeout(() => window.clearInterval(timer), 4000);
      return () => {
        window.clearInterval(timer);
        cleanup?.();
      };
    }

    return () => cleanup?.();
  }, []);

  /* Projector light ------------------------------------------------------- */
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const root = document.documentElement;
    let frame = 0;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.4;

    const flush = () => {
      frame = 0;
      root.style.setProperty("--px", `${x}px`);
      root.style.setProperty("--py", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    flush();

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.removeProperty("--px");
      root.style.removeProperty("--py");
    };
  }, []);

  return null;
}
