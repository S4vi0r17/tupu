# 0011 — PostgreSQL con PostGIS desde el inicio

**Estado:** Aceptada · 2026-09-08

## Contexto

Postgres entiende de números, texto y fechas; **no entiende qué es un lugar en un mapa**. Una
ciclovía guardada como texto es, para él, una cadena de caracteres: preguntarle qué ciclovías
están cerca de un punto no tiene más sentido que preguntarle qué textos están cerca.

**PostGIS** es la extensión que le enseña geografía: añade tipos —punto, línea, polígono— y las
funciones `ST_*` para operarlos dentro de la consulta ([0007](0007-drizzle-para-acceso-a-datos.md)
las detalla).

La pregunta era si esta base guarda geometrías de verdad o solo metadatos. La consulta que decide
es la que define la app: *"ciclovías a menos de 300 m de aquí, por cercanía"*, que en el MVP
([0010](0010-alcance-del-mvp.md)) aparece en la primera pantalla.

| | Con PostGIS | Sin PostGIS |
|---|---|---|
| Qué pasa | Un `ST_DWithin` con índice GiST. Milisegundos con miles de ciclovías. | El API trae todas las ciclovías a memoria y calcula la distancia a cada una, en cada petición. |
| Por qué | El índice espacial divide el mapa en cajas y solo mira las relevantes. | No hay atajo. Hay que recorrerlas todas. |

## Decisión

**PostgreSQL con PostGIS, desde el primer día**, aunque el MVP use poco de él.

Lo que lo cierra no es el rendimiento, es el costo de adoptarlo **ahora** contra el de adoptarlo
después:

- **Ahora**: cambiar `postgres:16` por `postgis/postgis:16-3.4` en el compose y correr
  `CREATE EXTENSION IF NOT EXISTS postgis;` una vez. Eso es todo.
- **Después**: migrar los datos ya guardados a los tipos nuevos y reescribir las consultas que ya
  estén escritas de otra forma.

Es de los pocos casos donde la opción que escala no cobra nada por adelantado.

## Consecuencias

**A favor**

- Las consultas espaciales se resuelven donde están los datos, no trayéndolos por la red.
- Habilita cosas que llegan después sin cambiar nada: *"¿cuántos km de mi recorrido fueron sobre
  ciclovía?"* es cruzar dos geometrías, y sin PostGIS es muy incómodo.
- Cierra el supuesto que [0007](0007-drizzle-para-acceso-a-datos.md) dejó abierto. Esa decisión ya
  no descansa sobre algo sin decidir.

**En contra**

- **Se sale de la plantilla de base de datos de Dokploy**, que usa la imagen oficial de `postgres`
  y no trae la extensión. La base va como servicio del compose, y con eso **se pierden los backups
  automáticos de su interfaz**: hay que montar un `pg_dump` propio. Queda como pendiente abierto
  por [0009](0009-despliegue-en-dokploy.md).
- Las migraciones con PostGIS siempre se revisan a mano, y `drizzle-kit push` queda prohibido
  contra cualquier base que no sea desechable — ya anotado en
  [0007](0007-drizzle-para-acceso-a-datos.md).
- La imagen es más pesada y el contenedor arranca algo más lento. Irrelevante en la práctica.

## Alternativas descartadas

- **Postgres normal con las geometrías en `jsonb`** y los cálculos en TypeScript dentro de
  `packages/geo`. Se descartó porque la primera pantalla del MVP ya es la consulta que esto hace
  mal: obliga a traer la red entera a memoria en cada petición, y no hay índice que lo salve.
- **Solo metadatos, sin geometrías** — kilómetros y tiempos en la base, los trazados como archivos
  y la red de ciclovías solo dentro de Valhalla. Se descartó porque deja al API sin poder
  responder nada espacial por su cuenta, y porque obligaría a revisitar
  [0007](0007-drizzle-para-acceso-a-datos.md) entero.
- **SQLite con SpatiaLite** — más liviano y sin servidor. Se descartó porque el despliegue ya
  tiene un VPS con Docker ([0009](0009-despliegue-en-dokploy.md)), así que Postgres no cuesta
  nada extra, y porque SpatiaLite tiene bastante menos rodaje y peor soporte en Drizzle.
