"use client";

import { useState } from "react";
import type { MouseEvent, RefObject } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";

import { photographs } from "@/data/photographs";
import type { Photograph } from "@/types";
import { plateNumber } from "@/lib/viewfinder";

const TOTAL = photographs.length;

/** Compose the sixteen collected plates into one downloadable contact sheet. */
async function downloadContactSheet(photos: Photograph[]) {
  try {
    const width = 1600;
    const margin = 64;
    const gap = 14;
    const label = 28;
    const cell = Math.floor((width - margin * 2 - gap * 3) / 4);
    const top = margin + 26;
    const height = top + 4 * (cell + label) + gap * 3 + 44;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#efe9dd";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#1b1c19";
    ctx.font = "500 20px Georgia, 'Times New Roman', serif";
    ctx.fillText("A QUIET GAZE — CONTACT SHEET", margin, 50);
    ctx.font = "500 12px 'Courier New', monospace";
    ctx.textAlign = "right";
    ctx.fillText("16 PLATES · SAUL LEITER · 2026", width - margin, 50);
    ctx.textAlign = "left";

    const images = await Promise.all(
      photos.map(
        (photo) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            const image = new window.Image();
            image.onload = () => resolve(image);
            image.onerror = () => resolve(null);
            image.src = photo.image.src;
          })
      )
    );

    photos.forEach((photo, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      const x = margin + column * (cell + gap);
      const y = top + row * (cell + label + gap);
      const image = images[index];

      ctx.fillStyle = "#111";
      ctx.fillRect(x, y, cell, cell);

      if (image && image.naturalWidth > 0 && image.naturalHeight > 0) {
        const scale = Math.max(
          cell / image.naturalWidth,
          cell / image.naturalHeight
        );
        const sourceWidth = cell / scale;
        const sourceHeight = cell / scale;
        ctx.drawImage(
          image,
          (image.naturalWidth - sourceWidth) / 2,
          (image.naturalHeight - sourceHeight) / 2,
          sourceWidth,
          sourceHeight,
          x,
          y,
          cell,
          cell
        );
      }

      ctx.strokeStyle = "rgba(27, 28, 25, 0.2)";
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y + cell, cell, label);
      ctx.clip();
      ctx.fillStyle = "#1b1c19";
      ctx.font = "500 13px 'Courier New', monospace";
      ctx.fillText(photo.plate, x, y + cell + 18);
      ctx.fillStyle = "rgba(27, 28, 25, 0.58)";
      ctx.fillText(photo.title.toUpperCase(), x + 58, y + cell + 18);
      ctx.restore();
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "saul-leiter-contact-sheet.png";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  } catch {
    /* canvas or download unavailable — the collection stays on screen */
  }
}

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
  guide: boolean;
  targetCount: number;
  onToggleList: () => void;
  onClose: () => void;
  onShoot: () => void;
  onCapturePlate: (plate: number) => void;
  onOverlayClick: (event: MouseEvent<HTMLDivElement>) => void;
  onDismissGuide: (persist: boolean) => void;
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
  guide,
  targetCount,
  onToggleList,
  onClose,
  onShoot,
  onCapturePlate,
  onOverlayClick,
  onDismissGuide,
}: ViewfinderHudProps) {
  const remaining = TOTAL - found.length;
  const complete = remaining <= 0;
  const [eggOpen, setEggOpen] = useState(false);

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
        <span className="vf__title">
          <i className="vf__rec" aria-hidden="true" />
          <span className="vf__title-word" lang="en">
            VIEWFINDER ·
          </span>
          取景器
        </span>
        <span className="vf__count">
          已收集 {String(found.length).padStart(2, "0")} / {TOTAL} · 还差{" "}
          {remaining} 张
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
        <p className="vf__hint">
          移动取景框 · 对准照片 · 点击或空格拍摄 · 滚动寻找 · ESC 退出
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
            CAPTURE WITHOUT AIMING · 直接选择
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

      {!guide && !complete && !lockedPhoto && targetCount === 0 ? (
        <div className="vf__empty">
          <p>这一屏没有可拍的照片。</p>
          <p className="vf__empty-hint">
            向下滚动，照片就在页面更深处；也可以打开目标列表直接拍摄。
          </p>
          <button type="button" onClick={onToggleList}>
            打开目标列表
          </button>
        </div>
      ) : null}

      {guide ? (
        <div
          className="vf__guide"
          role="group"
          aria-label="取景器使用说明"
        >
          <p className="vf__guide-eyebrow" lang="en">
            HOW TO LOOK · 三步上手
          </p>
          <ol className="vf__guide-steps">
            <li>
              <b>01</b>
              <span>移动取景框</span>
              <small>移动鼠标，或在手机上拖动画面。</small>
            </li>
            <li>
              <b>02</b>
              <span>对准合焦</span>
              <small>四角变红，说明照片已经锁定。</small>
            </li>
            <li>
              <b>03</b>
              <span>按下快门</span>
              <small>点击红色快门或按空格，收入胶片。</small>
            </li>
          </ol>
          <div className="vf__guide-actions">
            <button type="button" onClick={() => onDismissGuide(false)}>
              跳过
            </button>
            <button type="button" onClick={() => onDismissGuide(true)}>
              不再显示
            </button>
            <button
              type="button"
              className="vf__guide-start"
              onClick={() => onDismissGuide(true)}
            >
              开始拍摄
            </button>
          </div>
        </div>
      ) : null}

      {complete ? (
        <div className="vf__complete">
          <p className="vf__complete-eyebrow" lang="en">
            CONTACT SHEET COMPLETE · 16 / 16
          </p>
          <h2 className="vf__complete-title">整卷胶片，全部收齐。</h2>
          <p className="vf__complete-line">
            你已经找到索尔·雷特留在这座展览里的全部十六张照片。
          </p>

          <div className="vf__contact" aria-label="接触印相：已收集的十六张照片">
            {photographs.map((photo) => (
              <span key={photo.slug} className="vf__contact-cell">
                <Image
                  src={photo.image.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="vf__contact-img"
                />
                <span lang="en">{photo.plate}</span>
              </span>
            ))}
          </div>

          <button
            type="button"
            className="vf__egg-seal"
            onClick={() => setEggOpen(true)}
            aria-label="冲洗隐藏的第十七格"
          >
            <span className="vf__egg-seal-no" lang="en">
              17
            </span>
            <span className="vf__egg-seal-copy">
              <b>还有一格没有冲洗</b>
              <small>点击显影 · 只留给收齐整卷的人</small>
            </span>
            <span className="vf__egg-seal-arrow" aria-hidden="true">
              ↗
            </span>
          </button>

          <div className="vf__complete-actions">
            <button
              type="button"
              className="vf__download"
              onClick={() => void downloadContactSheet(photographs)}
            >
              <Download aria-hidden="true" strokeWidth={1.4} />
              下载接触印相 PNG
            </button>
            <button type="button" onClick={onClose}>
              继续浏览
            </button>
          </div>
        </div>
      ) : null}

      {complete && eggOpen ? (
        <div
          className="vf__egg"
          role="dialog"
          aria-label="第十七格：拍照的人"
        >
          <button
            type="button"
            className="vf__egg-close"
            onClick={() => setEggOpen(false)}
            aria-label="收起这一格"
          >
            <X aria-hidden="true" strokeWidth={1.5} />
          </button>

          <p className="vf__egg-eyebrow" lang="en">
            FRAME 17 · DEVELOPED IN THE DARK
          </p>

          <div className="vf__egg-body">
            <figure className="vf__egg-frame">
              <Image
                src="/images/portraits/leiter-portrait.webp"
                alt="索尔·雷特肖像，约 1950 年代：他戴着眼镜，在窗边低头。"
                fill
                sizes="(max-width: 767px) 56vw, 200px"
                className="vf__egg-img"
                style={{ objectPosition: "50% 26%" }}
              />
              <span className="vf__egg-grain" aria-hidden="true" />
              <figcaption lang="en">SAUL LEITER · C. 1955 · UNNUMBERED</figcaption>
            </figure>

            <div className="vf__egg-copy">
              <h2 className="vf__egg-title">第十七格：拍照的人。</h2>
              <p>
                十六张照片之外，还有一双一直在看的眼睛。这一格不在作品目录里，
                也不属于任何一次拍摄——它只是提醒你，照片的另一头，始终站着一个人。
              </p>
              <p className="vf__egg-sign" lang="en">
                A QUIET GAZE · FOR THOSE WHO LOOK TWICE
              </p>
              <button
                type="button"
                className="vf__egg-stay"
                onClick={() => setEggOpen(false)}
              >
                收起这一格
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!guide && !complete && intro ? (
        <div className="vf__intro">
          <span>移动取景框，对准一张照片</span>
          <span>红角亮起后，按下快门</span>
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
