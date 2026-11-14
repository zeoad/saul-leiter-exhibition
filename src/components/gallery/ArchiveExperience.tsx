"use client";

import { useRef, useState } from "react";

import ArchiveList from "./ArchiveList";
import ArchiveWheel from "./ArchiveWheel";

const MODES = [
  { id: "wheel", label: "WHEEL", hint: "SCROLL OR DRAG TO TURN" },
  { id: "list", label: "LIST", hint: "SEARCH THE REGISTER" },
] as const;

type Mode = (typeof MODES)[number]["id"];

/**
 * /archive — two ways of reading the same sixteen plates.
 *
 * WHEEL is for looking: the register becomes a turning carousel. LIST is for
 * finding: the same data as a searchable catalogue. Only one view is mounted
 * at a time so the wheel's wheel/pointer listeners never run behind the list.
 */
export default function ArchiveExperience({
  plates,
  categories,
}: {
  plates: number;
  categories: number;
}) {
  const [mode, setMode] = useState<Mode>("wheel");
  const tabRefs = useRef<Record<Mode, HTMLButtonElement | null>>({
    wheel: null,
    list: null,
  });

  const active = MODES.find((entry) => entry.id === mode) ?? MODES[0];

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();

    const next: Mode = mode === "wheel" ? "list" : "wheel";
    setMode(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="archive-vault">
      <div className="arch-bar">
        <div
          className="arch-modes"
          role="tablist"
          aria-label="档案视图"
          onKeyDown={onTabKeyDown}
        >
          {MODES.map((entry) => (
            <button
              key={entry.id}
              ref={(node) => {
                tabRefs.current[entry.id] = node;
              }}
              type="button"
              role="tab"
              id={`arch-tab-${entry.id}`}
              aria-selected={mode === entry.id}
              aria-controls={`arch-panel-${entry.id}`}
              tabIndex={mode === entry.id ? 0 : -1}
              className="arch-modes__btn"
              onClick={() => setMode(entry.id)}
            >
              <span lang="en">{entry.label}</span>
            </button>
          ))}
        </div>

        <p className="arch-bar__meta" lang="en">
          <span>
            {String(plates).padStart(2, "0")} PLATES · {categories} CATEGORIES
          </span>
          <span className="arch-bar__hint">{active.hint}</span>
        </p>
      </div>

      <div
        className="arch-panel"
        role="tabpanel"
        id="arch-panel-wheel"
        aria-labelledby="arch-tab-wheel"
        hidden={mode !== "wheel"}
      >
        <ArchiveWheel />
      </div>

      <div
        className="arch-panel"
        role="tabpanel"
        id="arch-panel-list"
        aria-labelledby="arch-tab-list"
        hidden={mode !== "list"}
      >
        {mode === "list" ? <ArchiveList /> : null}
      </div>
    </div>
  );
}
