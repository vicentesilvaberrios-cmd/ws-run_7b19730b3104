/* =====================================================================
 * HUD — marcador visible durante el juego
 * ===================================================================== */

import RetroText from "./RetroText";

interface HUDProps {
  score: number;
  highScore: number;
}

export default function HUD({ score, highScore }: HUDProps) {
  const isNewRecord = score > 0 && score >= highScore;

  // Anunciar solo múltiplos de 5 para no saturar lectores de pantalla
  const announceScore = score > 0 && score % 5 === 0 ? `Puntuación: ${score}` : "";

  return (
    <>
      <div
        className="hud-overlay"
        role="status"
        aria-live="off"
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
      <span className="sr-only" role="status" aria-live="polite">
        {announceScore}
      </span>
    </>
  );
}
