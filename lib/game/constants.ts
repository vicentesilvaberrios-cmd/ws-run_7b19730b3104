/* =====================================================================
 * GAME_CONFIG — constantes de configuración del juego
 * ===================================================================== */

export const GAME_CONFIG = {
  /** Aceleración hacia abajo por frame */
  GRAVITY: 0.5,

  /** Impulso vertical al saltar (negativo = hacia arriba) */
  JUMP_FORCE: -8,

  /** Ancho de las tuberías en px */
  PIPE_WIDTH: 60,

  /** Hueco vertical entre tubería superior e inferior */
  PIPE_GAP: 160,

  /** Espacio horizontal entre pares de tuberías */
  PIPE_SPACING: 220,

  /** Velocidad de desplazamiento de tuberías (px/frame) */
  PIPE_SPEED: 2.5,

  /** Posición fija del pájaro en X */
  BIRD_X: 80,

  /** Radio del pájaro (colisión circular) */
  BIRD_RADIUS: 14,

  /** Ancho interno del canvas */
  CANVAS_WIDTH: 400,

  /** Alto interno del canvas */
  CANVAS_HEIGHT: 600,

  /** Altura del suelo en px */
  GROUND_HEIGHT: 80,

  /** Colores retro */
  COLORS: {
    SKY: "#70c5ce",
    SKY_DEEP: "#5ec0d6",
    CLOUD: "#ffffff",
    GROUND: "#ded895",
    GROUND_DARK: "#9b8a3c",
    GRASS: "#73bf2e",
    GRASS_DARK: "#558022",
    PIPE: "#73bf2e",
    PIPE_DARK: "#4a8a1e",
    PIPE_LIGHT: "#9be84a",
    PIPE_BORDER: "#2d5e0f",
    BIRD: "#f7d51d",
    BIRD_DARK: "#e0a800",
    BIRD_BELLY: "#fff7cc",
    BIRD_BEAK: "#ff8800",
    BIRD_EYE: "#ffffff",
    BIRD_PUPIL: "#1a1a1a",
    TEXT_SHADOW: "#3a3a3a",
  },

  /** Intervalo de cambio de frame de aleteo (en frames) */
  BIRD_FLAP_INTERVAL: 5,

  /** Margen mínimo del gap desde el borde superior/inferior */
  PIPE_GAP_MARGIN: 60,
} as const;
