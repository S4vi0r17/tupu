# 0012 — La red ciclista se ingiere de un extracto de OSM, a mano

Aceptada · 2026-09-08

## Contexto

Las ciclovías de Lima están en OpenStreetMap, y no hay otra fuente libre y completa. Se pueden
consultar en vivo con Overpass, o bajar un extracto: Geofabrik publica a diario el `.pbf` de Perú.
Valhalla ya necesita ese archivo para su grafo (0006).

## Decisión

Un script que se corre a mano:

1. Baja el extracto de Perú, el mismo que usa Valhalla.
2. Filtra la infraestructura ciclista con `osmium tags-filter`.
3. La carga con `ogr2ogr` y reemplaza la tabla en una transacción.

La infraestructura ciclista se etiqueta de varias formas: `highway=cycleway`, `cycleway=lane` o
`track` sobre la calle (también por lado), y `bicycle=designated`. Quedarse con la primera pierde
buena parte de la red.

El cron queda aplazado: es el mismo script corriendo solo, y se agrega cuando correrlo a mano
moleste.

## Se paga

- Los datos envejecen hasta que alguien corre el script. Una ciclovía nueva no aparece sola.
- Un paso manual que se olvida.
- Hace falta `osmium` y `ogr2ogr`: van en un contenedor propio.

## Descartado

- **Overpass en vivo.** Lo que usaba el prototipo: servidores públicos saturados, sin uso sin señal
  y sin índices propios.
- **Overpass una vez, a mano.** El mismo script contra una fuente peor.
- **`osm2pgsql` con el extracto completo.** Base mucho más pesada para consultas que no existen.
- **Cron desde el inicio.** Una ingesta rota entraría sin que nadie mire.
