# 0038 — Las ciclovías se dibujan desde el API

Aceptada · 2026-09-09 · Sustituye a 0026 · Sustituida en parte por 0041: la red se pide entera

## Contexto

0026 dibujaba las ciclovías estilando el tile. Comparado contra el prototipo, sobre el Centro de
Lima:

| | Tramos |
|---|---|
| Tile | 4 vías propias y 1 `designated` |
| PostGIS, misma zona | 128: 77 vía propia, 26 carril, 25 compartida |

- El esquema OpenMapTiles no transporta `cycleway=lane`: un carril pintado es una calle común. En
  Lima es un tercio de la red.
- Casi no trae `bicycle=designated`.
- Debajo de z13 el tile no trae ciclovías.

## Decisión

La red se pide al API y se dibuja como GeoJSON. El tile queda solo como mapa base.

```
GET /v1/cycleways/in-bbox?west&south&east&north
```

El móvil pide el área visible ajustada a una cuadrícula de 0,02° y cachea por esa clave.
(Sustituido por 0041.)

| Tipo | Dibujo |
|---|---|
| Vía propia | Verde continuo con halo |
| Carril pintado | Verde punteado |
| Compartida con autos | Ámbar punteado, fino |

## Se paga

- Peticiones al mover el mapa, lo que 0026 quería evitar.
- Sin API no hay ciclovías: el API pasa a ser camino crítico de la pantalla principal (0030).
- El uso sin señal tendrá que guardar también la red.

## Descartado

- **Seguir con el tile.** Mostraba 4 de 128 tramos.
- **Tiles propios con esquema propio.** Mucha máquina para 2300 tramos.
- **La red entera de una vez.** Aplazado. (Adoptado en 0041.)
