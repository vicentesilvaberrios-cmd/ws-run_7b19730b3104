/* =====================================================================
 * Motor del juego: orquesta update + draw, gestiona estados
 * ===================================================================== */

import { GAME_CONFIG } from "./constants";
import type { GameState } from "./types";
import { createBird, drawBird, updateBird, jumpBird } from "./bird";
import { createPipe, drawPipes, updatePipes } from "./pipes";
import { checkCeilingCollision, checkGroundCollision, checkPipeCollision } from "./collision";
import { updateScore, getHighScore } from "./score";
import { drawBackground } from "./background";

/** Crea el estado inicial del juego (idle) */
export function createInitialState(): GameState {
  return {
    status: "idle",
    score: 0,
    highScore: getHighScore(),
    bird: createBird(),
    pipes: [],
    cloudOffset: 0,
    groundOffset: 0,
  };
}

/** Reinicia el juego a estado idle conservando el high score */
export function resetGame(state: GameState): void {
  state.status = "idle";
  state.score = 0;
  state.bird = createBird();
  state.pipes = [];
  state.cloudOffset = 0;
  state.groundOffset = 0;
}

/** Inicia el juego: pasa a playing, resetea el pájaro y da el primer salto */
export function startGame(state: GameState): void {
  state.status = "playing";
  state.score = 0;
  state.pipes = [];
  state.bird = createBird();
  jumpBird(state.bird);
}

/**
 * Maneja el input del usuario según el estado actual:
 * - idle: inicia el juego
 * - playing: hace saltar al pájaro
 * - gameover: reinicia y arranca de nuevo
 */
export function handleInput(state: GameState): void {
  switch (state.status) {
    case "idle":
      startGame(state);
      break;
    case "playing":
      jumpBird(state.bird);
      break;
    case "gameover":
      startGame(state);
      break;
  }
}

/**
 * Actualiza la lógica del juego según el estado.
 * En idle, el pájaro flota suavemente.
 * En playing, aplica física, tuberías, colisiones y puntuación.
 * En gameover, el pájaro cae al suelo.
 */
export function update(state: GameState): void {
  // Parallax de fondo siempre activo (más lento en idle)
  const speedFactor = state.status === "playing" ? 1 : 0.3;
  state.cloudOffset += 0.3 * speedFactor;
  state.groundOffset += GAME_CONFIG.PIPE_SPEED * speedFactor;

  if (state.status === "idle") {
    // Pájaro flotando suavemente
    state.bird.y =
      GAME_CONFIG.CANVAS_HEIGHT / 2 +
      Math.sin(Date.now() / 300) * 12;
    state.bird.rotation = 0;
    // Aleteo lento
    state.bird.frameCounter++;
    if (state.bird.frameCounter >= GAME_CONFIG.BIRD_FLAP_INTERVAL * 2) {
      state.bird.frameCounter = 0;
      state.bird.frameIndex = (state.bird.frameIndex + 1) % 3;
    }
    return;
  }

  if (state.status === "playing") {
    updateBird(state.bird);
    updatePipes(state.pipes);
    updateScore(state);

    // Colisiones
    for (const pipe of state.pipes) {
      if (checkPipeCollision(state.bird, pipe)) {
        state.status = "gameover";
        return;
      }
    }

    if (checkGroundCollision(state.bird)) {
      state.bird.y = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - state.bird.radius;
      state.status = "gameover";
      return;
    }

    if (checkCeilingCollision(state.bird)) {
      state.bird.y = state.bird.radius;
      state.bird.velocity = 0;
    }

    return;
  }

  if (state.status === "gameover") {
    // El pájaro cae al suelo
    if (state.bird.y + state.bird.radius < GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT) {
      updateBird(state.bird);
    } else {
      state.bird.y = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - state.bird.radius;
      state.bird.rotation = Math.PI / 2;
    }
    return;
  }
}

/** Dibuja todo el juego en el canvas según el estado */
export function draw(ctx: CanvasRenderingContext2D, state: GameState): void {
  drawBackground(ctx, state.cloudOffset, state.groundOffset);

  // Dibujar tuberías (no en idle)
  if (state.status !== "idle") {
    drawPipes(ctx, state.pipes);
  }

  drawBird(ctx, state.bird);
}

/** Loop de juego: actualiza y dibuja. Devuelve false si debe detenerse. */
export function gameLoop(
  ctx: CanvasRenderingContext2D,
  state: GameState,
): void {
  update(state);
  draw(ctx, state);
}
