# Spec — Flappy Bird Web Game

## 1. Objetivo y Alcance

### Objetivo
Construir un juego web jugable de Flappy Bird usando Next.js (App Router) + TypeScript con renderizado en Canvas HTML5. El jugador controla un pájaro afectado por gravedad que debe esquivar tuberías verdes para sumar puntos, con persistencia del high score en `localStorage`.

### Dentro del alcance
- Loop de juego con gravedad y salto (click / barra espaciadora / tap touch).
- Generación procedural de tuberías verdes con huecos a alturas aleatorias.
- Detección de colisiones con tuberías, suelo y techo.
- Sistema de puntuación (score actual + high score persistente).
- Estados de juego: `idle` (pantalla de inicio), `playing`, `gameover`.
- Pantalla de Game Over con botón de reinicio.
- Estilo retro colorido (paleta de 8-bit, pixel art, tipografía retro).
- Controles responsivos: teclado (Space/Click) y touch (tap).
- Diseño responsive que funcione en desktop y móvil.

### Fuera de alcance
- Backend / base de datos / autenticación.
- Multijugador o ranking online.
- Tienda de skins o microtransacciones.
- Efectos de sonido (opcional / nice-to-have, no bloqueante).
- Servidor: toda la lógica corre en el cliente.

---

## 2. Épicas y Funcionalidades

### Épica 1 — Mecánica de vuelo del pájaro
- **F1.1** Pájaro con física de gravedad: velocidad vertical que aumenta con el tiempo.
- **F1.2** Salto/aleteo: al presionar Space, hacer click o tap, el pájaro recibe un impulso vertical negativo (hacia arriba).
- **F1.3** Rotación visual del pájaro según velocidad vertical (boca arriba al subir, boca abajo al caer).
- **F1.4** Animación de aleteo (frames alternados).

### Épica 2 — Tuberías (obstáculos)
- **F2.1** Generación de pares de tuberías (superior e inferior) que aparecen desde el borde derecho.
- **F2.2** Hueco (gap) entre tuberías con altura aleatoria dentro de un rango válido.
- **F2.3** Movimiento de tuberías de derecha a izquierda a velocidad constante.
- **F2.4** Eliminación de tuberías que salen completamente por la izquierda.
- **F2.5** Espaciado horizontal constante entre pares de tuberías.

### Épica 3 — Colisiones
- **F3.1** Detección de colisión AABB o circular entre el pájaro y cada tubería visible.
- **F3.2** Detección de colisión con el suelo (parte inferior del canvas).
- **F3.3** Detección de colisión con el techo (parte superior del canvas).
- **F3.4** Al detectar cualquier colisión → transición a estado `gameover`.

### Épica 4 — Sistema de puntuación
- **F4.1** El score incrementa en +1 cuando el pájaro pasa completamente el centro x de un par de tuberías.
- **F4.2** Score visible en pantalla durante el juego (esquina superior).
- **F4.3** High score persistido en `localStorage` bajo la clave `flappy-high-score`.
- **F4.4** Al superar el high score durante la partida, se actualiza en tiempo real.

### Épica 5 — Estados de juego y pantallas
- **F5.1** Pantalla de inicio (idle): muestra título, instrucciones ("Click o Space para volar") y pájaro flotando.
- **F5.2** Transición `idle → playing` al primer input del usuario.
- **F5.3** Pantalla de Game Over: muestra "Game Over", score final, high score, y botón "Reiniciar".
- **F5.4** Transición `gameover → playing` al presionar botón Reiniciar o Space/click.
- **F5.5** Reinicio completo: pájaro al centro, sin tuberías, score a 0.

### Épica 6 — Estilo visual retro colorido
- **F6.1** Paleta de colores retro: cielo azul claro, césped verde, tuberías verdes con borde oscuro, pájaro amarillo/naranja.
- **F6.2** Suelo texturizado (patrón de césped repetitivo).
- **F6.3** Nubes decorativas en el fondo con parallax lento.
- **F6.4** Tipografía retro / pixel (Google Font "Press Start 2P" o similar).
- **F6.5** Animación de parpadeo en textos de instrucciones.

### Épica 7 — Controles responsivos y accesibilidad
- **F7.1** Teclado: barra espaciadora y tecla ArrowUp disparan el salto.
- **F7.2** Mouse: click en el canvas dispara el salto.
- **F7.3** Touch: tap en el canvas dispara el salto.
- **F7.4** Canvas escalable que mantiene relación de aspecto y se adapta al viewport.
- **F7.5** Prevención de scroll/touch default en móvil al jugar.
- **F7.6** Botón grande de "Reiniciar" tocable en móvil en pantalla de Game Over.

---

## 3. Modelo de Datos

### Entidad: `Bird`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `x` | `number` | Posición horizontal fija (centro del canvas) |
| `y` | `number` | Posición vertical actual |
| `velocity` | `number` | Velocidad vertical actual (px/seg) |
| `radius` | `number` | Radio para colisión circular |
| `rotation` | `number` | Ángulo de rotación en radianes |
| `frameIndex` | `number` | Frame actual de animación de aleteo |

### Entidad: `Pipe`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `x` | `number` | Posición horizontal (se mueve hacia la izquierda) |
| `gapY` | `number` | Posición Y del centro del hueco |
| `gapHeight` | `number` | Altura del hueco entre tubería superior e inferior |
| `width` | `number` | Ancho de la tubería |
| `scored` | `boolean` | `true` si el pájaro ya pasó esta tubería (para evitar contar 2x) |

### Entidad: `GameState`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `status` | `'idle' \| 'playing' \| 'gameover'` | Estado actual del juego |
| `score` | `number` | Puntuación actual |
| `highScore` | `number` | Mejor puntuación (persistida) |
| `bird` | `Bird` | Instancia del pájaro |
| `pipes` | `Pipe[]` | Lista de tuberías activas |

### Constantes de configuración (`GAME_CONFIG`)
| Campo | Tipo | Valor sugerido | Descripción |
|-------|------|---------------|-------------|
| `GRAVITY` | `number` | `0.5` | Aceleración hacia abajo por frame |
| `JUMP_FORCE` | `number` | `-8` | Impulso vertical al saltar |
| `PIPE_WIDTH` | `number` | `60` | Ancho de tuberías |
| `PIPE_GAP` | `number` | `160` | Hueco vertical entre tuberías |
| `PIPE_SPACING` | `number` | `220` | Espacio horizontal entre pares de tuberías |
| `PIPE_SPEED` | `number` | `2.5` | Velocidad de desplazamiento de tuberías |
| `BIRD_X` | `number` | `80` | Posición fija del pájaro en X |
| `BIRD_RADIUS` | `number` | `14` | Radio del pájaro |

### Relaciones
- `GameState` contiene exactamente **1** `Bird` y **0..N** `Pipe`.
- No hay persistencia de datos de partida: solo `highScore` se guarda en `localStorage`.

---

## 4. Rutas / Páginas (App Router)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/page.tsx` | Página principal. Renderiza el componente `FlappyBirdGame`. Incluye metadata SEO. |
| `/` (layout) | `app/layout.tsx` | Layout raíz con carga de fuente retro ("Press Start 2P"). |

### Componentes UI (no rutas, pero parte de la UI)
| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `FlappyBirdGame` | `components/FlappyBirdGame.tsx` | Componente cliente principal. Gestiona el canvas, el loop de juego, los estados y los inputs. |
| `GameCanvas` | `components/GameCanvas.tsx` | Wrapper del `<canvas>` con handlers de eventos. (Opcional: puede integrarse en `FlappyBirdGame`). |
| `StartScreen` | `components/StartScreen.tsx` | Overlay HTML/CSS para pantalla de inicio (título + instrucciones). |
| `GameOverScreen` | `components/GameOverScreen.tsx` | Overlay HTML/CSS para Game Over (score, high score, botón reiniciar). |
| `HUD` | `components/HUD.tsx` | Overlay HTML/CSS con el score actual durante el juego. |

> **Nota de arquitectura:** El renderizado del juego (pájaro, tuberías, fondo) se hace **dentro del canvas**. Las pantallas de inicio, game over y HUD pueden ser overlays HTML/CSS posicionados encima del canvas para mejor accesibilidad y estilizado.

---

## 5. Endpoints API

Este proyecto **no requiere endpoints API**. Toda la lógica del juego corre en el cliente (Canvas + `requestAnimationFrame`). El high score se persiste en `localStorage` del navegador.

> Si en el futuro se quisiera un ranking global, se añadirían rutas bajo `app/api/scores/`, pero están fuera de alcance.

---

## 6. Criterios de Aceptación por Épica

### Épica 1 — Mecánica de vuelo
- [ ] AC1.1: Al iniciar el juego, el pájaro cae por gravedad de forma continua y acelerada.
- [ ] AC1.2: Al presionar Space, hacer click o tap, el pájaro sube inmediatamente con un impulso hacia arriba.
- [ ] AC1.3: El pájaro rota visualmente: nariz hacia arriba cuando sube, nariz hacia abajo cuando cae.
- [ ] AC1.4: La animación de aleteo es visible durante el juego.

### Épica 2 — Tuberías
- [ ] AC2.1: Aparecen pares de tuberías (superior + inferior) desde el borde derecho del canvas.
- [ ] AC2.2: El hueco entre tuberías cambia de altura aleatoriamente en cada nuevo par.
- [ ] AC2.3: Las tuberías se mueven de derecha a izquierda a velocidad constante.
- [ ] AC2.4: Las tuberías que salen por la izquierda desaparecen y no se renderizan.
- [ ] AC2.5: La distancia horizontal entre pares de tuberías es consistente.

### Épica 3 — Colisiones
- [ ] AC3.1: Si el pájaro toca una tubería → el juego termina inmediatamente.
- [ ] AC3.2: Si el pájaro toca el suelo → el juego termina inmediatamente.
- [ ] AC3.3: Si el pájaro toca el techo → el juego termina inmediatamente (o se limita su posición).
- [ ] AC3.4: Tras colisión, el estado pasa a `gameover` y se muestra la pantalla correspondiente.

### Épica 4 — Sistema de puntuación
- [ ] AC4.1: El score aumenta en +1 por cada tubería que el pájaro pasa completamente.
- [ ] AC4.2: El score se muestra en pantalla durante el juego.
- [ ] AC4.3: El high score se guarda en `localStorage` y persiste tras recargar la página.
- [ ] AC4.4: Si durante la partida se supera el high score, este se actualiza en tiempo real.

### Épica 5 — Estados de juego y pantallas
- [ ] AC5.1: Al cargar la página, se muestra la pantalla de inicio con título e instrucciones.
- [ ] AC5.2: Al primer input (Space/click/tap), el juego inicia y las tuberías comienzan a aparecer.
- [ ] AC5.3: Al perder, se muestra "Game Over" con el score final, el high score y un botón de reinicio.
- [ ] AC5.4: Al hacer click en "Reiniciar" o presionar Space, el juego vuelve a empezar desde cero.
- [ ] AC5.5: Tras reiniciar, el pájaro está en el centro, no hay tuberías, y el score es 0.

### Épica 6 — Estilo visual retro colorido
- [ ] AC6.1: El fondo del cielo es azul claro; el suelo es verde con textura.
- [ ] AC6.2: Las tuberías son verdes con borde más oscuro (estilo retro).
- [ ] AC6.3: El pájaro es amarillo/naranja con estilo pixel-art o geométrico colorido.
- [ ] AC6.4: Se usa una fuente retro tipo "Press Start 2P" en score, título y mensajes.
- [ ] AC6.5: Hay nubes decorativas o elementos de fondo con parallax sutil.

### Épica 7 — Controles responsivos y accesibilidad
- [ ] AC7.1: La barra espaciadora y la flecha arriba hacen saltar al pájaro.
- [ ] AC7.2: El click del mouse sobre el canvas hace saltar al pájaro.
- [ ] AC7.3: El tap touch sobre el canvas hace saltar al pájaro en móvil.
- [ ] AC7.4: El canvas mantiene su relación de aspecto y se ve correctamente en desktop y móvil.
- [ ] AC7.5: En móvil, no se produce scroll accidental al jugar.
- [ ] AC7.6: El botón "Reiniciar" es suficientemente grande para tocar cómodamente en móvil.

---

## 7. Flujos de Usuario Críticos

### Rol: Jugador (único rol)

#### Flujo crítico #1 — Partida completa (camino feliz)
**Objetivo:** El jugador abre el juego, juega una partida, pierde y reinicia.

1. **Abrir el juego:** El usuario navega a `/`. Se carga la página con el canvas y la pantalla de inicio.
2. **Ver instrucciones:** Se muestra el título "Flappy Bird" y el texto "Presiona Space o haz click para volar". El pájaro flota suavemente en el centro.
3. **Iniciar partida:** El usuario presiona **Space** (o hace click / tap). El estado pasa a `playing`. Las tuberías comienzan a generarse desde la derecha.
4. **Volar:** El pájaro cae por gravedad. El usuario presiona repetidamente Space/click para mantenerlo en el aire y guiarlo entre los huecos de las tuberías.
5. **Sumar puntos:** Cada vez que el pájaro pasa entre un par de tuberías, el score (visible arriba) incrementa en +1.
6. **Colisionar:** El pájaro choca contra una tubería o cae al suelo. El estado pasa a `gameover`.
7. **Ver Game Over:** Aparece la pantalla de Game Over con el score final, el high score y un botón "Reiniciar".
8. **Reiniciar:** El usuario hace click en "Reiniciar" (o presiona Space). El juego vuelve al estado inicial con score 0 y el pájaro en el centro.

> **Criterio de aceptación del flujo central:** El usuario debe poder completar el ciclo completo **inicio → jugar → perder → reiniciar** usando solo Space/click, sin errores ni bloqueos. Si el pájaro no salta al input, o si las tuberías no aparecen, o si no se puede reiniciar, el juego se considera **no funcional**.

#### Flujo crítico #2 — Persistencia del high score
1. El jugador juega y obtiene un score de **N** puntos.
2. Al perder, si `N > highScore`, el high score se actualiza a **N** y se guarda en `localStorage`.
3. El jugador recarga la página (`F5`).
4. En la pantalla de Game Over (o inicio) el high score mostrado sigue siendo **N**.

#### Flujo crítico #3 — Juego en móvil (touch)
1. El usuario abre `/` desde un dispositivo móvil.
2. El canvas se ajusta al ancho de la pantalla manteniendo la relación de aspecto.
3. El usuario hace **tap** en la pantalla para iniciar el juego.
4. El usuario hace **tap** repetidamente para hacer saltar al pájaro.
5. No se produce scroll vertical accidental.
6. Al perder, el botón "Reiniciar" es tocable y del tamaño adecuado (mín. 44×44px).

---

## 8. Notas Técnicas

- **Framework:** Next.js 14+ con App Router, TypeScript estricto.
- **Renderizado:** Canvas 2D API dentro de un componente cliente (`'use client'`).
- **Loop de juego:** `requestAnimationFrame` con delta time para movimiento consistente.
- **Fuente:** "Press Start 2P" cargada vía `next/font/google` o `<link>` en el layout.
- **Persistencia:** `window.localStorage` con clave `flappy-high-score`, accedido solo en el cliente (guardar dentro de `useEffect`).
- **Detección de colisión:** Circular (centro del pájaro ± radio) vs. rectángulos de tuberías. Alternativa: AABB.
- **Responsive:** Canvas con dimensiones fijas internas (ej. 400×600) escalado via CSS `max-width: 100%` + `aspect-ratio`.
- **Sin dependencias externas:** Solo React + Next.js. No se requiere ninguna librería de juegos.
