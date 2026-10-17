# 0043 — Las reglas se escriben antes que el código, y se verifican a mano hasta que haya tests

Aceptada · 2026-10-16

## Contexto

Lo que la app garantiza vivía en prosa, repartido entre `architecture.md` y las decisiones. Un
ejemplo: que un par de coordenadas invertido se voltea solo estaba en un párrafo, no en un
criterio que alguien pudiera comprobar. Lo que viene, detectar que el ciclista se salió de la ruta
(0040), depende de umbrales que hay que fijar antes de escribirlo.

## Decisión

SDD: ninguna regla llega al código sin su spec en `docs/specs/`, con criterios numerados y
verificables. El proceso está en [`specs/process.md`](../specs/process.md).

Sin tests todavía (0024). Cada criterio dice cómo se verifica hoy: con `curl`, en el teléfono o
en la calle, con fecha. Cuando lleguen los tests, cada criterio se vuelve uno.

## Se paga

- Nada hace cumplir los criterios: un cambio puede romper uno sin que nadie lo note.
- Escribir la spec antes cuesta tiempo en lo que parece obvio.
- La verificación a mano se repite en cada cambio que toca la regla.

## Descartado

- **SDD con `bun test` en lo puro.** Lo más barato de testear, pero contradice 0024 antes de su
  disparador.
- **SDD con tests en todo.** 0024 ya lo descartó por desproporcionado para el MVP.
- **Seguir con prosa en `architecture.md`.** Describe cómo funciona, no qué se garantiza.
