# 0035 — Bun instala con enlazador plano

Reemplazada por 0037 · 2026-09-09

El diagnóstico era incorrecto: el problema era una línea de `metro.config.js`, no el enlazador.

## Contexto

Bun 1.4 instala aislado por defecto, como pnpm. Al construir el bundle, Metro no resolvió
`@expo/metro-runtime`, que `expo-router` usa sin declararlo, y detrás apareció `whatwg-fetch`.

## Decisión

Fijar `linker = "hoisted"` en `bunfig.toml`.

## Se paga

- Se pierde el aislamiento: el móvil vuelve a poder ver el cliente de Postgres, y solo Biome lo
  impide.
- El argumento con el que 0001 descartó pnpm queda dado vuelta.

## Descartado

- **Aislado, declarando cada transitiva que pida Metro.** No escala.
- **Aislado, con parches en la resolución de Metro.** Los errores de Metro son malos.
- **Pasar a pnpm.** Sin problema que resolver mientras Bun funcione.
