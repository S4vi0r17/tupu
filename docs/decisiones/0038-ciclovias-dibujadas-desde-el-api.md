# 0038 — Las ciclovías se dibujan desde el API

**Estado:** Aceptada · 2026-09-09 · **sustituye** a [0026](0026-ciclovias-dibujadas-desde-el-tile.md)
**Sustituida en parte** por [0041](0041-red-ciclista-en-una-sola-peticion.md): la red se pide
entera, no por recuadro.

## Contexto

[0026](0026-ciclovias-dibujadas-desde-el-tile.md) decidió dibujar las ciclovías estilando el tile,
y dejó como disparador «cuando haga falta resaltar un tramo concreto». El disparador real resultó
otro y bastante más grave: **el tile no muestra la red.**

Se vio comparando la app contra el prototipo de Leaflet que originó el proyecto, que consulta
OpenStreetMap en vivo. Los números, medidos sobre el Centro de Lima:

| | Tramos |
|---|---|
| Lo que trae el tile | 4 vías propias y 1 `designated` |
| Lo que tiene PostGIS en la misma zona | 128: 77 vía propia, 26 carril, 25 compartida |

Tres causas, y ninguna se arregla estilando mejor:

1. **El esquema OpenMapTiles no transporta `cycleway=lane`.** Un carril pintado es, para el tile,
   una calle común. En Lima eso es un tercio de la red.
2. **Casi no trae `bicycle=designated`.** Las compartidas existen en OSM y en nuestra base, pero
   el tile no las marca, así que no había forma de pintarlas.
3. **Debajo de z13 el tile descarta las ciclovías enteras.** No se ven finas: no están.

## Decisión

La red ciclista se pide al API y se dibuja como GeoJSON. El tile queda **solo como mapa base**.

```
GET /v1/cycleways/in-bbox?west&south&east&north
  → FeatureCollection de LineString con { osmId, kind, name }
```

El móvil pide el área visible, ajustada hacia afuera a una cuadrícula de 0,02 grados, y
TanStack Query cachea por esa clave. Mover un poco el mapa no vuelve a pedir.

Las tres formas se dibujan distinto porque no protegen igual: **vía propia** en verde continuo con
halo, **carril pintado** en verde punteado, **compartida con autos** en ámbar punteado y fina.

## Consecuencias

**A favor**

- Se ve la red completa, con sus tres tipos distinguidos. Antes el Centro aparecía casi vacío.
- **La tabla de PostGIS por fin se usa.** Hasta ahora la ingesta de OSM no alimentaba ninguna
  pantalla: era infraestructura sin consumidor.
- Deja de depender del esquema de un tercero para decidir qué es infraestructura ciclista. El
  criterio vive en `ingest.ts`, que es donde se puede discutir.
- Habilita cosas que el tile no permitía: resaltar el tramo de una ruta, o mostrar la superficie.

**En contra**

- **Se pagan peticiones al mover el mapa**, que es exactamente lo que
  [0026](0026-ciclovias-dibujadas-desde-el-tile.md) quería evitar. La cuadrícula y la caché lo
  amortiguan, pero el costo existe y se siente con señal mala.
- **Sin API no hay ciclovías.** El mapa base sigue funcionando, así que la app no queda en blanco,
  pero pierde lo que la hace útil. Refuerza el disparador de
  [0030](0030-sin-limite-de-uso-en-el-api.md): ahora el API es camino crítico de la pantalla
  principal, no solo del ruteo.
- Unos 33 KB por vista en el Centro. Poco, pero no cero, y sube en zonas más densas.
- El uso sin señal ([0016](0016-tiles-openfreemap-en-el-mvp.md)) se complica: además de los tiles
  habría que guardar la red.

## Alternativas descartadas

- **Seguir con el tile** — cero peticiones y era lo decidido. Se descartó por los números de
  arriba: mostraba 4 de 128 tramos. No es una diferencia de estilo, es que la app no cumplía lo
  que promete.
- **Self-host de tiles con esquema propio**, que ya está aplazado en
  [0016](0016-tiles-openfreemap-en-el-mvp.md) — resolvería las tres causas y no pagaría peticiones.
  Se descartó por desproporción: montar y reconstruir un servidor de tiles para 2300 tramos, cuando
  la respuesta del API pesa 33 KB, es mucha máquina para poco dato.
- **Un endpoint que devuelva la red entera de una vez** y cachearla en el teléfono — menos
  peticiones todavía. Se aplaza, no se descarta: es la evolución natural si mover el mapa resulta
  molesto, y encaja con el uso sin señal.
