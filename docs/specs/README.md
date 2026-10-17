# Specs

Lo que la app garantiza, regla por regla. Se escribe antes que el código (0043); el proceso está
en [`process.md`](process.md) y el formato en [`template.md`](template.md).

## IDs

`SPEC-<AREA>-<NN>`, por ejemplo `SPEC-ROUTE-03`. Un ID no se reutiliza ni se renumera.

| Archivo | Área | Qué cubre |
|---|---|---|
| [`route.md`](route.md) | `ROUTE` | Inicio y destino, el API de ruteo y lo que ve el usuario |
| [`cycleways.md`](cycleways.md) | `CYCLE` | Clases de la red, ingesta y cómo viaja |
| [`compass.md`](compass.md) | `COMPASS` | El cono y los avisos de la brújula |
| [`camera.md`](camera.md) | `CAMERA` | Los tres modos y cuándo se mueve |
| [`traceability.md`](traceability.md) | | Spec → código → verificación |

Las áreas que vienen, con su pieza del MVP (0040): `VOICE`, `RIDE` (grabación), `SPEED`
(velocímetro), `AWAKE` (pantalla encendida).
