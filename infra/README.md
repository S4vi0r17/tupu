# infra

Lo que corre al lado del API y no es código de aplicación: la base de datos, el motor de ruteo y
el comando que los llena con datos de OpenStreetMap.

```
compose.yaml     postgis · valhalla · osm
osm/Dockerfile   imagen de un solo uso con osmium y ogr2ogr
osm/update.sh    el comando osm:update, los cuatro pasos de 0020
```

## Levantarlo

```sh
cp apps/api/.env.example apps/api/.env   # una sola vez
bun run infra:up                         # solo PostGIS: Valhalla todavía no tiene grafo
bun run db:migrate                       # crea las tablas y habilita las extensiones
bun run osm:update                       # descarga, carga ciclovías y construye el grafo
```

`apps/api/.env` es la fuente única del lado servidor. El compose lo lee con `--env-file`, así que
las credenciales del contenedor y las que usa el API no pueden quedar desalineadas.

**La primera corrida tarda decenas de minutos** y baja unos 250 MB del extracto de Perú. Valhalla
no arranca hasta que exista el grafo, que es lo que produce el último paso.

## Los cuatro pasos de `osm:update`

Salen todos de la misma descarga, que es lo que impide que el mapa y el ruteo se desincronicen
([0020](../docs/decisiones/0020-actualizacion-de-datos-en-un-comando.md)).

| Paso | Qué hace |
|---|---|
| 1 | Levanta PostGIS y espera a que esté sano |
| 2 | Descarga el extracto de Perú de Geofabrik, solo si hay uno más nuevo |
| 3 | Filtra ciclovías con `osmium`, las carga con `ogr2ogr` y reemplaza la tabla en una transacción |
| 4 | Construye el grafo en `tiles.new`, y recién al final lo cambia por el que estaba sirviendo |

El paso 3 corre `apps/api/src/features/cycleways/ingest.ts`, que vive junto a su feature
([0008](../docs/decisiones/0008-apps-api-por-funcionalidad.md)) y aborta la transacción si la red
se encoge a menos de la mitad: una ingesta rota no puede dejar la app sin ciclovías.

## Dos cosas que muerden

- **La elevación se descarga antes de construir el grafo, y solo para un recuadro de Lima.** Si
  llega después, el grafo ya se construyó sin pendientes y `use_hills` del perfil ciclista no hace
  nada ([0029](../docs/decisiones/0029-perfil-ciclista-de-valhalla.md)). Para ampliar la zona está
  `ELEVATION_BBOX`; ampliarla cuesta descarga y minutos.
- **Valhalla nunca se publica en el VPS.** Acá escucha en `127.0.0.1` para poder probarlo con
  `curl`; allá solo lo alcanza el API por la red interna, porque un motor de ruteo abierto es CPU
  gratis para cualquiera que lo encuentre
  ([0009](../docs/decisiones/0009-despliegue-en-dokploy.md)).

## Lo que falta

| Qué | Por qué | Decisión |
|---|---|---|
| `Dockerfile` del API, construido **desde la raíz del repo** | Sin el lockfile y sin `packages/` no puede instalar | [0001](../docs/decisiones/0001-monorepo-con-bun.md) |
| Correr `drizzle-kit migrate` al arrancar el contenedor del API | Funciona con una réplica; con dos, dos contenedores migrando a la vez es un problema | [0009](../docs/decisiones/0009-despliegue-en-dokploy.md) |
| Backups de la base | **Bloqueante antes de la primera cuenta de usuario** | [0017](../docs/decisiones/0017-backups-aplazados-con-disparador.md) |
