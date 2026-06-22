/* =====================================================================
 * Renderizado del fondo: cielo, nubes con parallax y suelo texturizado
 * ===================================================================== */

import { GAME_CONFIG } from "./constants";

/** Nubes predefinidas con posición y tamaño relativo */
const CLOUDS = [
  { x: 50, y: 80, w: 60, h: 24 },
  { x: 180, y: 50, w: 80, h: 30 },
  { x: 320, y: 100, w: 50, h: 20 },
  { x: 100, y: 140, w: 70, h: 26 },
  { x: 280, y: 30, w: 55, h: 22 },
];

/** Dibuja el fondo completo: cielo, nubes con parallax y suelo */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  cloudOffset: number,
  groundOffset: number,
): void {
  const c = GAME_CONFIG.COLORS;
  const W = GAME_CONFIG.CANVAS_WIDTH;
  const H = GAME_CONFIG.CANVAS_HEIGHT;
  const groundY = H - GAME_CONFIG.GROUND_HEIGHT;

  // Cielo (gradiente vertical)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, c.SKY);
  skyGrad.addColorStop(1, c.SKY_DEEP);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, groundY);

  // Nubes con parallax
  drawClouds(ctx, cloudOffset);

  // Suelo texturizado
  drawGround(ctx, groundOffset, groundY);
}

/** Dibuja las nubes con efecto parallax (se repiten horizontalmente) */
function drawClouds(ctx: CanvasRenderingContext2D, offset: number): void {
  const c = GAME_CONFIG.COLORS;
  const W = GAME_CONFIG.CANVAS_WIDTH;
  const totalWidth = W + 200; // espacio extra para repetición

  ctx.fillStyle = c.CLOUD;
  ctx.globalAlpha = 0.85;

  for (const cloud of CLOUDS) {
    let x = ((cloud.x - offset) % totalWidth + totalWidth) % totalWidth;
    if (x > W) continue;

    drawCloud(ctx, x, cloud.y, cloud.w, cloud.h);
  }

  ctx.globalAlpha = 1;
}

/** Dibuja una sola nube (tres círculos agrupados) */
function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const r = h * 0.7;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + w * 0.3, y - h * 0.2, r * 0.9, 0, Math.PI * 2);
  ctx.arc(x + w * 0.6, y, r, 0, Math.PI * 2);
  ctx.arc(x + w * 0.4, y + h * 0.1, r * 0.8, 0, Math.PI * 2);
  ctx.fill();
}

/** Dibuja el suelo texturizado con patrón de césped repetitivo */
function drawGround(
  ctx: CanvasRenderingContext2D,
  offset: number,
  groundY: number,
): void {
  const c = GAME_CONFIG.COLORS;
  const W = GAME_CONFIG.CANVAS_WIDTH;
  const H = GAME_CONFIG.CANVAS_HEIGHT;

  // Base del suelo (tierra)
  ctx.fillStyle = c.GROUND;
  ctx.fillRect(0, groundY, W, GAME_CONFIG.GROUND_HEIGHT);

  // Franja de césped superior
  ctx.fillStyle = c.GRASS;
  ctx.fillRect(0, groundY, W, 16);

  // Línea oscura del borde del césped
  ctx.fillStyle = c.GRASS_DARK;
  ctx.fillRect(0, groundY + 16, W, 3);

  // Patrón de textura (zigzag de césped)
  const tileWidth = 24;
  const totalTiles = Math.ceil(W / tileWidth) + 2;
  const startOffset = -((offset % tileWidth) + tileWidth) % tileWidth;

  ctx.fillStyle = c.GRASS_DARK;
  for (let i = 0; i < totalTiles; i++) {
    const tx = startOffset + i * tileWidth;
    // Patrón de rayas diagonales alternadas
    ctx.beginPath();
    ctx.moveTo(tx, groundY);
    ctx.lineTo(tx + tileWidth / 2, groundY + 8);
    ctx.lineTo(tx + tileWidth, groundY);
    ctx.closePath();
    ctx.fill();
  }

  // Detalles de tierra (puntos pequeños)
  ctx.fillStyle = c.GROUND_DARK;
  const dotOffset = (offset * 0.5) % 40;
  for (let i = 0; i < W / 40 + 2; i++) {
    const dx = i * 40 - dotOffset;
    ctx.fillRect(dx, groundY + 30, 4, 4);
    ctx.fillRect(dx + 20, groundY + 50, 3, 3);
    ctx.fillRect(dx + 10, groundY + 65, 4, 3);
  }
}
