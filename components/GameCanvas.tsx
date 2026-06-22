/* =====================================================================
 * GameCanvas — wrapper del <canvas> con escalado responsive
 * ===================================================================== */

import { forwardRef } from "react";
import { GAME_CONFIG } from "@/lib/game/constants";

interface GameCanvasProps {
  onPointerDown: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  function GameCanvas({ onPointerDown, onTouchStart }, ref) {
    return (
      <canvas
        ref={ref}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="game-canvas"
        tabIndex={-1}
        aria-hidden="true"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPointerDown();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onTouchStart(e);
        }}
      />
    );
  },
);

export default GameCanvas;
