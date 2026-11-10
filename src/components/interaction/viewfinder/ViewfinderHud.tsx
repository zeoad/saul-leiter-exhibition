"use client";

import type { MouseEvent, RefObject } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { photographs } from "@/data/photographs";
import type { Photograph } from "@/types";
import { plateNumber } from "@/lib/viewfinder";

const TOTAL = photographs.length;

export interface ViewfinderHudProps {
  overlayRef: RefObject<HTMLDivElement | null>;
  reticleRef: RefObject<HTMLDivElement | null>;
  apertureRef: RefObject<HTMLSpanElement | null>;
  shutterRef: RefObject<HTMLSpanElement | null>;
  flash: boolean;
  intro: boolean;
  toast: string | null;
  live: string;
  found: number[];
  lockedPhoto?: Photograph;
  collected: Photograph[];
  listOpen: boolean;
  onToggleList: () => void;
  onClose: () => void;
  onShoot: () => void;
  onCapturePlate: (plate: number) => void;
  onOverlayClick: (event: MouseEvent<HTMLDivElement>) => void;
}

/**
 * The visible HUD. It renders state and raises intent; all timing, geometry
 * and persistence live in `useViewfinderGame`.
 */
export default function ViewfinderHud({
  overlayRef,
  reticleRef,
  apertureRef,
  shutterRef,
  flash,
  intro,
  toast,
  live,
  found,
  lockedPhoto,
  collected,
  listOpen,
  onToggleList,
  onClose,
  onShoot,
  onCapturePlate,
  onOverlayClick,
}: ViewfinderHudProps) {
  return (
    <div
      ref={overlayRef}
      className="vf"
      data-flash={flash}
      role="dialog"
      aria-modal="true"
      aria-label="取景器：在展览中寻找照片"
      aria-describedby="vf-instructions"
      tabIndex={-1}
      onClick={onOverlayClick}
    >
      <p id="vf-instructions" className="sr-only">
        移动取景框对准照片，按空格或回车拍摄，按 Esc 退出。使用键盘时可用方向键移动取景框；
        屏幕阅读器用户可打开目标列表直接选择照片。
      </p>

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
          className="vf__list-toggle"
          onClick={onToggleList}
          aria-expanded={listOpen}
          aria-controls="vf-target-list"
        >
          目标列表
        </button>
        <button
          type="button"
          className="vf__close"
          onClick={onClose}
          aria-label="退出取景器"
        >
          <X aria-hidden="true" strokeWidth={1.5} />
        </button>
      </header>

      <div
        ref={reticleRef}
        className="vf__reticle"
        data-lock={lockedPhoto ? "true" : "false"}
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
          onClick={onShoot}
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

      {listOpen ? (
        <div
          id="vf-target-list"
          className="vf__list"
          role="group"
          aria-label="目标列表：直接选择照片拍摄"
        >
          <p className="vf__list-head" lang="en">
            CAPTURE WITHOUT AIMING
          </p>
          <ul>
            {photographs.map((photo) => {
              const plate = plateNumber(photo.plate);
              const isFound = found.includes(plate);
              return (
                <li key={photo.slug}>
                  <button
                    type="button"
                    className="vf__list-item"
                    data-found={isFound}
                    disabled={isFound}
                    onClick={() => onCapturePlate(plate)}
                  >
                    <span lang="en">{photo.plate}</span>
                    <span>{photo.title}</span>
                    <span aria-hidden="true">{isFound ? "已收集" : "拍摄"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {intro ? (
        <div className="vf__intro" lang="en">
          <span>MOVE THE FRAME OVER A PHOTOGRAPH</span>
          <span>LOCK IT — THEN SHOOT</span>
        </div>
      ) : null}

      <div className="vf__toast" aria-hidden="true">
        {toast}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {live}
      </p>
    </div>
  );
}
