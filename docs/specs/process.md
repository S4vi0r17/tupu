# Proceso SDD

Cómo se cambia lo que la app hace, sea una persona o un agente. Ninguna regla llega al código sin
spec (0043).

## Orden

| Paso | Qué | Dónde |
|---|---|---|
| 1 | Leer la spec del área y `roadmap.md` | `docs/specs/<area>.md` |
| 2 | Escribir o corregir la regla: enunciado, origen, criterios numerados, verificación | con [`template.md`](template.md) |
| 3 | Implementar hasta cumplir cada criterio | `apps/`, `packages/` |
| 4 | Verificar cada criterio y anotar cómo y cuándo | sección «Verificación» de la regla |
| 5 | Anotar la fila en la trazabilidad | [`traceability.md`](traceability.md) |
| 6 | `bun run check` y commitear spec, código y docs juntos | [`workflow.md`](../conventions/workflow.md) |

Un cambio sin regla nueva cita la regla que respeta. Un refactor que no cambia comportamiento no
necesita regla, pero no puede romper los criterios de las que toca.

## Un buen criterio

- Entrada concreta y salida observable: `-77.0301, -12.1211` → destino en `-12.1211, -77.0301`.
- Los dos lados de cada límite: 2,9° no mueve la cámara, 3° sí.
- El código HTTP o el texto real que ve el usuario.
- Si no se puede verificar, no es un criterio.

## Verificación, sin tests (0024)

| Qué | Cómo |
|---|---|
| Función pura | `bun -e` con los valores del criterio |
| API | `curl` contra `bun run dev:api` |
| Pantalla | En el teléfono, con la build de desarrollo |
| GPS, brújula, voz | En la calle, con fecha |

Cuando haya tests, cada criterio se vuelve uno y la sección «Verificación» apunta al archivo.

## Para agentes

- Si la regla nueva contradice una vigente, parar y preguntar.
- Un ID no se reutiliza ni se renumera. Una regla retirada queda marcada `Derogada`.
- Lo que no se pudo verificar se dice en el informe y queda «sin verificar» en la spec.
