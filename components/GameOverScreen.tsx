/* =====================================================================
 * GameOverScreen — overlay de fin de juego
 * ===================================================================== */

import { useEffect, useRef } from "react";
import RetroText from "./RetroText";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function GameOverScreen({
  score,
  highScore,
  onRestart,
}: GameOverScreenProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isNewRecord = score >= highScore && score > 0;

  useEffect(() => {
    // Foco automático en el botón al aparecer
    buttonRef.current?.focus();
  }, []);

  return (
    <div
      className="overlay overlay-gameover"
      role="alertdialog"
      aria-labelledby="gameover-title"
      aria-modal="true"
    >
      <div className="overlay-content stack">
        <RetroText as="h2" id="gameover-title" className="overlay-title" pixelShadow>
          GAME OVER
        </RetroText>

        <RetroText as="p" className="overlay-score-line">
          Puntuación: {score}
        </RetroText>

        <div className="cluster justify-center">
          <RetroText as="p" className="overlay-score-line">
            Récord: {highScore}
          </RetroText>
          {isNewRecord && (
            <span className="badge badge-ok">¡Nuevo récord!</span>
          )}
        </div>

        <button
          ref={buttonRef}
          className="btn btn-primary btn-restart"
          onClick={onRestart}
          aria-label="Reiniciar partida"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
