/* =====================================================================
 * Lógica del pájaro
 * ===================================================================== */

import { GAME_CONFIG } from "./constants";
import type { Bird } from "./types";

/** Crea un pájaro nuevo en la posición central vertical del canvas */
export function createBird(): Bird {
  return {
    x: GAME_CONFIG.BIRD_X,
    y: GAME_CONFIG.CANVAS_HEIGHT / 2,
    velocity: 0,
    radius: GAME_CONFIG.BIRD_RADIUS,
    rotation: 0,
    frameIndex: 0,
    frameCounter: 0,
  };
}

/** Aplica gravedad y actualiza posición/rotación del pájaro */
export function updateBird(bird: Bird): void {
  bird.velocity += GAME_CONFIG.GRAVITY;
  bird.y += bird.velocity;

  // Rotación: nariz arriba al subir, nariz abajo al caer
  const maxUp = -0.5;
  const maxDown = Math.PI / 2; // 90 grados hacia abajo
  const targetRotation =
    bird.velocity < 0
      ? maxUp
      : Math.min(maxDown, bird.velocity * 0.08);

  // Interpolación suave hacia la rotación objetivo
  bird.rotation += (targetRotation - bird.rotation) * 0.15;

  // Animación de aleteo
  bird.frameCounter++;
  if (bird.frameCounter >= GAME_CONFIG.BIRD_FLAP_INTERVAL) {
    bird.frameCounter = 0;
    bird.frameIndex = (bird.frameIndex + 1) % 3;
  }
}

/** Aplica impulso vertical al pájaro (salto) */
export function jumpBird(bird: Bird): void {
  bird.velocity = GAME_CONFIG.JUMP_FORCE;
  bird.frameIndex = 1; // frame de aleteo activo
  bird.frameCounter = 0;
}

/** Dibuja el pájaro en el canvas con animación de aleteo */
export function drawBird(ctx: CanvasRenderingContext2D, bird: Bird): void {
  const c = GAME_CONFIG.COLORS;
  const r = bird.radius;

  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.rotation);

  // Cuerpo (círculo amarillo)
  ctx.fillStyle = c.BIRD;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = c.BIRD_DARK;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Panza clara
  ctx.fillStyle = c.BIRD_BELLY;
  ctx.beginPath();
  ctx.arc(2, 4, r * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Ala — animación de aleteo según frameIndex
  ctx.fillStyle = c.BIRD_DARK;
  const wingOffsets = [-3, 0, 3]; // arriba, centro, abajo
  const wingY = wingOffsets[bird.frameIndex] ?? 0;
  ctx.beginPath();
  ctx.ellipse(-4, wingY, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ojo (blanco)
  ctx.fillStyle = c.BIRD_EYE;
  ctx.beginPath();
  ctx.arc(r * 0.45, -r * 0.4, r * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Pupila
  ctx.fillStyle = c.BIRD_PUPIL;
  ctx.beginPath();
  ctx.arc(r * 0.55, -r * 0.4, r * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Pico (naranja)
  ctx.fillStyle = c.BIRD_BEAK;
  ctx.beginPath();
  ctx.moveTo(r * 0.7, -2);
  ctx.lineTo(r * 1.5, 0);
  ctx.lineTo(r * 0.7, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
