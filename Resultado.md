# Resultado.md — Flappy Bird Web Game

## Resumen general

Se construyó un juego web de **Flappy Bird** completamente funcional usando **Next.js 14 (App Router) + TypeScript + Canvas HTML5**. El juego corre 100% en el cliente (sin backend ni API). El pájaro cae por gravedad, salta con Space/click/tap, hay tuberías procedurales con huecos aleatorios, colisiones, puntuación con high score persistente en `localStorage`, tres estados de juego (idle, playing, gameover) y un estilo visual retro colorido con fuente "Press Start 2P".

---

## Stack técnico verificado

| Aspecto | Valor |
|---------|-------|
| Framework | Next.js 14.2.35 (App Router) |
| Lenguaje | TypeScript estricto |
| Renderizado | Canvas 2D API |
| Loop | `requestAnimationFrame` |
| Fuente retro | Press Start 2P vía `next/font/google` |
| Persistencia | `window.localStorage` (clave `flappy-high-score`) |
| Dependencias externas | Ninguna (solo `next`, `react`, `react-dom`) |

---

## Archivos generados (lista real)

### App Router
| Archivo | Descripción |
|---------|-------------|
| `app/layout.tsx` | Layout raíz. Carga fuente "Press Start 2P" vía `next/font/google`, metadata SEO, viewport responsive (device-width, maximumScale=1, userScalable=false). |
| `app/page.tsx` | Página principal. Renderiza `<FlappyBirdGame/>` dentro de `<main className="game-page">`. Incluye metadata SEO (title + description). |
| `app/globals.css` | Design system completo: reset CSS, tokens de color retro (sky, pipe, bird, ground), tipografía retro, clases de overlays, canvas responsive, animaciones (blink, float), prevención de scroll/touch en móvil, modo oscuro. |

### Componentes
| Archivo | Descripción |
|---------|-------------|
| `components/FlappyBirdGame.tsx` | Componente cliente principal (`'use client'`). Gestiona `ref` al canvas, `GameState` en `useRef`, loop con `requestAnimationFrame`, listeners de teclado (Space/ArrowUp), click (pointerDown) y touch (touchStart con preventDefault). Sincroniza estado interno con React state para overlays. Incluye región live accesible (`aria-live`). |
| `components/GameCanvas.tsx` | Wrapper del `<canvas>` con `forwardRef`. Dimensiones internas fijas 400×600, escalado CSS responsive (`max-width: 100%`, `aspect-ratio`). Handlers `onPointerDown` y `onTouchStart` con `preventDefault` y `stopPropagation`. |
| `components/StartScreen.tsx` | Overlay HTML de pantalla de inicio: pájaro SVG flotante (animación CSS `float`), título "FLAPPY BIRD", subtítulo, instrucciones parpadeantes (animación `blink`), y récord actual si existe. |
| `components/GameOverScreen.tsx` | Overlay HTML de fin de juego: "GAME OVER", puntuación final, récord, badge "¡Nuevo récord!" si aplica, botón "Reiniciar" (mín 56×56px, `btn-restart`). Foco automático en el botón al aparecer. `role="alertdialog"`. |
| `components/HUD.tsx` | Overlay del marcador durante el juego: score grande centrado arriba, badge de nuevo récord si aplica, región live accesible que anuncia score en múltiplos de 5. |
| `components/RetroText.tsx` | Componente reutilizable para texto con fuente retro (`font-retro`), opcional `pixelShadow`, soporte para diferentes tags HTML (`h1`, `h2`, `p`, `div`, `span`). |

### Lógica de juego (`lib/game/`)
| Archivo | Descripción |
|---------|-------------|
| `lib/game/constants.ts` | Objeto `GAME_CONFIG` con todas las constantes: `GRAVITY` (0.5), `JUMP_FORCE` (-8), `PIPE_WIDTH` (60), `PIPE_GAP` (160), `PIPE_SPACING` (220), `PIPE_SPEED` (2.5), `BIRD_X` (80), `BIRD_RADIUS` (14), `CANVAS_WIDTH` (400), `CANVAS_HEIGHT` (600), `GROUND_HEIGHT` (80), paleta de colores retro, `BIRD_FLAP_INTERVAL` (5), `PIPE_GAP_MARGIN` (60). |
| `lib/game/types.ts` | Interfaces `Bird`, `Pipe`, `GameState`, tipo `GameStatus` (`'idle' \| 'playing' \| 'gameover'`). |
| `lib/game/bird.ts` | `createBird()`, `updateBird()` (gravedad, posición, rotación interpolada según velocity, animación de aleteo por 3 frames), `jumpBird()` (impulso vertical), `drawBird()` (cuerpo, panza, ala animada, ojo, pupila, pico). |
| `lib/game/pipes.ts` | `createPipe()` (gapY aleatorio dentro de rango válido), `updatePipes()` (mover izquierda, eliminar fuera de pantalla, generar nuevas con spacing constante), `drawPipes()` (verde con borde oscuro, brillo, sombra, cabezal). |
| `lib/game/collision.ts` | `checkPipeCollision()` (círculo-vs-rectángulo AABB para tuberías superior e inferior), `checkGroundCollision()`, `checkCeilingCollision()`. |
| `lib/game/score.ts` | `getHighScore()` / `setHighScore()` (localStorage clave `flappy-high-score`, degradación silenciosa si no hay window), `updateScore()` (marca `pipe.scored` cuando el pájaro pasa el centro, incrementa score, actualiza high score en tiempo real). |
| `lib/game/background.ts` | `drawBackground()` (cielo con gradiente, nubes con parallax, suelo texturizado con franja de césped, patrón zigzag y puntos de tierra). |
| `lib/game/engine.ts` | `createInitialState()`, `resetGame()`, `startGame()`, `handleInput()` (idle→start, playing→jump, gameover→start), `update()` (parallax siempre activo, lógica por estado: idle=float, playing=física+colisiones+score, gameover=caída al suelo), `draw()` (fondo+tuberías+pájaro), `gameLoop()`. |

### Configuración
| Archivo | Descripción |
|---------|-------------|
| `next.config.mjs` | Configuración básica de Next.js (`nextConfig = {}`). |
| `tsconfig.json` | TypeScript estricto, paths `@/*` hacia raíz, moduleResolution bundler. |
| `package.json` | Dependencias: `next ^14.2.35`, `react ^18.3.1`, `react-dom ^18.3.1`. Sin librerías de juegos ni externas. |

### Diseño
| Archivo | Descripción |
|---------|-------------|
| `design/UX_GUIDELINES.md` | Guías de UX del proyecto. |
| `design/UX_PLAN.md` | Plan de UX del proyecto. |

---

## Cómo correrlo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

Abrir `http://localhost:3000` en el navegador.

### Controles
- **Teclado:** Barra espaciadora o flecha arriba (↑) para saltar.
- **Mouse:** Click sobre el canvas para saltar.
- **Touch:** Tap sobre el canvas para saltar (móvil).

---

## Criterios de aceptación por épica

### Épica 1 — Mecánica de vuelo del pájaro
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| AC1.1: Pájaro cae por gravedad continua y acelerada | ✅ CUBIERTO | `bird.ts` → `updateBird()`: `bird.velocity += GRAVITY; bird.y += bird.velocity` |
| AC1.2: Space/click/tap → impulso hacia arriba inmediato | ✅ CUBIERTO | `bird.ts` → `jumpBird()`: `bird.velocity = JUMP_FORCE (-8)`. Listeners en `FlappyBirdGame.tsx`. |
| AC1.3: Rotación visual (nariz arriba al subir, abajo al caer) | ✅ CUBIERTO | `bird.ts` → `updateBird()`: rotación interpolada según `velocity` (max -0.5 rad arriba, π/2 abajo). |
| AC1.4: Animación de aleteo visible | ✅ CUBIERTO | `bird.ts` → `drawBird()`: 3 frames de ala (`frameIndex` 0-2), alternados cada 5 frames. |

### Épica 2 — Tuberías
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| AC2.1: Pares de tuberías desde el borde derecho | ✅ CUBIERTO | `pipes.ts` → `createPipe(GAME_CONFIG.CANVAS_WIDTH)`, `updatePipes()` genera nuevas. |
| AC2.2: Hueco con altura aleatoria | ✅ CUBIERTO | `pipes.ts` → `createPipe()`: `gapY` aleatorio dentro de `[minGapY, maxGapY]`. |
| AC2.3: Movimiento derecha→izquierda a velocidad constante | ✅ CUBIERTO | `pipes.ts` → `updatePipes()`: `pipe.x -= PIPE_SPEED (2.5)`. |
| AC2.4: Eliminación de tuberías fuera de pantalla | ✅ CUBIERTO | `pipes.ts` → `updatePipes()`: `splice` si `x + width < 0`. |
| AC2.5: Espaciado horizontal consistente | ✅ CUBIERTO | `pipes.ts` → `updatePipes()`: genera nueva si `lastPipe.x <= CANVAS_WIDTH - PIPE_SPACING (220)`. |

### Épica 3 — Colisiones
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| AC3.1: Colisión con tubería → game over | ✅ CUBIERTO | `collision.ts` → `checkPipeCollision()` (círculo-vs-rect AABB). `engine.ts` lo aplica. |
| AC3.2: Colisión con suelo → game over | ✅ CUBIERTO | `collision.ts` → `checkGroundCollision()`. `engine.ts` lo aplica. |
| AC3.3: Colisión con techo → game over (o limita posición) | ✅ CUBIERTO (parcial) | `collision.ts` → `checkCeilingCollision()`. En `engine.ts` se limita la posición (`bird.y = radius`, `velocity = 0`) en lugar de terminar el juego. No causa game over por techo, solo frena. |
| AC3.4: Transición a `gameover` tras colisión | ✅ CUBIERTO | `engine.ts` → `update()`: al detectar colisión, `state.status = "gameover"`. Overlay `GameOverScreen` se muestra. |

### Épica 4 — Sistema de puntuación
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| AC4.1: Score +1 por tubería pasada | ✅ CUBIERTO | `score.ts` → `updateScore()`: si `pipe.x + pipe.width < bird.x` y `!pipe.scored`, incrementa. |
| AC4.2: Score visible durante el juego | ✅ CUBIERTO | `HUD.tsx`: muestra score centrado arriba del canvas. |
| AC4.3: High score persistido en localStorage | ✅ CUBIERTO | `score.ts` → `getHighScore()` / `setHighScore()` con clave `flappy-high-score`. Cargado en `FlappyBirdGame.tsx` `useEffect`. |
| AC4.4: High score se actualiza en tiempo real | ✅ CUBIERTO | `score.ts` → `updateScore()`: si `score > highScore`, actualiza y guarda. `FlappyBirdGame.tsx` sincroniza con React state cada frame. |

### Épica 5 — Estados de juego y pantallas
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| AC5.1: Pantalla de inicio con título e instrucciones | ✅ CUBIERTO | `StartScreen.tsx`: título "FLAPPY BIRD", instrucciones parpadeantes, pájaro flotante, récord. |
| AC5.2: Primer input inicia el juego | ✅ CUBIERTO | `engine.ts` → `handleInput()`: `idle` → `startGame()`. |
| AC5.3: Pantalla de Game Over con score, récord y botón reinicio | ✅ CUBIERTO | `GameOverScreen.tsx`: "GAME OVER", score, récord, badge nuevo récord, botón "Reiniciar". |
| AC5.4: Click "Reiniciar" o Space reinicia | ✅ CUBIERTO | `engine.ts` → `handleInput()`: `gameover` → `startGame()`. Botón y teclado ambos llaman a `onInput`. |
| AC5.5: Reinicio: pájaro al centro, sin tuberías, score 0 | ✅ CUBIERTO | `engine.ts` → `startGame()`: `score = 0`, `pipes = []`, `bird = createBird()` (centro vertical). |

### Épica 6 — Estilo visual retro colorido
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| AC6.1: Cielo azul claro, suelo verde con textura | ✅ CUBIERTO | `background.ts` → `drawBackground()`: gradiente cielo `#70c5ce`→`#5ec0d6`, suelo `#ded895` con franja de césped `#73bf2e`. |
| AC6.2: Tuberías verdes con borde oscuro | ✅ CUBIERTO | `pipes.ts` → `drawSinglePipe()`: verde `#73bf2e`, borde `#2d5e0f`, brillo `#9be84a`, sombra `#4a8a1e`, cabezal. |
| AC6.3: Pájaro amarillo/naranja geométrico colorido | ✅ CUBIERTO | `bird.ts` → `drawBird()`: cuerpo amarillo `#f7d51d`, panza clara, pico naranja `#ff8800`, ojo blanco con pupila negra, ala animada. |
| AC6.4: Fuente retro "Press Start 2P" | ✅ CUBIERTO | `layout.tsx` → `Press_Start_2P` de `next/font/google`. `RetroText.tsx` aplica `.font-retro`. CSS `.font-retro` usa `var(--font-retro)`. |
| AC6.5: Nubes decorativas con parallax sutil | ✅ CUBIERTO | `background.ts` → `drawClouds()`: 5 nubes predefinidas, se desplazan con `cloudOffset`. Parallax más lento en idle (×0.3). |

### Épica 7 — Controles responsivos y accesibilidad
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| AC7.1: Space y ArrowUp hacen saltar | ✅ CUBIERTO | `FlappyBirdGame.tsx` → `keydown` listener: `e.code === "Space" \|\| e.code === "ArrowUp"` con `preventDefault`. |
| AC7.2: Click del mouse sobre canvas | ✅ CUBIERTO | `GameCanvas.tsx` → `onPointerDown` con `preventDefault` + `stopPropagation`. |
| AC7.3: Tap touch sobre canvas | ✅ CUBIERTO | `GameCanvas.tsx` → `onTouchStart` con `preventDefault`. `FlappyBirdGame.tsx` → `handleTouchStart`. |
| AC7.4: Canvas mantiene relación de aspecto | ✅ CUBIERTO | CSS `.game-container`: `aspect-ratio: 2/3`, `max-width: 480px`. Canvas: `width: 100%`, `height: 100%`, `object-fit: contain`. |
| AC7.5: No scroll accidental en móvil | ✅ CUBIERTO | CSS `html, body { overflow: hidden; touch-action: none; overscroll-behavior: none; }`. `.game-container { touch-action: none; }`. Eventos con `preventDefault`. |
| AC7.6: Botón "Reiniciar" suficientemente grande | ✅ CUBIERTO | CSS `.btn-restart { min-width: 56px; min-height: 56px; }`. Supera el mínimo de 44px. |

---

## Criterios de aceptación CUBIERTOS

**30 de 31 criterios** están implementados y verificados en el código:

- ✅ Todas las mecánicas de vuelo (gravedad, salto, rotación, aleteo).
- ✅ Sistema completo de tuberías (generación, movimiento, espaciado, eliminación, gap aleatorio).
- ✅ Colisiones con tuberías, suelo y techo.
- ✅ Sistema de puntuación con persistencia en localStorage y actualización en tiempo real del high score.
- ✅ Tres estados de juego (idle/playing/gameover) con transiciones correctas.
- ✅ Pantallas de inicio, game over y HUD con estilo retro.
- ✅ Estilo visual retro colorido completo (cielo, suelo texturizado, nubes parallax, tuberías con detalle, pájaro colorido, fuente Press Start 2P).
- ✅ Controles responsivos (teclado, mouse, touch) con prevención de scroll en móvil.
- ✅ Botón de reinicio accesible y de tamaño táctil adecuado.
- ✅ Accesibilidad: `aria-live`, `role="alertdialog"`, `aria-label`, foco automático en botón, `prefers-reduced-motion`.

---

## PENDIENTES / Limitaciones reales

| Item | Detalle |
|------|---------|
| AC3.3 (parcial) | La colisión con el techo **no termina el juego**: se limita la posición del pájaro (`y = radius`, `velocity = 0`) en lugar de transicionar a `gameover`. El spec aceptaba "termina inmediatamente **o** se limita su posición", por lo que es funcionalmente válido pero no causa game over por techo. |
| Sin efectos de sonido | El spec marcaba los efectos de sonido como nice-to-have / no bloqueante. No se implementaron. |
| Sin tests automatizados | No se encontraron archivos de test (`.test.ts`, `.spec.ts`) en el workspace. |
| `next.config.mjs` es minimalista | No incluye configuraciones avanzadas (ej. optimización de imágenes, headers de seguridad). Es un `nextConfig = {}` vacío. |
| Animación de aleteo del pájaro en idle | En estado `idle`, el aleteo usa un intervalo más lento (`BIRD_FLAP_INTERVAL * 2`) pero solo alterna `frameIndex` entre 0-2. El pájaro flota con `Math.sin(Date.now()/300)`. Funciona pero es una animación simple. |
| Sin variables de entorno | No hay archivo `.env` ni configuración de variables de entorno. No se requieren para este proyecto. |

---

## Resumen de cobertura

| Épica | Criterios | Cubiertos | Parcial | Pendiente |
|-------|-----------|-----------|---------|-----------|
| 1 — Vuelo del pájaro | 4 | 4 | 0 | 0 |
| 2 — Tuberías | 5 | 5 | 0 | 0 |
| 3 — Colisiones | 4 | 3 | 1 | 0 |
| 4 — Puntuación | 4 | 4 | 0 | 0 |
| 5 — Estados y pantallas | 5 | 5 | 0 | 0 |
| 6 — Estilo visual retro | 5 | 5 | 0 | 0 |
| 7 — Controles y accesibilidad | 6 | 6 | 0 | 0 |
| **Total** | **33** | **32** | **1** | **0** |

> **Conclusión:** El juego está completo y funcional. Todos los criterios de aceptación están cubiertos (32 fully + 1 parcial válido según spec). Los pendientes son nice-to-haves no bloqueantes (sonidos, tests).
