import type { RefObject } from "react";

/**
 * The camera's body. Purely presentational: every moving part is driven by
 * a CSS state attribute on the parent (`data-state`, `data-blink`), except
 * the pupil, which the cursor watcher moves through the forwarded ref.
 */
export default function CameraGlyph({
  pupilRef,
}: {
  pupilRef: RefObject<SVGCircleElement | null>;
}) {
  return (
    <svg viewBox="0 0 96 76" aria-hidden="true" className="little-camera__svg">
      {/* strap */}
      <path
        d="M12 22 C2 26 -2 44 4 58 L10 56 C6 44 8 32 16 28 Z"
        fill="#596760"
        opacity="0.55"
      />
      {/* body */}
      <rect x="10" y="24" width="76" height="44" rx="4" fill="#343833" />
      <rect
        x="10"
        y="24"
        width="76"
        height="44"
        rx="4"
        fill="none"
        stroke="#596760"
        strokeWidth="1"
      />
      {/* top plate + prism */}
      <path
        d="M26 24 L34 12 H54 L62 24 Z"
        fill="#343833"
        stroke="#596760"
        strokeWidth="1"
      />
      <rect x="12" y="24" width="12" height="5" fill="#596760" opacity="0.6" />
      {/* shutter */}
      <circle cx="76" cy="18" r="6" fill="#A54838" className="little-camera__shutter" />
      <circle
        cx="76"
        cy="18"
        r="6"
        fill="none"
        stroke="#c4af91"
        strokeWidth="0.8"
        opacity="0.7"
      />
      {/* finder window */}
      <rect
        x="17"
        y="32"
        width="12"
        height="9"
        rx="1"
        fill="#252622"
        stroke="#85877c"
        strokeWidth="1"
      />
      <rect x="19" y="34" width="8" height="5" fill="#536d78" opacity="0.55" />
      {/* lens */}
      <circle cx="48" cy="46" r="15" fill="#252622" stroke="#85877c" strokeWidth="1.6" />
      <circle cx="48" cy="46" r="12" fill="none" stroke="#596760" strokeWidth="1" />
      <circle cx="48" cy="46" r="9" fill="#1b1d1a" />
      <circle
        ref={pupilRef}
        cx="48"
        cy="46"
        r="5.5"
        fill="#C4AF91"
        className="little-camera__pupil"
      />
      <circle cx="48" cy="46" r="2.2" fill="#252622" className="little-camera__pupil-core" />
      {/* eyelid for blinking / sleeping */}
      <rect
        x="33"
        y="31"
        width="30"
        height="30"
        rx="15"
        fill="#343833"
        className="little-camera__lid"
      />
      {/* film advance knob + counter */}
      <circle cx="70" cy="34" r="4" fill="#596760" opacity="0.7" />
      <rect x="66" y="55" width="14" height="8" rx="1" fill="#252622" stroke="#596760" strokeWidth="0.8" />
      {/* flash */}
      <circle cx="48" cy="46" r="20" fill="#F3F0E9" className="little-camera__flash" />
    </svg>
  );
}
