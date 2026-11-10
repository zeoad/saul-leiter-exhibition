"use client";

import Link from "next/link";
import { X } from "lucide-react";

import CameraGlyph from "./camera/CameraGlyph";
import DarkroomPanel from "./camera/DarkroomPanel";
import { useCameraCompanion } from "./camera/useCameraCompanion";

/**
 * LITTLE CAMERA — the exhibition's desk companion and the door to the
 * viewfinder game.
 *
 *   · always present (no persisted hiding: a refresh brings it back)
 *   · breathes, blinks, follows the cursor with its lens
 *   · click → opens THE VIEWFINDER
 *   · five rapid clicks → the hidden darkroom
 *   · linger 8s on a plate → "Look closer."
 *   · reach the exit scene → "Wait. One more photograph."
 *
 * Behaviour lives in `useCameraCompanion`; this file only composes it.
 */
export default function LittleCamera() {
  const {
    ready,
    dismissed,
    state,
    blink,
    bubble,
    panelPhoto,
    foundCount,
    rootRef,
    pupilRef,
    onClick,
    onEnter,
    onLeave,
    dismiss,
    closeDarkroom,
  } = useCameraCompanion();

  if (!ready || dismissed) return null;

  return (
    <>
      <div
        ref={rootRef}
        className="little-camera"
        data-state={state}
        data-blink={blink}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <button
          type="button"
          className="little-camera__body"
          onClick={onClick}
          aria-label="Little Camera：打开取景器，在展览里寻找照片"
        >
          <span className="little-camera__counter" lang="en">
            {String(foundCount).padStart(2, "0")}
          </span>

          <CameraGlyph pupilRef={pupilRef} />
        </button>

        {bubble && (
          <div className="little-camera__bubble" role="status">
            <span className="little-camera__bubble-text" lang="en">
              {bubble.text}
            </span>
            {bubble.actionHref ? (
              <Link
                href={bubble.actionHref}
                className="little-camera__bubble-action"
                lang="en"
              >
                {bubble.actionLabel} →
              </Link>
            ) : null}
            {bubble.onAction ? (
              <button
                type="button"
                className="little-camera__bubble-action"
                onClick={bubble.onAction}
                lang="en"
              >
                {bubble.actionLabel} →
              </button>
            ) : null}
          </div>
        )}

        <button
          type="button"
          className="little-camera__dismiss"
          onClick={dismiss}
          aria-label="收起小相机"
          title="收起小相机（刷新后重新出现）"
        >
          <X aria-hidden="true" strokeWidth={2} />
        </button>
      </div>

      {panelPhoto && (
        <DarkroomPanel photo={panelPhoto} onClose={closeDarkroom} />
      )}
    </>
  );
}
