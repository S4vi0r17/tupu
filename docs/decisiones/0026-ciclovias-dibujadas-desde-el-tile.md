# 0026 — Las ciclovías se dibujan desde el tile

Sustituida por 0038 · 2026-09-08

El tile resultó no traer la red: 4 tramos donde PostGIS tiene 128.

## Contexto

Las líneas a resaltar podían salir de los tiles de OpenFreeMap, que ya se descargan, o del API
leyendo PostGIS.

## Decisión

Desde el tile, cambiando solo el estilo de sus capas ciclistas. Sin peticiones extra. A verificar
al empezar: que el tile distinga la infraestructura ciclista.

## Se paga

- Lo dibujado puede no coincidir con PostGIS ni con Valhalla: se actualizan en momentos distintos.
- No se puede resaltar una ciclovía concreta: las del tile no tienen identidad para el API.
- Cambiar de proveedor de tiles obliga a reescribir las capas.

## Descartado

- **Desde el API.** Coincide con lo que sabe el ruteo, pero cuesta peticiones al mover el mapa.
- **Las dos fuentes.** Dos fuentes que discrepan en la misma pantalla.
