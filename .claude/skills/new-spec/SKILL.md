---
name: new-spec
description: Agrega o corrige una regla de tupu con SDD (spec, código, verificación y trazabilidad). Usar cuando se pida un comportamiento nuevo o cambiar uno existente.
argument-hint: <qué tiene que pasar, ej. "salirse 30 m de la ruta la recalcula">
---

Implementa `$ARGUMENTS` siguiendo `docs/specs/process.md`.

1. Busca la spec del área en `docs/specs/`; `README.md` tiene los IDs. Si la regla contradice
   una vigente o una decisión de `docs/decisions/`, para y pregunta.
2. Escribe la regla antes que el código, con `docs/specs/template.md`: ID nuevo, origen y
   criterios numerados y verificables.
3. Implementa. Reutiliza `packages/geo` antes de escribir matemática nueva.
4. Verifica cada criterio como dice `process.md` y anota cómo y cuándo. Lo que no se pudo, «sin
   verificar».
5. La fila en `docs/specs/traceability.md` y los docs que pide `docs/conventions/workflow.md`.
6. `bun run check` en verde. No commitees salvo que te lo pidan.
