# 0022 — Mensajes de commit en inglés, con Conventional Commits

Aceptada · 2026-09-08 · Reemplaza en parte a 0003, que los ponía en español

## Contexto

El repo hermano `fulfillment-api` escribe los commits en inglés, con una convención en uso. Dos
criterios para lo mismo entre proyectos de la misma persona no aportan nada.

## Decisión

Conventional Commits en inglés. Las reglas, en
[`conventions/commits.md`](../conventions/commits.md). El resto de 0003 sigue: comentarios,
`docs/` y textos de la app en español.

`feat` y `fix` ya son inglés: un subject en español dejaba la línea partida en dos idiomas.

## Se paga

- La regla de 0003 deja de caber en una frase.
- El porqué de un cambio se escribe peor en un idioma que no es el que se piensa.

## Descartado

- **Español.** Coherente con este repo, pero el historial se lee saltando entre proyectos.
- **Subject en inglés y body en español.** Dos idiomas en un mismo commit.
