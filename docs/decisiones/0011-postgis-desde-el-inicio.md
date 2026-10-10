# 0011 — PostgreSQL con PostGIS desde el inicio

Aceptada · 2026-09-08

## Contexto

Postgres no entiende de lugares: una ciclovía guardada como texto no está «cerca» de nada. PostGIS
le agrega tipos geográficos y funciones `ST_` (0007). La pregunta era si la base guarda geometrías
o solo metadatos.

## Decisión

PostgreSQL con PostGIS desde el primer día, aunque el MVP use poco.

Adoptarlo hoy es cambiar la imagen del compose y crear la extensión una vez. Adoptarlo después es
migrar datos y reescribir consultas. La opción que escala no cobra nada por adelantado.

Lo que habilita: índices espaciales y cruces de geometrías, como cuántos kilómetros de un recorrido
fueron sobre ciclovía.

## Se paga

- La plantilla de Postgres de Dokploy no trae PostGIS: la base va en el compose y pierde los
  backups de la interfaz (0009, 0017).
- Las migraciones con PostGIS se revisan a mano (0007).

## Descartado

- **Geometrías en `jsonb` y cálculos en TypeScript.** Sin índice, cada consulta espacial recorre
  todo.
- **Solo metadatos.** El API no podría responder nada espacial por su cuenta.
- **SpatiaLite.** Ya hay un VPS con Docker, y tiene menos rodaje y peor soporte en Drizzle.
