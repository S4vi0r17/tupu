# 0007 — Drizzle para el acceso a datos

Aceptada · 2026-09-08

## Contexto

Lo interesante de esta app es geoespacial: casi toda consulta usa funciones `ST_` de PostGIS
(`ST_DWithin`, `ST_Length`, `ST_MakeLine`). La herramienta se elige por cómo trata eso, no por el
CRUD de usuarios.

## Decisión

Drizzle sobre PostgreSQL con PostGIS. Lo espacial vive dentro del mismo constructor y del mismo
sistema de tipos:

```ts
const track = sql`ST_GeomFromGeoJSON(${json})`
await db.insert(rides).values({
  userId, startedAt, endedAt, track,
  distanceM: sql`ST_Length(${track}::geography)`,
})
```

`${cycleways.geom}` es una referencia: renombrar la columna rompe también las consultas con `ST_`.

## Se paga

- Drizzle no crea la extensión: `create extension postgis` va en una migración escrita a mano.
- Sin `extensionsFilters: ['postgis']`, `drizzle-kit push` propone borrar las tablas internas de
  PostGIS. `push` queda prohibido fuera de bases desechables.
- Su tipo `geometry` solo entiende puntos: las líneas se declaran con `customType`.
- Documentación floja y roturas entre versiones menores: se fija la versión.

## Descartado

- **Prisma.** El mejor CRUD, pero lee las columnas geométricas incompletas (`Unsupported` las
  saca del tipo) y obliga a escribirlas siempre con SQL crudo. La mitad sin tipos sería el centro
  de la app. Además necesita una shadow database.
- **SQL con postgres.js.** Lo mejor para las consultas espaciales, desproporcionado para el resto,
  y cada refactor de columna sería una búsqueda de texto.
