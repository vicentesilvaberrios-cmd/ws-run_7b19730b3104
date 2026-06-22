/* =====================================================================
 * Tipos del juego
 * ===================================================================== */

export interface Bird {
  /** Posición horizontal fija (centro del canvas) */
  x: number;
  /** Posición vertical actual */
  y: number;
  /** Velocidad vertical actual (px/frame) */
  velocity: number;
  /** Radio para colisión circular */
  radius: number;
  /** Ángulo de rotación en radianes */
  rotation: number;
  /** Frame actual de animación de aleteo (0-2) */
  frameIndex: number;
  /** Contador interno para alternar frames */
  frameCounter: number;
}

export interface Pipe {
  /** Posición horizontal (se mueve hacia la izquierda) */
  x: number;
  /** Posición Y del centro del hueco */
  gapY: number;
  /** Altura del hueco entre tubería superior e inferior */
  gapHeight: number;
  /** Ancho de la tubería */
  width: number;
  /** true si el pájaro ya pasó esta tubería (evita contar 2x) */
  scored: boolean;
}

export type GameStatus = "idle" | "playing" | "gameover";

export interface GameState {
  /** Estado actual del juego */
  status: GameStatus;
  /** Puntuación actual */
  score: number;
  /** Mejor puntuación (persistida) */
  highScore: number;
  /** Instancia del pájaro */
  bird: Bird;
  /** Lista de tuberías activas */
  pipes: Pipe[];
  /** Offset del parallax de nubes */
  cloudOffset: number;
  /** Offset del parallax del suelo */
  groundOffset: number;
}
