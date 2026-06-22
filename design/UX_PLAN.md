# Plan de UX — Flappy Bird Web

## Principios generales
- **Una sola ruta** (`/`): canvas + overlays HTML posicionados absolutamente sobre él.
- **Adaptación del design system**: reutilizar `.card`, `.btn`, `.btn-primary`, `.badge`, `.badge-ok`, `.stack`, `var(--sp-*)` del estándar; añadir en `globals.css` los **tokens retro** (`--sky`, `--pipe`, `--ground`, `--bird`, …) y **utilidades** (`.font-retro`, `.blink`, `.text-shadow-pixel`).
- **Sin jerga** en UI; español para usuarios finales; nada de "endpoint", "submit", "request".
- **Controles universalmente accesibles**: teclado, mouse y touch comparten la misma acción ("saltar / iniciar / reiniciar"). Sin login, sin formularios, sin datos remotos.

---

## `app/layout.tsx` — layout raíz
- Carga `Press Start 2P` vía `next/font/google` → expone variable CSS `--font-retro`, aplicada al `<body>`.
- **Metadata SEO** (sin jerga):
  - `title`: "Flappy Bird — Juego retro online"
  - `description`: "Vuela entre tuberías y supera tu récord en este clásico retro."
  - `viewport`: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`.
- `<html lang="es">`.

## `app/page.tsx` — página principal
- Server component que renderiza `<FlappyBirdGame />` dentro de `<main class="container">`.
- Layout: `min-height: 100dvh; display: grid; place-items: center; padding: var(--sp-3);`.
- `<main aria-label="Juego Flappy Bird">`.

## `components/FlappyBirdGame.tsx` — raíz cliente
- Contenedor relativo `position: relative; max-width: 480px; aspect-ratio: 2/3; width: 100%;` que aloja `<GameCanvas>` + overlays (`StartScreen`, `HUD`, `GameOverScreen`) según `status`.
- Estado `GameState`; carga `highScore` desde `localStorage` en `useEffect` (degradación silenciosa si no disponible → funciona sin persistencia, sin mensaje de error).
- **Listeners**:
  - `window.addEventListener('keydown', …)` para `Space` y `ArrowUp` con `preventDefault` (evita scroll de página).
  - `pointerdown` y `touchstart` en el contenedor con `preventDefault` (evita scroll/zoom en móvil).
- **A11y del contenedor**: `role="application"`, `aria-label="Juego: pulsa para volar"`; región `aria-live="polite"` para anunciar transiciones de estado ("Juego iniciado", "Game Over, puntuación X").
- **Estados de carga/ error**: la inicialización es <100 ms; si la fuente no está lista se muestra la `StartScreen` sin parpadeo (no bloquea).

## `components/GameCanvas.tsx` — wrapper del canvas
- `<canvas width={400} height={600}>` con clase `.game-canvas` (`image-rendering: pixelated; max-width: 100%; display: block;`).
- `tabIndex={-1}`, `aria-hidden="true"` (la información vive en los overlays HTML).
- `onPointerDown` / `onTouchStart` con `preventDefault`, delegando a `handleInput`.
- `-webkit-tap-highlight-color: transparent` para evitar flash azul en tap móvil.

## `components/StartScreen.tsx` — overlay inicio (`status === 'idle'`)
- `.card` semitransparente (`background: rgba(0,0,0,0.35); color: #fff;`) centrado absoluto sobre el canvas; tipografía `.font-retro`; `.stack` vertical.
- **COPY**:
  - H1: "FLAPPY BIRD"
  - Subtítulo: "Vuela entre las tuberías y supera tu récord."
  - Texto `.blink`: "Pulsa ESPACIO o toca la pantalla para volar"
  - Pie (condicional, solo si `highScore > 0`): "Récord actual: {N} puntos"
- Animación `float` del pájaro-logo (3 s `ease-in-out` infinite); desactivar con `prefers-reduced-motion: reduce`.

## `components/HUD.tsx` — marcador en juego (`status === 'playing'`)
- Posición absoluta `top: var(--sp-3); right: var(--sp-4);` sobre el canvas.
- **COPY**: número grande `{score}` con `.font-retro` + `.text-shadow-pixel` para legibilidad sobre el cielo.
- Cuando `score > highScore` durante la partida → badge `.badge-ok` "¡NUEVO RÉCORD!" a la derecha.
- `role="status"`, `aria-live="polite"` (anuncia cada múltiplo de 5 para no saturar).

## `components/GameOverScreen.tsx` — overlay game over (`status === 'gameover'`)
- `.card` semitransparente con `.stack` vertical; tipografía `.font-retro`.
- **COPY**:
  - H2: "GAME OVER"
  - "Puntuación: {score}"
  - "Récord: {highScore}" — si nuevo récord: `.badge-ok` "¡Nuevo récord!" junto al número.
- Botón `<button class="btn btn-primary">` con texto "Reiniciar"; tamaño mínimo **56×56 px** en móvil, `min-height: 44px` garantizado; `aria-label="Reiniciar partida"`; `autoFocus` al aparecer.
- Disparadores equivalentes: click en botón, o Space/ArrowUp/click en canvas → reset completo (`status = 'playing'`, `score = 0`, sin tuberías, pájaro al centro).
- `role="alertdialog"`, `aria-labelledby` apuntando al H2.

---

## `app/globals.css` — añadidos sobre el estándar
- **Tokens retro**: `--sky`, `--sky-deep`, `--cloud`, `--ground`, `--ground-dark`, `--pipe`, `--pipe-dark`, `--bird`, `--bird-belly`.
- **Utilidades**:
  - `.font-retro` → `font-family: var(--font-retro);`.
  - `.text-shadow-pixel` → `text-shadow: 2px 2px 0 var(--brand-dark);` (legibilidad sobre canvas).
  - `.blink` → `animation: blink 1s steps(2, start) infinite;` (desactivado bajo `prefers-reduced-motion`).
- **Reset del juego** (solo en la página del juego):
  - `html, body { overflow: hidden; touch-action: none; user-select: none; -webkit-tap-highlight-color: transparent; }`.
- `canvas { image-rendering: pixelated; }`.

---

## Responsive
- **Móvil (<640 px)**: canvas `width: min(100vw - 16px, 480px)`; tipografía HUD con `clamp()`; botones ≥56 px.
- **Tablet (≥640 px)**: proporción 2/3 mantenida; más aire alrededor.
- **Desktop (≥960 px)**: `max-width: 480px` para no distorsionar el pixel-art; overlay `max-width: 360px`.

## Accesibilidad transversal
- **Contraste**: textos retro reforzados con `text-shadow`; botones sobre overlays semitransparentes con tokens AA.
- **Movimiento**: parpadeo y `float` se desactivan bajo `prefers-reduced-motion: reduce`.
- **Teclado**: Space y ArrowUp son la única interacción necesaria; el botón "Reiniciar" recibe foco automático al aparecer.
- **Lectores de pantalla**: cambios de estado vía `aria-live`; canvas `aria-hidden` (la información vive en HTML).
- **Touch**: objetivo mínimo 44×44 px en "Reiniciar"; `touch-action: none` evita scroll/zoom accidentales.

---

## Tabla de copy consolidada
| Contexto | Texto |
|---|---|
| `<title>` | Flappy Bird — Juego retro online |
| `meta description` | Vuela entre tuberías y supera tu récord en este clásico retro. |
| H1 inicio | FLAPPY BIRD |
| Subtítulo inicio | Vuelve entre las tuberías y supera tu récord. *(corregido: "Vuela entre…")* |
| Instrucción parpadeante | Pulsa ESPACIO o toca la pantalla para volar |
| Récord inicio | Récord actual: {N} puntos |
| HUD | {score} |
| HUD nuevo récord | ¡NUEVO RÉCORD! |
| H2 game over | GAME OVER |
| Game over score | Puntuación: {score} |
| Game over récord | Récord: {highScore} |
| Game over nuevo récord | ¡Nuevo récord! |
| Botón reiniciar | Reiniciar |
| aria-label contenedor | Juego: pulsa para volar |
| aria-label botón | Reiniciar partida |
| aria-live al iniciar | Juego iniciado |
| aria-live al perder | Game Over, puntuación {score} |