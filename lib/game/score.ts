/* =====================================================================
 * Sistema de puntuación
 * ===================================================================== */

import { GAME_CONFIG } from "./constants";
import type { Bird, GameState, Pipe } from "./types";

const STORAGE_KEY = "flappy-high-score";

/** Obtiene el high score desde localStorage (degradación silenciosa) */
export function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/** Guarda el high score en localStorage (degradación silenciosa) */
export function setHighScore(score: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // Silencioso: el juego funciona sin persistencia
  }
}

/**
 * Actualiza el score: marca la tubería como scored si el pájaro ya pasó
 * su centro y devuelve true si se incrementó el score.
 */
export function updateScore(state: GameState): boolean {
  let scored = false;

  for (const pipe of state.pipes) {
    if (!pipe.scored && pipe.x + pipe.width < state.bird.x) {
      pipe.scored = true;
      state.score++;
      scored = true;

      // Actualizar high score en tiempo real
      if (state.score > state.highScore) {
        state.highScore = state.score;
        setHighScore(state.highScore);
      }
    }
  }

  return scored;
}
