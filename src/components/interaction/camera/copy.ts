/**
 * Copy and tuning constants for the desk camera. Kept out of the component so
 * the state machine reads as behaviour, not as a pile of English strings.
 */

export type CameraState =
  | "idle"
  | "hover"
  | "click"
  | "follow"
  | "sleep"
  | "secret";

export interface Bubble {
  text: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const SLEEP_AFTER = 60_000;
export const DWELL_NEEDED = 8_000;
export const CLICK_WINDOW = 2_500;
export const CLICKS_NEEDED = 5;

export const HOVER_LINES = [
  "Take me to the viewfinder.",
  "Press me — let's go looking.",
  "There is more here than you think.",
];

export const COPY = {
  greeting: "I can show you the whole exhibition. Click me.",
  greetingAction: "OPEN THE VIEWFINDER",
  opening: "Opening the viewfinder…",
  exitLine: "Wait. One more photograph.",
  exitAction: "OPEN THE DARKROOM",
  dwellLine: "Look closer.",
  secretLine: "Click! A hidden frame, just for you.",
  darkroomBody:
    "你找到了暗房里的一张底片。它一直在那里，等一个愿意停留的人。",
  darkroomLink: "ENTER THE PLATE →",
} as const;
