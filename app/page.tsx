import type { Metadata } from "next";
import FlappyBirdGame from "@/components/FlappyBirdGame";

export const metadata: Metadata = {
  title: "Flappy Bird — Juego retro online",
  description: "Vuela entre tuberías y supera tu récord en este clásico retro.",
};

export default function HomePage() {
  return (
    <main className="game-page" aria-label="Juego Flappy Bird">
      <FlappyBirdGame />
    </main>
  );
}
