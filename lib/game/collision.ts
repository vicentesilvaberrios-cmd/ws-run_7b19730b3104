/* =====================================================================
 * Detección de colisiones
 * ===================================================================== */

import { GAME_CONFIG } from "./constants";
import type { Bird, Pipe } from "./types";

/**
 * Comprueba colisión entre el pájaro (círculo) y una tubería (rectángulos
 * superior e inferior) usando AABB simplificado.
 */
export function checkPipeCollision(bird: Bird, pipe: Pipe): boolean {
  const topHeight = pipe.gapY - pipe.gapHeight / 2;
  const groundY = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT;
  const bottomY = pipe.gapY + pipe.gapHeight / 2;
  const bottomHeight = groundY - bottomY;

  // Rectángulo superior: (pipe.x, 0, pipe.width, topHeight)
  if (
    circleRectCollide(bird, pipe.x, 0, pipe.width, topHeight)
  ) {
    return true;
  }

  // Rectángulo inferior: (pipe.x, bottomY, pipe.width, bottomHeight)
  if (bottomHeight > 0) {
    if (
      circleRectCollide(bird, pipe.x, bottomY, pipe.width, bottomHeight)
    ) {
      return true;
    }
  }

  return false;
}

/** Colisión del pájaro con el suelo */
export function checkGroundCollision(bird: Bird): boolean {
  const groundY = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT;
  return bird.y + bird.radius >= groundY;
}

/** Colisión del pájaro con el techo */
export function checkCeilingCollision(bird: Bird): boolean {
  return bird.y - bird.radius <= 0;
}

/**
 * Colisión círculo-vs-rectángulo (AABB).
 * Encuentra el punto más cercano del rectángulo al centro del círculo
 * y mide la distancia.
 */
function circleRectCollide(
  bird: Bird,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  const closestX = clamp(bird.x, rx, rx + rw);
  const closestY = clamp(bird.y, ry, ry + rh);

  const dx = bird.x - closestX;
  const dy = bird.y - closestY;

  return dx * dx + dy * dy < bird.radius * bird.radius;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
