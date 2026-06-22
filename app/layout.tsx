import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-retro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flappy Bird — Juego retro online",
  description: "Vuela entre tuberías y supera tu récord en este clásico retro.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#70c5ce",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={pressStart.variable}>
      <body>{children}</body>
    </html>
  );
}
