"use client";

/* =====================================================================
 * FlappyBirdGame — componente cliente principal
 * Gestiona el canvas, el loop de juego, los estados y los inputs.
 * ===================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import GameCanvas from "./GameCanvas";
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import HUD from "./HUD";
import {
  createInitialState,
  handleInput,
  update,
  draw,
} from "@/lib/game/engine";
import { getHighScore } from "@/lib/game/score";
import type { GameStatus } from "@/lib/game/types";

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(createInitialState());
  const animRef = useRef<number | null>(null);
  const prevStatusRef = useRef<GameStatus>("idle");

  // React state para forzar re-render de overlays
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [liveRegion, setLiveRegion] = useState("");

  /** Sincroniza el React state con el estado interno del juego */
  const syncState = useCallback(() => {
    const s = stateRef.current;
    setStatus(s.status);
    setScore(s.score);
    setHighScore(s.highScore);
  }, []);

  /** Maneja el input del usuario */
  const onInput = useCallback(() => {
    const s = stateRef.current;
    const prevStatus = s.status;
    handleInput(s);

    if (prevStatus !== s.status) {
      prevStatusRef.current = s.status;
      if (s.status === "playing") {
        setLiveRegion("Juego iniciado");
      } else if (s.status === "gameover") {
        setLiveRegion(`Game Over, puntuación ${s.score}`);
      }
    }

    syncState();
  }, [syncState]);

  /** Loop de animación con requestAnimationFrame */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Cargar high score desde localStorage
    const hs = getHighScore();
    stateRef.current.highScore = hs;
    setHighScore(hs);

    let lastScore = -1;

    const loop = () => {
      const s = stateRef.current;

      update(s);
      draw(ctx, s);

      // Detectar cambio de score para re-render del HUD
      if (s.score !== lastScore) {
        lastScore = s.score;
        setScore(s.score);
        setHighScore(s.highScore);
      }

      // Detectar transición a gameover
      if (s.status !== prevStatusRef.current) {
        prevStatusRef.current = s.status;
        setStatus(s.status);
        if (s.status === "gameover") {
          setLiveRegion(`Game Over, puntuación ${s.score}`);
        } else if (s.status === "playing") {
          setLiveRegion("Juego iniciado");
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Listeners de teclado */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        onInput();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInput]);

  /** Listener de touch en el contenedor (evita scroll/zoom) */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      onInput();
    },
    [onInput],
  );

  return (
    <div
      className="game-container"
      role="application"
      aria-label="Juego: pulsa para volar"
      onPointerDown={(e) => {
        e.preventDefault();
        onInput();
      }}
      onTouchStart={handleTouchStart}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "480px",
        aspectRatio: "2 / 3",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <GameCanvas
        ref={canvasRef}
        onPointerDown={onInput}
        onTouchStart={handleTouchStart}
      />

      {/* Región live accesible */}
      <span className="sr-only" role="status" aria-live="polite">
        {liveRegion}
      </span>

      {/* Overlays según estado */}
      {status === "idle" && <StartScreen highScore={highScore} />}
      {status === "playing" && <HUD score={score} highScore={highScore} />}
      {status === "gameover" && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          onRestart={onInput}
        />
      )}
    </div>
  );
}
