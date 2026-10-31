"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * One controller for every scroll animation on the page.
 *
 * Content is rendered by Server Components with `data-reveal` attributes;
 * this component upgrades it. If JavaScript fails, everything stays visible.
 * All triggers are reverted on route change, and nothing runs when the visitor
 * has asked for reduced motion.
 */
export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    document.documentElement.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      /* Image mask reveal -------------------------------------------------- */
      gsap.utils
        .toArray<HTMLElement>('[data-reveal="figure"]')
        .forEach((figure) => {
          const veil = figure.querySelector<HTMLElement>(".figure__veil");
          const image = figure.querySelector<HTMLImageElement>(
            ".figure__media img"
          );

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: figure,
              start: "top 88%",
              once: true,
            },
          });

          if (veil) {
            timeline.fromTo(
              veil,
              { scaleY: 1 },
              {
                scaleY: 0,
                duration: 1.15,
                ease: "power3.inOut",
                transformOrigin: "top center",
              },
              0
            );
          }

          if (image) {
            timeline.fromTo(
              image,
              { scale: 1.06 },
              { scale: 1, duration: 1.7, ease: "power2.out" },
              0
            );
          }
        });

      /* Text reveal -------------------------------------------------------- */
      gsap.utils
        .toArray<HTMLElement>('[data-reveal="text"]')
        .forEach((element) => {
          const delay = Number(element.dataset.revealDelay ?? 0);

          gsap.from(element, {
            autoAlpha: 0,
            y: 22,
            duration: 1,
            delay: Number.isFinite(delay) ? delay : 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
            },
          });
        });

      /* Grouped text ------------------------------------------------------- */
      gsap.utils
        .toArray<HTMLElement>('[data-reveal="group"]')
        .forEach((group) => {
          const items = Array.from(group.children) as HTMLElement[];
          if (!items.length) return;

          gsap.from(items, {
            autoAlpha: 0,
            y: 26,
            duration: 0.95,
            stagger: 0.085,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 87%",
              once: true,
            },
          });
        });

      /* Quiet parallax on the cover --------------------------------------- */
      if (pathname === "/") {
        const coverImage = document.querySelector<HTMLElement>(
          "[data-cover-parallax]"
        );
        const coverTitle = document.querySelector<HTMLElement>(
          "[data-cover-title]"
        );

        if (coverImage && window.innerWidth >= 768) {
          gsap.to(coverImage, {
            yPercent: 9,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        if (coverTitle && window.innerWidth >= 768) {
          gsap.to(coverTitle, {
            yPercent: -6,
            autoAlpha: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "30% top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }
    });

    ScrollTrigger.refresh();

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("load", onLoad);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [pathname]);

  return null;
}
