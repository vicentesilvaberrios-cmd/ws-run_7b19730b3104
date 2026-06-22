/* =====================================================================
 * StartScreen — overlay de pantalla de inicio
 * ===================================================================== */

import RetroText from "./RetroText";

interface StartScreenProps {
  highScore: number;
}

export default function StartScreen({ highScore }: StartScreenProps) {
  return (
    <div className="overlay overlay-start" role="presentation">
      <div className="overlay-content stack">
        {/* Pájaro flotando */}
        <div className="bird-logo" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" fill="var(--bird)" stroke="var(--bird-dark)" strokeWidth="2" />
            <ellipse cx="22" cy="28" r="10" fill="var(--bird-belly)" />
            <ellipse cx="16" cy="22" rx="7" ry="5" fill="var(--bird-dark)" />
            <circle cx="32" cy="18" r="5" fill="#ffffff" />
            <circle cx="33" cy="18" r="2.5" fill="#1a1a1a" />
            <polygon points="38,22 46,24 38,26" fill="var(--bird-beak)" />
          </svg>
        </div>

        <RetroText as="h1" className="overlay-title" pixelShadow>
          FLAPPY BIRD
        </RetroText>

        <RetroText as="p" className="overlay-subtitle">
          Vuela entre las tuberías y supera tu récord.
        </RetroText>

        <RetroText as="p" className="blink overlay-hint">
          Pulsa ESPACIO o toca la pantalla para volar
        </RetroText>

        {highScore > 0 && (
          <RetroText as="p" className="overlay-record">
            Récord actual: {highScore} puntos
          </RetroText>
        )}
      </div>
    </div>
  );
}
