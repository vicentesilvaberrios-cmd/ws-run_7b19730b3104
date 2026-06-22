/* =====================================================================
 * HUD — marcador visible durante el juego
 * ===================================================================== */

import RetroText from "./RetroText";

interface HUDProps {
  score: number;
  highScore: number;
}

export default function HUD({ score, highScore }: HUDProps) {
  const isNewRecord = score > 0 && score >= highScore && score > 0;

  return (
    <div
      className="hud-overlay"
      role="status"
      aria-live="polite"
      aria-label={`Puntuación: ${score}`}
    >
      <RetroText
        as="div"
        pixelShadow
        className="hud-score"
      >
        {score}
      </RetroText>
      {isNewRecord && (
        <span className="badge badge-ok hud-badge" aria-label="Nuevo récord">
          ¡NUEVO RÉCORD!
        </span>
      )}
    </div>
  );
}
