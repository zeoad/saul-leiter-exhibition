"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { displayYear, getAllPhotographs, getDisplayRatio } from "@/lib/gallery";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Signed distance in plates, wrapped so the register runs as a ring. */
const offsetFor = (index: number, value: number, total: number) => {
  const raw = index - value;
  return raw - total * Math.round(raw / total);
};

/** Full plates hold their weight; the two incoming ones sit at the edges. */
const fadeFor = (offset: number) =>
  clamp((2.9 - Math.abs(offset)) / 0.5, 0, 1);

/**
 * WHEEL — the archive as a turning carousel of prints.
 *
 * Wheel, drag or arrow keys turn it. Plates are laid out by plate offset, not
 * by absolute position: one at centre, one either side fully visible, and two
 * more cut by the frame. Clicking an off-centre plate turns it into place
 * rather than navigating, so the title above always describes what you see.
 */
export default function ArchiveWheel() {
  const photos = useMemo(() => getAllPhotographs(), []);
  const total = photos.length;
  const maxIndex = total - 1;
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rotRef = useRef(0);
  const targetRef = useRef(0);
  const activeRef = useRef(0);
  const rafRef = useRef(0);
  const dragRef = useRef<{ x: number; rot: number } | null>(null);
  const suppressClick = useRef(false);
  const reducedRef = useRef(false);

  const apply = useCallback(
    (value: number) => {
      rotRef.current = value;

      cardRefs.current.forEach((node, index) => {
        if (!node) return;

        const offset = offsetFor(index, value, total);

        node.style.setProperty("--o", offset.toFixed(3));
        node.style.opacity = String(fadeFor(offset));
        node.style.zIndex = String(Math.round(120 - Math.abs(offset) * 10));
        node.style.pointerEvents = Math.abs(offset) < 2.2 ? "auto" : "none";
      });

      const next = Math.round(clamp(value, 0, maxIndex));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    },
    [maxIndex, total]
  );

  const kick = useCallback(() => {
    if (rafRef.current) return;

    const tick = () => {
      const target = targetRef.current;
      const diff = target - rotRef.current;

      if (Math.abs(diff) < 0.0015) {
        apply(target);
        rafRef.current = 0;
        return;
      }

      apply(rotRef.current + diff * (reducedRef.current ? 1 : 0.16));
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [apply]);

  const goTo = useCallback(
    (index: number) => {
      targetRef.current = clamp(index, 0, maxIndex);
      kick();
    },
    [kick, maxIndex]
  );

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    apply(0);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [apply]);

  /* Non-passive wheel listener: turning the wheel must not scroll the page,
     but at either end the gesture is handed back to the document. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const direction = Math.sign(event.deltaY);
      const atStart = targetRef.current <= 0 && direction < 0;
      const atEnd = targetRef.current >= maxIndex && direction > 0;
      if (atStart || atEnd) return;

      event.preventDefault();
      event.stopPropagation();

      targetRef.current = clamp(
        targetRef.current + event.deltaY * 0.0035,
        0,
        maxIndex
      );
      kick();
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [kick, maxIndex]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    suppressClick.current = false;
    dragRef.current = { x: event.clientX, rot: targetRef.current };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 8) suppressClick.current = true;

    targetRef.current = clamp(drag.rot - dx / 170, 0, maxIndex);
    kick();
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(maxIndex);
    else
      goTo(Math.round(targetRef.current) + (event.key === "ArrowRight" ? 1 : -1));
  };

  const current = photos[active];

  return (
    <>
      <div
        ref={rootRef}
        className="arch-wheel"
        role="region"
        aria-roledescription="轮盘"
        aria-label="照片轮盘：用滚轮、拖拽或方向键转动，回车打开中央作品"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <div className="arch-wheel__arcs" aria-hidden="true" />

        <span className="arch-wheel__watermark" aria-hidden="true">
          <span lang="en">SAUL</span>
          <span lang="en">LEITER</span>
        </span>

        <div className="arch-wheel__meta arch-wheel__meta--left">
          <span className="arch-wheel__index" lang="en" aria-hidden="true">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="arch-wheel__label" lang="en">
            PLATE / {current.plate}
          </span>
          <p className="arch-wheel__note" lang="en">
            {current.category.join(" / ")}
          </p>
          <p className="arch-wheel__note" lang="en">
            SOURCE / SAUL LEITER FOUNDATION
          </p>
        </div>

        <div className="arch-wheel__meta arch-wheel__meta--right">
          <span className="arch-wheel__year" lang="en" aria-hidden="true">
            {displayYear(current)}
          </span>
          <span className="arch-wheel__label" lang="en">
            DATING
          </span>
          <p className="arch-wheel__note" lang="en">
            ESTATE OF SAUL LEITER
          </p>
          <p className="arch-wheel__note" lang="en">
            RIGHTS / EDITORIAL STUDY
          </p>
        </div>

        <div className="arch-wheel__title">
          <span className="arch-wheel__kicker" lang="en">
            SAUL LEITER · {current.plate}
          </span>
          <h2 className="display" lang="en">
            {current.title}
          </h2>
          {current.titleCn ? <p>{current.titleCn}</p> : null}
        </div>

        <div className="arch-wheel__stage">
          {photos.map((photo, index) => {
            const offset = offsetFor(index, 0, total);
            const isActive = index === active;

            return (
              <Link
                key={photo.slug}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                href={`/work/${photo.slug}/`}
                className="arch-wheel__card"
                data-active={isActive}
                tabIndex={isActive ? 0 : -1}
                aria-label={`${photo.plate} ${photo.title}`}
                style={
                  {
                    "--o": offset,
                    "--tilt": `${index % 2 ? 2.4 : -2.4}deg`,
                    "--ratio": getDisplayRatio(photo),
                    opacity: fadeFor(offset),
                    zIndex: Math.round(120 - Math.abs(offset) * 10),
                  } as CSSProperties
                }
                onClick={(event) => {
                  if (suppressClick.current) {
                    event.preventDefault();
                    suppressClick.current = false;
                    return;
                  }
                  /* Off-centre plates turn into place instead of leaving the page. */
                  if (!isActive) {
                    event.preventDefault();
                    goTo(index);
                  }
                }}
              >
                <span className="arch-wheel__print">
                  <span className="arch-wheel__window">
                    <Image
                      src={photo.image.src}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 24vw, 240px"
                      className="arch-wheel__img"
                    />
                  </span>
                  <span className="arch-wheel__plate" lang="en">
                    {photo.plate}
                    {isActive ? (
                      <span className="arch-wheel__open">OPEN ↗</span>
                    ) : null}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="arch-wheel__hint" lang="en">
          SCROLL OR DRAG TO TURN · CLICK A PLATE TO BRING IT FORWARD
        </p>
      </div>

      <div className="arch-wheel__foot">
        <p>
          十六个编号沿圆弧排开：中央是当前翻到的一张，左右各留一张完整，
          再往外的两张正被画框切开。滚轮或拖拽让轮盘转动，点一下偏侧的照片
          会把它转到中央；想直接查找，切到 LIST 按标题、编号或类别检索。
        </p>
        <span className="arch-wheel__foot-meta" lang="en">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}{" "}
          ON THE ARC · CIRCULAR REGISTER
        </span>
      </div>
    </>
  );
}
