"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Pause, Play, X } from "lucide-react";

import { timeline } from "@/data/timeline";
import { startScroll, stopScroll } from "@/lib/lenis";

/**
 * /life — one room, one lamp, eleven years.
 *
 * The lamp drifts from year to year on its own: it rests on a year long enough
 * to read, then swings to the next one, and the beam picks the print that goes
 * with it. Nothing scrolls. Everything below the room lives in THE LONG READ.
 */

const MAX_DESKTOP = 40;
const MAX_MOBILE = 20;
const START = 0;
const STEPS = timeline.length - 1;
const HOLD_MS = 5000;

type Frame = { src: string; alt: string; pos: string };

/** One print per year, in the same order as `timeline`. */
const FRAMES: Frame[] = [
  {
    src: "/images/portraits/leiter-portrait.webp",
    alt: "索尔·雷特肖像，约 1950 年代：他戴着眼镜，在窗边低头。",
    pos: "50% 26%",
  },
  {
    src: "/images/photographs/plate-16.webp",
    alt: "《Man in Straw Hat》（戴草帽的男人），约 1955：戴草帽的男人站在黄色出租车与橱窗前。",
    pos: "50% 42%",
  },
  {
    src: "/images/photographs/plate-12.webp",
    alt: "《Walking》（行走），1956：隔着玻璃行走的女子，身体被反光分割成几段。",
    pos: "50% 46%",
  },
  {
    src: "/images/photographs/plate-03.webp",
    alt: "《Canopy》（雨篷），1958：黑色雨篷遮住画面大半，雪街上行人渺小。",
    pos: "50% 52%",
  },
  {
    src: "/images/photographs/plate-04.webp",
    alt: "《Mirrors》（镜子），约 1962：街边多面镜子同时映出行人、建筑与橱窗。",
    pos: "50% 48%",
  },
  {
    src: "/images/photographs/plate-05.webp",
    alt: "《Phone Call》（电话），1957：男人在电话亭中通话，玻璃上叠着街道反光与招牌。",
    pos: "50% 44%",
  },
  {
    src: "/images/photographs/plate-02.webp",
    alt: "《Red Curtain》（红色窗帘），1956：红色窗帘作为前景，窗外有一个渺小的行人。",
    pos: "50% 50%",
  },
  {
    src: "/images/photographs/plate-01.webp",
    alt: "《Through Boards》（隔板之间），1957：深色木板遮住街道，只露出一线白色汽车。",
    pos: "50% 52%",
  },
  {
    src: "/images/photographs/plate-06.webp",
    alt: "《Taxi》（出租车），1957：黄色出租车顶、红色车身，司机的右手搭在车窗内。",
    pos: "50% 46%",
  },
  {
    src: "/images/photographs/plate-10.webp",
    alt: "《Snow》（雪），1970：大雪中的街道、模糊行人，远处有一点黄色灯光。",
    pos: "50% 50%",
  },
  {
    src: "/images/photographs/plate-07.webp",
    alt: "《Blue Skirt》（蓝裙），1950 年代：暗色画面中一条蓝色裙摆在光里移动。",
    pos: "50% 48%",
  },
];

/** Hand-dropped, not random: y offset, rotation, scale per print. */
const JITTER: Array<[number, number, number]> = [
  [-9, -5.2, 0.97],
  [11, 3.4, 1.02],
  [-6, 4.8, 0.99],
  [13, -2.6, 1.01],
  [-11, 5.4, 0.96],
  [8, -4.4, 1.02],
  [-4, 2.2, 0.98],
  [12, 5.8, 1.0],
  [-9, -3.0, 1.01],
  [6, 4.2, 0.97],
  [-7, -5.6, 1.02],
];

type Sim = {
  angle: number;
  vel: number;
  target: number;
  max: number;
  snap: number;
  step: number;
  lit: number;
  landing: number;
  phase: "hold" | "glide";
  clock: number;
  t: number;
  lastT: number;
  visible: boolean;
};

export default function LifeRoom({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pausedRef = useRef(false);

  const [index, setIndex] = useState(START);
  const [readOpen, setReadOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  const sim = useRef<Sim>({
    angle: -MAX_DESKTOP,
    vel: 0,
    target: -MAX_DESKTOP,
    max: MAX_DESKTOP,
    snap: (MAX_DESKTOP * 2) / STEPS,
    step: 110,
    lit: START,
    landing: 420,
    phase: "hold",
    clock: 0,
    t: 0,
    lastT: 0,
    visible: true,
  });

  const chapter = timeline[index];

  /* --- Nothing on this page scrolls ------------------------------------- */

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("life-locked");
    return () => root.classList.remove("life-locked");
  }, []);

  /* --- The lamp ---------------------------------------------------------- */

  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    if (!stage || !rig) return;

    const s = sim.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      pausedRef.current = true;
      setPaused(true);
    }

    const snapAt = (i: number) => -s.max + i * s.snap;

    const measure = () => {
      const width = stage.clientWidth;
      s.max = width < 768 ? MAX_MOBILE : MAX_DESKTOP;
      s.snap = (s.max * 2) / STEPS;
      s.landing = Math.max(
        220,
        rig.offsetHeight - (beamRef.current?.offsetTop ?? 0)
      );

      /* The prints are laid out along one long line that rides under the beam:
         wide enough that they read as separate prints, never as a single pile. */
      s.step = width < 768 ? 74 : Math.min(74, Math.max(58, width * 0.052));
      stage.style.setProperty("--step", `${s.step.toFixed(1)}px`);

      s.target = snapAt(s.lit);
      s.angle = s.target;
    };
    measure();

    const paint = () => {
      const rad = (s.angle * Math.PI) / 180;
      const offset = Math.tan(rad) * s.landing;
      const sway = reduce
        ? 0
        : Math.sin(s.t * 0.62) * 0.22 + Math.sin(s.t * 1.29 + 1.1) * 0.08;

      rig.style.setProperty("--angle", `${(-s.angle + sway).toFixed(2)}deg`);
      stage.style.setProperty("--swing", `${offset.toFixed(1)}px`);

      /* A continuous, frame-by-frame shift: the line of prints glides with the
         beam instead of snapping from one position to the next. */
      const t = (s.angle + s.max) / s.snap;
      stage.style.setProperty("--shift", `${(t * s.step).toFixed(1)}px`);

      const next = Math.max(
        0,
        Math.min(STEPS, Math.round((s.angle + s.max) / s.snap))
      );

      if (next !== s.lit) {
        s.lit = next;
        setIndex(next);
      }
    };

    paint();

    const io = new IntersectionObserver(
      ([entry]) => {
        s.visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(stage);

    let frame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);

      const t = now / 1000;
      if (!s.lastT) s.lastT = t;
      const dt = Math.min(0.04, Math.max(0.001, t - s.lastT));
      s.lastT = t;
      s.t = t;

      if (s.visible) {
        if (reduce) {
          s.angle = s.target;
        } else if (s.phase === "glide") {
          s.clock += dt * 1000;
          const accel = (s.target - s.angle) * 32 - s.vel * 8.4;
          s.vel += accel * dt;
          s.angle += s.vel * dt;

          if (
            s.clock > 500 &&
            Math.abs(s.angle - s.target) < 0.12 &&
            Math.abs(s.vel) < 0.8
          ) {
            s.angle = s.target;
            s.vel = 0;
            s.phase = "hold";
            s.clock = 0;
          }
        } else if (!pausedRef.current) {
          /* Resting on a year: let the reader look, then move on. */
          s.clock += dt * 1000;
          if (s.clock >= HOLD_MS) {
            s.phase = "glide";
            s.clock = 0;
            s.target = snapAt((s.lit + 1) % timeline.length);
          }
        }
      }

      paint();
    };

    frame = requestAnimationFrame(tick);

    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const advance = () => {
    const s = sim.current;
    if (s.phase === "glide") return;

    pausedRef.current = true;
    setPaused(true);

    s.phase = "glide";
    s.clock = 0;
    s.target = -s.max + ((s.lit + 1) % timeline.length) * s.snap;
  };

  const toggleAuto = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
  };

  /* --- The long read ---------------------------------------------------- */

  useEffect(() => {
    if (!readOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80);
    stopScroll();

    const onKeyDown = (key: KeyboardEvent) => {
      if (key.key === "Escape") setReadOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      startScroll();
      try {
        previous?.focus();
      } catch {
        /* the trigger may be gone after a route change */
      }
    };
  }, [readOpen]);

  return (
    <>
      <section
        className="liferoom"
        aria-labelledby="life-title"
        ref={stageRef}
        inert={readOpen || undefined}
      >
        <div className="liferoom__room">
          <div className="liferoom__rig" ref={rigRef}>
            <span className="liferoom__canopy" />
            <span className="liferoom__cord" />

            <button
              type="button"
              className="liferoom__lamp"
              onClick={advance}
              aria-label="下一段人生（会暂停自动巡灯）"
            >
              <svg
                className="liferoom__shade"
                viewBox="0 0 200 130"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <linearGradient
                    id="life-shade-metal"
                    x1="0.18"
                    y1="0"
                    x2="0.62"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#5c5e4d" />
                    <stop offset="0.32" stopColor="#3f4134" />
                    <stop offset="0.7" stopColor="#282a21" />
                    <stop offset="1" stopColor="#14150e" />
                  </linearGradient>
                  <radialGradient
                    id="life-shade-mouth"
                    cx="0.5"
                    cy="0.12"
                    r="0.72"
                  >
                    <stop offset="0" stopColor="#ffe6b8" stopOpacity="0.62" />
                    <stop offset="0.45" stopColor="#c08a48" stopOpacity="0.38" />
                    <stop offset="1" stopColor="#0a0b06" stopOpacity="0.92" />
                  </radialGradient>
                  <linearGradient
                    id="life-shade-rim"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0" stopColor="#ffe3b4" stopOpacity="0" />
                    <stop offset="0.22" stopColor="#ffe6bb" stopOpacity="0.6" />
                    <stop offset="0.5" stopColor="#fff4da" stopOpacity="0.95" />
                    <stop offset="0.78" stopColor="#ffe6bb" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#ffe3b4" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M100 2 C112 2 121 6 125 16 L176 97 C180 110 145 119 100 119 C55 119 20 110 24 97 L75 16 C79 6 88 2 100 2 Z"
                  fill="url(#life-shade-metal)"
                />
                <path
                  d="M24 97 C20 110 55 119 100 119 C145 119 180 110 176 97 Z"
                  fill="url(#life-shade-mouth)"
                  opacity="0.72"
                />
                <path
                  d="M24 97 C20 110 55 119 100 119 C145 119 180 110 176 97"
                  fill="none"
                  stroke="url(#life-shade-rim)"
                  strokeWidth="1.8"
                />
              </svg>
              <span className="liferoom__bulb" />
            </button>

            <div className="liferoom__beam" ref={beamRef}>
              <span className="liferoom__cone liferoom__cone--wide" />
              <span className="liferoom__cone liferoom__cone--core" />

              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((mote) => (
                <span
                  key={mote}
                  className="liferoom__mote"
                  style={
                    {
                      "--mote-x": `${8 + mote * 10.5}%`,
                      "--mote-delay": `${mote * 1.4}s`,
                      "--mote-dur": `${11 + mote * 1.2}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          <span className="liferoom__spill" aria-hidden="true" />
          <div className="liferoom__table" aria-hidden="true" />
          <span className="liferoom__pool" aria-hidden="true" />

          <div className="liferoom__prints">
            {FRAMES.map((frame, i) => {
              const jitter = JITTER[i];
              return (
                <figure
                  key={frame.src}
                  className="liferoom__print"
                  data-lit={i === index}
                  aria-hidden={i !== index}
                  style={
                    {
                      "--i": i,
                      "--jy": `${jitter[0]}px`,
                      "--jr": `${jitter[1]}deg`,
                      "--j": jitter[2],
                    } as CSSProperties
                  }
                >
                  <span className="liferoom__mount">
                    <span className="liferoom__frame">
                      <Image
                        src={frame.src}
                        alt={frame.alt}
                        fill
                        sizes="(max-width: 767px) 44vw, 19vw"
                        style={{ objectFit: "cover", objectPosition: frame.pos }}
                      />
                      <span className="liferoom__emulsion" />
                    </span>
                    <span className="liferoom__stamp" lang="en">
                      {timeline[i].year}
                    </span>
                  </span>
                </figure>
              );
            })}
          </div>
        </div>

        <div className="wrap liferoom__inner">
          <div className="liferoom__top">
            <span className="eyebrow" lang="en">
              THE LIFE / 03
            </span>
            <span className="mono liferoom__span" lang="en">
              1923 — 2013 · PITTSBURGH / NEW YORK
            </span>
          </div>

          <div className="liferoom__copy">
            <h1 id="life-title" className="liferoom__title" lang="en">
              A LIFE, <em>IN FRAGMENTS.</em>
            </h1>

            <p className="liferoom__lede">
              他并不是一个被时代忽略的天才，也不是一个刻意隐退的怪人。他只是一个
              愿意把大部分时间用在观看上的人——而这，恰好需要一生的时间。
            </p>

            <div className="liferoom__readout" key={chapter.year}>
              <span className="liferoom__year" lang="en">
                {chapter.year}
              </span>
              <span className="liferoom__count" lang="en">
                {String(index + 1).padStart(2, "0")} / {timeline.length}
              </span>

              <h2 className="liferoom__event">{chapter.titleCn}</h2>
              <span className="liferoom__event-en" lang="en">
                {chapter.title}
              </span>
              <p className="liferoom__body">{chapter.body}</p>
            </div>
          </div>

          <div className="liferoom__foot">
            <button
              type="button"
              className="liferoom__auto"
              onClick={toggleAuto}
              aria-pressed={paused}
            >
              {paused ? (
                <Play aria-hidden="true" strokeWidth={1.6} />
              ) : (
                <Pause aria-hidden="true" strokeWidth={1.6} />
              )}
              <span lang="en">{paused ? "PLAY" : "PAUSE"}</span>
              <span className="liferoom__auto-cn">
                {paused ? "继续巡灯" : "自动巡灯"}
              </span>
            </button>

            <button
              type="button"
              className="liferoom__read"
              onClick={() => setReadOpen(true)}
            >
              <span className="liferoom__read-kicker" lang="en">
                THE LONG READ
              </span>
              <span className="liferoom__read-sub">长文 · 出版 · 来源</span>
              <span className="liferoom__read-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
        </div>
      </section>

      <div
        className="lifedrawer"
        data-open={readOpen}
        role="dialog"
        aria-modal="true"
        aria-label="索尔·雷特：长文、出版物与来源"
        aria-hidden={!readOpen}
        inert={!readOpen || undefined}
      >
        <div className="lifedrawer__sheet">
          <div className="lifedrawer__bar">
            <span className="lifedrawer__kicker" lang="en">
              THE LONG READ — SAUL LEITER, 1923—2013
            </span>
            <button
              type="button"
              ref={closeRef}
              className="lifedrawer__close"
              onClick={() => setReadOpen(false)}
            >
              <X aria-hidden="true" strokeWidth={1.5} />
              <span lang="en">CLOSE</span>
            </button>
          </div>

          <div className="lifedrawer__scroll" data-lenis-prevent tabIndex={-1}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
