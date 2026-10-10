# 0020 — Los datos de OSM se actualizan con un solo comando, a mano

Aceptada · 2026-09-08

## Contexto

El extracto de Perú alimenta dos cosas:

```
.pbf de Perú
   ├── filtrar ciclovías  →  PostGIS
   └── construir grafo    →  Valhalla
```

El grafo no se construye en cada despliegue (0009). Si las dos ramas se actualizan por separado,
el mapa puede mostrar una ciclovía que el motor no conoce.

## Decisión

`osm:update`, a mano en el VPS, hace las dos desde la misma descarga:

1. Baja el `.pbf` de Perú.
2. Carga las ciclovías en PostGIS, reemplazando en una transacción.
3. Construye el grafo en un directorio nuevo.
4. Cambia Valhalla al directorio nuevo.

Si algo falla a la mitad, siguen los datos anteriores. El cron, después, es el mismo comando.

## Se paga

- Durante la construcción el VPS lleva el pico de RAM y el doble de disco del grafo (medido en
  [infra](../../infra/README.md)).
- Un paso manual que se olvida, y que exige entrar al VPS.

## Descartado

- **Construir el grafo en local y subirlo.** Cientos de MB por una conexión doméstica, y las dos
  ramas por caminos distintos.
- **Cron mensual.** Aplazado: hoy fallaría de madrugada sin que nadie mire.
