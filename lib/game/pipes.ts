/* =====================================================================
 * Lógica de tuberías
 * ===================================================================== */

import { GAME_CONFIG } from "./constants";
import type { Pipe } from "./types";

/** Crea una tubería nueva en el borde derecho con gap aleatorio */
export function createPipe(x: number): Pipe {
  const minGapY = GAME_CONFIG.PIPE_GAP_MARGIN + GAME_CONFIG.PIPE_GAP / 2;
  const maxGapY =
    GAME_CONFIG.CANVAS_HEIGHT -
    GAME_CONFIG.GROUND_HEIGHT -
    GAME_CONFIG.PIPE_GAP_MARGIN -
    GAME_CONFIG.PIPE_GAP / 2;

  const gapY = minGapY + Math.random() * (maxGapY - minGapY);

  return {
    x,
    gapY,
    gapHeight: GAME_CONFIG.PIPE_GAP,
    width: GAME_CONFIG.PIPE_WIDTH,
    scored: false,
  };
}

/**
 * Actualiza las tuberías: las mueve a la izquierda, elimina las que salen
 * de pantalla y genera nuevas manteniendo el espaciado.
 */
export function updatePipes(pipes: Pipe[]): void {
  // Mover tuberías
  for (const pipe of pipes) {
    pipe.x -= GAME_CONFIG.PIPE_SPEED;
  }

  // Eliminar tuberías que salieron completamente de pantalla
  const removed = pipes.length;
  for (let i = pipes.length - 1; i >= 0; i--) {
    if (pipes[i].x + pipes[i].width < 0) {
      pipes.splice(i, 1);
    }
  }
  void removed; // evita warning de variable no usada

  // Generar nueva tubería si la última está lo suficientemente lejos
  if (pipes.length === 0) {
    pipes.push(createPipe(GAME_CONFIG.CANVAS_WIDTH));
  } else {
    const lastPipe = pipes[pipes.length - 1];
    if (lastPipe.x <= GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.PIPE_SPACING) {
      pipes.push(createPipe(GAME_CONFIG.CANVAS_WIDTH));
    }
  }
}

/** Dibuja las tuberías en el canvas (verde con borde oscuro) */
export function drawPipes(ctx: CanvasRenderingContext2D, pipes: Pipe[]): void {
  const c = GAME_CONFIG.COLORS;
  const groundY = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT;

  for (const pipe of pipes) {
    const topHeight = pipe.gapY - pipe.gapHeight / 2;
    const bottomY = pipe.gapY + pipe.gapHeight / 2;
    const bottomHeight = groundY - bottomY;

    // --- Tubería superior ---
    drawSinglePipe(ctx, pipe.x, 0, pipe.width, topHeight, true, c);

    // --- Tubería inferior ---
    drawSinglePipe(ctx, pipe.x, bottomY, pipe.width, bottomHeight, false, c);
  }
}

/** Dibuja una sola sección de tubería con estilo retro */
function drawSinglePipe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  isTop: boolean,
  c: typeof GAME_CONFIG.COLORS,
): void {
  if (h <= 0) return;

  // Cuerpo de la tubería
  ctx.fillStyle = c.PIPE;
  ctx.fillRect(x, y, w, h);

  // Borde oscuro
  ctx.strokeStyle = c.PIPE_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Brillo (lado izquierdo claro)
  ctx.fillStyle = c.PIPE_LIGHT;
  ctx.fillRect(x + 4, y, 6, h);

  // Sombra (lado derecho oscuro)
  ctx.fillStyle = c.PIPE_DARK;
  ctx.fillRect(x + w - 10, y, 6, h);

  // Cabezal de la tubería (la parte ancha cerca del gap)
  const capHeight = 26;
  const capOverhang = 4;
  const capY = isTop ? y + h - capHeight : y;
  const capX = x - capOverhang;
  const capW = w + capOverhang * 2;

  ctx.fillStyle = c.PIPE;
  ctx.fillRect(capX, capY, capW, capHeight);
  ctx.strokeStyle = c.PIPE_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(capX, capY, capW, capHeight);

  // Brillo del cabezal
  ctx.fillStyle = c.PIPE_LIGHT;
  ctx.fillRect(capX + 4, capY, 6, capHeight);

  // Sombra del cabezal
  ctx.fillStyle = c.PIPE_DARK;
  ctx.fillRect(capX + capW - 10, capY, 6, capHeight);
}
