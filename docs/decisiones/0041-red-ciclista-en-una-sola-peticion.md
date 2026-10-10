# 0041 — La red ciclista se pide entera, una vez

Aceptada · 2026-10-10 · Reemplaza en parte a 0038: se sigue dibujando desde el API, cambia cómo
se pide

## Contexto

Con `in-bbox`, cada vez que el mapa cruzaba una celda de la cuadrícula salía una petición nueva,
y mientras llegaba las ciclovías desaparecían. Con la cámara siguiendo al ciclista, eso pasaba
pedaleando.

La red entera de Perú son 2338 tramos: 539 KB de GeoJSON, 84 KB con gzip. No hay nada que
recortar por área.

## Decisión

```
GET /v1/cycleways  →  FeatureCollection con toda la red
```

El móvil la pide una vez por sesión. El API responde comprimido. `in-bbox` y `nearby` se borran:
el primero queda sin uso y el segundo nunca lo tuvo.

## Se paga

- El primer dibujo espera 84 KB en vez de un recuadro.
- No escala al mundo. Cuando la red pase de unos pocos MB, vuelve el recorte por área, y
  conviene que sea con tiles vectoriales y no volviendo a `in-bbox`.
- El índice espacial de PostGIS queda sin consulta que lo use. Se mantiene: es barato y lo van a
  usar los recorridos.
