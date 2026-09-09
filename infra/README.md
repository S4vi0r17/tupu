# infra

Todo lo que corre al lado del API y no es código de aplicación: la base de datos, el motor de
ruteo y el comando que los llena con datos de OpenStreetMap.

**Todavía está vacío.** Es el paso 2 del orden de arranque de
[`../docs/planeacion.md`](../docs/planeacion.md), y lo que falta es esto:

| Qué | Por qué | Decisión |
|---|---|---|
| `docker-compose.yml` con `postgis/postgis` y Valhalla | El Postgres de Dokploy no trae PostGIS, hay que fijar la imagen | [0009](../docs/decisiones/0009-despliegue-en-dokploy.md), [0011](../docs/decisiones/0011-postgis-desde-el-inicio.md) |
| Imagen propia para `osm:update` | El comando necesita `osmium` y `ogr2ogr`, que no están en la imagen de Bun del API | [0012](../docs/decisiones/0012-ingesta-de-osm-por-extracto.md), [0020](../docs/decisiones/0020-actualizacion-de-datos-en-un-comando.md) |
| Volumen persistente para los tiles de Valhalla | Se tarda decenas de minutos en construirlos: no pueden rehacerse en cada despliegue | [0009](../docs/decisiones/0009-despliegue-en-dokploy.md) |
| `Dockerfile` del API, construido **desde la raíz del repo** | Sin el lockfile y sin `packages/` no puede instalar | [0001](../docs/decisiones/0001-monorepo-con-bun.md) |

Valhalla **nunca** se expone a internet: solo lo alcanza el API por la red interna del compose. Un
motor de ruteo abierto es CPU gratis para cualquiera que lo encuentre
([0009](../docs/decisiones/0009-despliegue-en-dokploy.md)).

Las migraciones ya están listas y viven en `apps/api/drizzle/`. La primera habilita PostGIS, porque
la columna `geom` de `cycleways` no se puede crear sin la extensión.
