"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import Plate from "@/components/ui/Plate";
import { homeCopy } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";
import { photographs } from "@/data/photographs";

type Particle = {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  snow: boolean;
};

const NOTES = [
  {
    label: "DIFFUSION",
    text: "雨把所有光源都变软。招牌、车灯、橱窗不再是点，而是一片片晕开的光。",
  },
  {
    label: "REFLECTION",
    text: "湿路面把城市翻了一倍。倒影总是比实体更慢、更模糊，也更诚实。",
  },
  {
    label: "SILENCE",
    text: "雪落下来的时候，纽约第一次显得没有声音。街道被还原成几块柔和的形状。",
  },
];

/**
 * 06 · RAIN & SNOW — weather is the developer.
 * A canvas of rain and snow runs over the print; your pointer wipes the mist.
 */
export default function RainSnow() {
  const rootRef = useRef<HTMLElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const fogRef = useRef<HTMLCanvasElement>(null);

  const rain = getPhotographBySlug("rain") ?? photographs[0];
  const snow = getPhotographBySlug("snow") ?? photographs[0];
  const { weather } = homeCopy;

  useEffect(() => {
    const root = rootRef.current;
    const fx = fxRef.current;
    const fog = fogRef.current;
    if (!root || !fx || !fog) return;

    const ctx = fx.getContext("2d");
    const fogCtx = fog.getContext("2d");
    if (!ctx || !fogCtx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;
    let particles: Particle[] = [];
    const pointer = { x: -400, y: -400, active: false };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      [fx, fog].forEach((canvas) => {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fogCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!reduce) {
        fogCtx.fillStyle = "rgba(214, 221, 214, 0.34)";
        fogCtx.fillRect(0, 0, width, height);
      }

      const count = width < 768 ? 54 : Math.min(220, Math.floor(width / 8));
      particles = Array.from({ length: count }, () => spawn(width, height));
    };

    const spawn = (w: number, h: number, initial = true): Particle => {
      const snowflake = Math.random() < 0.28;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -40 - Math.random() * 120,
        length: snowflake ? 2.2 + Math.random() * 3 : 12 + Math.random() * 34,
        speed: snowflake ? 0.5 + Math.random() * 1.1 : 2.4 + Math.random() * 4.2,
        alpha: snowflake ? 0.2 + Math.random() * 0.5 : 0.12 + Math.random() * 0.4,
        snow: snowflake,
      };
    };

    const readVelocity = () => {
      const raw = document.documentElement.style.getPropertyValue("--sv");
      const value = parseFloat(raw);
      return Number.isFinite(value) ? Math.max(-1, Math.min(1, value)) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (coarse) return;
      const rect = root.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    const draw = () => {
      if (!running) {
        frame = 0;
        return;
      }

      const velocity = reduce ? 0 : readVelocity();
      const wind = velocity * 42 + (pointer.active ? (pointer.x - width / 2) / width * 16 : 0);
      const intensity = 1 + Math.abs(velocity) * 1.6;

      ctx.clearRect(0, 0, width, height);

      /* Mist slowly returns, then is wiped where the hand passes. */
      fogCtx.globalCompositeOperation = "source-over";
      fogCtx.fillStyle = "rgba(212, 220, 212, 0.022)";
      fogCtx.fillRect(0, 0, width, height);

      if (pointer.active && !coarse) {
        fogCtx.globalCompositeOperation = "destination-out";
        const radius = Math.max(56, Math.min(width, height) * 0.11);
        const gradient = fogCtx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          radius
        );
        gradient.addColorStop(0, "rgba(0,0,0,0.9)");
        gradient.addColorStop(0.6, "rgba(0,0,0,0.55)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        fogCtx.fillStyle = gradient;
        fogCtx.beginPath();
        fogCtx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
        fogCtx.fill();
        fogCtx.globalCompositeOperation = "source-over";
      }

      for (const particle of particles) {
        const drift = wind * (particle.snow ? 0.34 : 0.7);
        particle.x += drift * 0.02 + (particle.snow ? Math.sin(particle.y / 60) * 0.32 : 0);
        particle.y += particle.speed * intensity;

        if (particle.y > height + 30) {
          Object.assign(particle, spawn(width, height, false));
        }
        if (particle.x < -30) particle.x = width + 20;
        if (particle.x > width + 30) particle.x = -20;

        if (particle.snow) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(236, 240, 235, ${particle.alpha})`;
          ctx.arc(particle.x, particle.y, particle.length, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const angle = drift * 0.014;
          ctx.strokeStyle = `rgba(220, 230, 228, ${particle.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(
            particle.x + Math.sin(angle) * particle.length * 0.5,
            particle.y + particle.length
          );
          ctx.stroke();
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (reduce) return;
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (running) start();
    };

    resize();
    start();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          running = entry.isIntersecting;
          if (running) start();
          else stop();
        });
      },
      { threshold: 0.05 }
    );
    io.observe(root);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="rain-and-snow"
      className="scene scene-weather tone-teal"
      aria-labelledby="weather-title"
    >
      <div className="weather__bg" aria-hidden="true">
        <Image
          src={rain.image.src}
          alt=""
          fill
          sizes="100vw"
          className="plate__img"
        />
      </div>
      <div className="weather__bg-scrim" aria-hidden="true" />

      <canvas ref={fxRef} className="weather__fx" aria-hidden="true" />
      <canvas ref={fogRef} className="weather__fog" aria-hidden="true" />

      <div className="weather__meter" aria-hidden="true">
        <b lang="en">WEATHER / 06</b>
        <span lang="en">RAIN · SNOW · MIST</span>
      </div>

      <div className="wrap weather__head">
        <span className="eyebrow" lang="en">
          06 / {weather.eyebrow}
        </span>
        <h2 id="weather-title" className="display">
          RAIN, SNOW
          <em>&amp; SILENCE</em>
        </h2>
        <p className="weather__head-cn">雨、雪与沉默 · 天气作为显影液</p>
      </div>

      <div className="wrap weather__body">
        <div className="weather__text">
          {weather.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p className="weather__quote">“{weather.quote}”</p>
        </div>

        <div className="weather__figure">
          <Plate
            photo={snow}
            sizes="(max-width: 1023px) 60vw, 26vw"
            caption
          />
        </div>
      </div>

      <div className="wrap weather__notes">
        {NOTES.map((note, index) => (
          <div className="weather__note" key={note.label}>
            <span lang="en">
              0{index + 1} / {note.label}
            </span>
            <p>{note.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
