"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  categoryToSlug,
  displayYear,
  getLightboxCaption,
} from "@/lib/gallery";
import type { Category, Photograph, VisionChapter } from "@/types";

const SLATS = 12;

const WORDS: Record<string, string> = {
  color: "COLOUR",
  glass: "GLASS",
  weather: "WEATHER",
  ordinary: "ORDINARY",
};

const CUES: Record<string, string> = {
  color: "MOVE — COLOUR COMES BACK UNDER THE LIGHT",
  glass: "MOVE — THE GLASS BENDS WHAT YOU SEE",
  weather: "MOVE — WIPE THE WEATHER OFF THE SURFACE",
  ordinary: "MOVE — A DETAIL BECOMES THE SUBJECT",
};

type Variant = "color" | "glass" | "weather" | "ordinary";

type VisionActProps = {
  chapter: VisionChapter;
  photo: Photograph;
  index: number;
  variant: Variant;
  toneClass: string;
  category: Category;
  swatches?: { name: string; hex: string }[];
  strip?: Photograph[];
};

/**
 * One act of THE VISION, played full-bleed.
 *
 * The screen is the print, treated as a surface: colour withheld, glass in
 * strips, weather falling on it, or a single detail held under a lens. Each
 * surface answers the pointer; the article panel slides up underneath.
 */
export default function VisionAct({
  chapter,
  photo,
  index,
  variant,
  toneClass,
  category,
  swatches,
  strip,
}: VisionActProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);

  const lines = chapter.title.split("\n");
  const flip = index % 2 === 1;

  /* --- The surface answers the pointer ---------------------------------- */
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

    let frame = 0;
    let x = 62;
    let y = 46;
    let tx = 62;
    let ty = 46;

    const paint = () => {
      const dx = tx - x;
      const dy = ty - y;

      if (Math.abs(dx) < 0.04 && Math.abs(dy) < 0.04) {
        x = tx;
        y = ty;
        screen.style.setProperty("--mx", `${x}%`);
        screen.style.setProperty("--my", `${y}%`);
        screen.style.setProperty("--sx", `${(x - 50) / 50}`);
        screen.style.setProperty("--sy", `${(y - 50) / 50}`);
        frame = 0;
        return;
      }

      x += dx * 0.14;
      y += dy * 0.14;
      screen.style.setProperty("--mx", `${x.toFixed(2)}%`);
      screen.style.setProperty("--my", `${y.toFixed(2)}%`);
      screen.style.setProperty("--sx", `${((x - 50) / 50).toFixed(3)}`);
      screen.style.setProperty("--sy", `${((y - 50) / 50).toFixed(3)}`);

      frame = window.requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = screen.getBoundingClientRect();
      tx = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      ty = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));

      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    screen.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      screen.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* --- The print drifts inside its gate ---------------------------------
     One CSS variable carries the scroll progress; the transforms live in
     vision.css. Cheaper than a tween engine for three transforms, and it
     keeps this route free of GSAP entirely. */
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      screen.classList.add("is-in");
      return;
    }

    /* Hold the furniture off-frame before it can be seen; `is-in` then lets
       it rise in. Without JS this class never lands and the copy is visible. */
    screen.classList.add("is-armed");

    let frame = 0;
    let target = 0;
    let value = 0;

    const measure = () => {
      const rect = screen.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      const raw = span > 0 ? (window.innerHeight - rect.top) / span : 0;
      target = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    };

    const tick = () => {
      const delta = target - value;
      if (Math.abs(delta) < 0.0015) {
        value = target;
        screen.style.setProperty("--act-p", value.toFixed(3));
        frame = 0;
        return;
      }

      value += delta * 0.16;
      screen.style.setProperty("--act-p", value.toFixed(3));
      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    measure();
    value = target;
    screen.style.setProperty("--act-p", value.toFixed(3));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        screen.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    io.observe(screen);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* --- Rain and snow fall across the print ------------------------------ */
  useEffect(() => {
    if (variant !== "weather") return;

    const screen = screenRef.current;
    const canvas = rainRef.current;
    if (!screen || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx || reduce) return;

    type Drop = {
      x: number;
      y: number;
      len: number;
      speed: number;
      alpha: number;
      snow: boolean;
    };

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let drops: Drop[] = [];

    const spawn = (initial: boolean): Drop => {
      const snow = Math.random() < 0.3;
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : -30 - Math.random() * 90,
        len: snow ? 1.6 + Math.random() * 2.4 : 10 + Math.random() * 26,
        speed: snow ? 0.4 + Math.random() * 0.9 : 2.2 + Math.random() * 3.6,
        alpha: snow ? 0.18 + Math.random() * 0.4 : 0.1 + Math.random() * 0.32,
        snow,
      };
    };

    const resize = () => {
      const rect = screen.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drops = Array.from(
        { length: width < 768 ? 52 : 130 },
        () => spawn(true)
      );
    };

    const draw = () => {
      if (!running) {
        frame = 0;
        return;
      }

      const raw = parseFloat(
        document.documentElement.style.getPropertyValue("--sv")
      );
      const velocity = Number.isFinite(raw) ? Math.max(-1, Math.min(1, raw)) : 0;
      const wind = velocity * 34;

      ctx.clearRect(0, 0, width, height);

      for (const drop of drops) {
        drop.x += wind * (drop.snow ? 0.012 : 0.03);
        drop.y += drop.speed * (1 + Math.abs(velocity) * 1.2);

        if (drop.y > height + 24) Object.assign(drop, spawn(false));
        if (drop.x < -24) drop.x = width + 12;
        if (drop.x > width + 24) drop.x = -12;

        if (drop.snow) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(238, 242, 235, ${drop.alpha})`;
          ctx.arc(drop.x, drop.y, drop.len, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = `rgba(222, 232, 228, ${drop.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + wind * 0.4, drop.y + drop.len);
          ctx.stroke();
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    start();

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(screen);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (running) start();
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  return (
    <section
      id={chapter.id}
      className={`vact vact--${variant}${flip ? " vact--flip" : ""}`}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className="vact__screen" ref={screenRef} data-variant={variant}>
        <div className="vact__media" ref={mediaRef}>
          <Image
            src={photo.image.src}
            alt={photo.image.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="vact__img"
          />
        </div>

        {variant === "color" ? (
          <div className="vact__reveal" aria-hidden="true">
            <Image
              src={photo.image.src}
              alt=""
              fill
              sizes="100vw"
              className="vact__img vact__img--clean"
            />
          </div>
        ) : null}

        {variant === "glass" ? (
          <div className="vact__glass" aria-hidden="true">
            {Array.from({ length: SLATS }).map((_, slat) => (
              <span
                key={slat}
                className="vact__slat"
                style={
                  {
                    "--d": 1 + (slat % 3) * 0.75,
                    left: `${(slat / SLATS) * 100}%`,
                    backgroundImage: `url(${photo.image.src})`,
                    backgroundPosition: `${(slat / (SLATS - 1)) * 100}% 50%`,
                  } as CSSProperties
                }
              />
            ))}
            <span className="vact__glass-shine" />
          </div>
        ) : null}

        {variant === "weather" ? (
          <>
            <canvas ref={rainRef} className="vact__rain" aria-hidden="true" />
            <span className="vact__fog" aria-hidden="true" />
            <span className="vact__flash" aria-hidden="true" />
          </>
        ) : null}

        {variant === "ordinary" ? (
          <div className="vact__reveal vact__reveal--zoom" aria-hidden="true">
            <Image
              src={photo.image.src}
              alt=""
              fill
              sizes="100vw"
              className="vact__img vact__img--clean"
            />
          </div>
        ) : null}

        <span className="vact__grade" aria-hidden="true" />
        <span className="vact__grain" aria-hidden="true" />

        <div className="vact__hud">
          <span lang="en">
            REEL {chapter.number} / 04
          </span>
          <span lang="en" className="vact__hud-meta">
            {photo.title.toUpperCase()} · {displayYear(photo)} · {photo.plate}
          </span>
          <a
            className="vact__plate-link"
            href={photo.image.src}
            data-pswp-lightbox
            data-pswp-width={photo.image.width}
            data-pswp-height={photo.image.height}
            data-pswp-caption={getLightboxCaption(photo)}
            data-cursor="view"
            data-cursor-label="VIEW PLATE"
            aria-label={`查看作品：${photo.title}`}
          >
            <span lang="en">VIEW PLATE</span>
          </a>
        </div>

        <span className="vact__num" aria-hidden="true">
          {chapter.number}
        </span>

        <span className="vact__word" aria-hidden="true">
          {WORDS[variant]}
        </span>

        <div className="vact__aside">
          <span className="vact__cue" lang="en">
            {CUES[variant]}
          </span>

          {swatches?.length ? (
            <ul className="vact__swatches">
              {swatches.map((swatch) => (
                <li key={swatch.hex}>
                  <i style={{ background: swatch.hex }} aria-hidden="true" />
                  <span lang="en">{swatch.name}</span>
                  <b>{swatch.hex}</b>
                </li>
              ))}
            </ul>
          ) : null}

          {strip?.length ? (
            <div className="vact__strip" aria-hidden="true">
              {strip.map((item) => (
                <span key={item.slug} className="vact__strip-frame">
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="10vw"
                    className="vact__img"
                  />
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={`vact__panel ${toneClass}`}>
        <div className="wrap vact__panel-inner">
          <div className="vact__head">
            <span className="eyebrow" lang="en">
              CHAPTER {chapter.number} OF 04 — {chapter.kicker}
            </span>

            <h2 id={`${chapter.id}-title`} className="display" lang="en">
              {lines.map((line, lineIndex) =>
                lineIndex === lines.length - 1 ? (
                  <em key={line}>{line}</em>
                ) : (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                )
              )}
            </h2>

            <p className="vact__cn">{chapter.titleCn}</p>
          </div>

          <p className="vact__standfirst">{chapter.standfirst}</p>

          <div className="vact__body" data-reveal-group>
            {chapter.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 14)}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="vact__quote">
            <p>{chapter.quote}</p>
            <cite lang="en">{chapter.quoteNote}</cite>
          </blockquote>

          <ol className="vact__keys" data-reveal-group>
            {chapter.analysis.map((item) => (
              <li key={item.label}>
                <span lang="en">{item.label}</span>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>

          <div className="vact__foot">
            <p className="vact__detail">{chapter.detailNote}</p>
            <Link
              className="linkline"
              href={`/work/?category=${categoryToSlug(category)}`}
            >
              在作品集中继续观看
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
