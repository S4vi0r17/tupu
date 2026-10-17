---
name: new-decision
description: Escribe una decisión de tupu en docs/decisions, con su formato, índice y reemplazos. Usar cuando se elige entre alternativas que alguien podría volver a discutir, o se cambia algo ya decidido.
argument-hint: <qué se decide>
---

Escribe la decisión `$ARGUMENTS` siguiendo «Decisiones» en `docs/conventions/docs.md`.

1. Lee las decisiones que toca, desde `docs/decisions/README.md`.
2. Si la elección es del usuario, explícale primero qué problema de tupu resuelve, con el ejemplo
   real, y las opciones con lo que se paga cada una. Escribe después de su respuesta.
3. Número siguiente al último, nombre en inglés con guiones, el formato de `docs.md`. Que entre
   en una pantalla.
4. Si reemplaza a otra, márcalo en las dos y en la columna «Cambios» del índice.
5. La fila en `docs/decisions/README.md` y lo que la decisión cambia: `roadmap.md`, `stack.md`,
   `architecture.md`.
