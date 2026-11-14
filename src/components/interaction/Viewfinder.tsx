"use client";

import { createPortal } from "react-dom";

import ViewfinderHud from "./viewfinder/ViewfinderHud";
import { useViewfinderGame } from "./viewfinder/useViewfinderGame";

/**
 * THE VIEWFINDER — a capture game laid over the exhibition.
 *
 * Focus the reticle: move the pointer (or drag on touch) over a plate. When the
 * reticle locks a photograph the AF brackets close and the HUD names it. Shoot
 * (click the shutter, Space or Enter) to add it to your film. Progress persists
 * in localStorage, so the collection keeps growing between visits.
 *
 * A keyboard-only path and a screen-reader target list mean the game can be
 * completed without pointing at anything.
 */
export default function Viewfinder() {
  const game = useViewfinderGame();

  if (!game.mounted || !game.open) return null;

  return createPortal(
    <ViewfinderHud
      overlayRef={game.overlayRef}
      reticleRef={game.reticleRef}
      apertureRef={game.apertureRef}
      shutterRef={game.shutterRef}
      flash={game.flash}
      intro={game.intro}
      toast={game.toast}
      live={game.live}
      found={game.found}
      lockedPhoto={game.lockedPhoto}
      collected={game.collected}
      listOpen={game.listOpen}
      guide={game.guide}
      targetCount={game.targetCount}
      onToggleList={game.toggleList}
      onClose={game.close}
      onShoot={() => game.capture()}
      onCapturePlate={(plate) => game.capture(plate)}
      onOverlayClick={game.handleOverlayClick}
      onDismissGuide={game.dismissGuide}
    />,
    document.body
  );
}
