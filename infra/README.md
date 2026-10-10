# infra

La base de datos, el motor de ruteo y el comando que los llena con datos de OSM.

```
compose.yaml       desarrollo: postgis, valhalla, osm
compose.prod.yaml  producción en Dokploy: api, postgis, valhalla
osm/Dockerfile     imagen de un solo uso con osmium y ogr2ogr
osm/update.sh      osm:update
```

## Local

```sh
cp apps/api/.env.example apps/api/.env
bun run infra:up      # solo PostGIS: Valhalla espera al grafo
bun run db:migrate
bun run osm:update
```

El compose lee `apps/api/.env`, así el contenedor y el API comparten credenciales.

## osm:update

Los cuatro pasos salen de la misma descarga (0020):

1. Levanta PostGIS.
2. Baja el extracto de Perú si Geofabrik tiene uno más nuevo. Lo baja a un `.part`, lo verifica
   con osmium y recién entonces reemplaza al anterior.
3. Filtra las ciclovías y reemplaza la tabla en una transacción. Se revierte si la red queda en
   menos de la mitad.
4. Construye el grafo en `tiles.new` y lo cambia por el anterior al terminar.

La elevación se baja antes del grafo y solo para el recuadro de Lima (`ELEVATION_BBOX`). Si llega
después, el grafo queda sin pendientes y `use_hills` no hace nada (0029).

Valhalla escucha en `127.0.0.1` en local. En el VPS no se publica: un motor de ruteo abierto es
CPU gratis para cualquiera (0009).

## Producción

Un proyecto de Dokploy tipo Compose, con `infra/compose.prod.yaml`. Traefik delante; solo el API
sale a internet. PostGIS y Valhalla viven en la red `internal`.

La imagen del API se construye desde la raíz del repo, porque necesita `bun.lock` y `packages/`.
`--filter '@tupu/api'` deja fuera las dependencias del móvil: unos 150 MB.

### Variables

Solo `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB`, distintas de las de `.env.example`.
`DATABASE_URL` y `VALHALLA_URL` las arma el compose. La contraseña, solo letras y números
(`openssl rand -hex 24`): un `@` o un `/` rompen la URL de conexión. Dokploy las escribe en
`infra/.env`.

### Primer despliegue

1. Apuntar el DNS al VPS antes. Sin eso, Let's Encrypt no emite el certificado.
2. Servicio Compose, no `stack`: Swarm no construye imágenes ni respeta `depends_on`. Ruta:
   `infra/compose.prod.yaml`.
3. Dominio apuntando al servicio `api`, puerto 3000.
4. Cargar las variables y desplegar. El API migra al arrancar.
5. Construir el grafo: Valhalla no arranca sin él.

### El grafo en el VPS

Por SSH, desde la carpeta que clonó Dokploy:

```sh
docker compose ls

COMPOSE_FILE=compose.prod.yaml \
COMPOSE_PROJECT=<nombre de arriba> \
ENV_FILE=.env \
  infra/osm/update.sh
```

`COMPOSE_PROJECT` tiene que ser exacto. Dokploy le agrega un sufijo (`tupu-intra-6txm2f`), y con
otro nombre Docker crea volúmenes vacíos en vez de usar los que sirven.

## Tamaño del VPS

Medido el 2026-10-10 con el extracto de Perú, Valhalla 3.8.3 y 16 hilos:

| | Pico | En reposo |
|---|---|---|
| RAM al construir el grafo | 3,1 GiB | |
| RAM de los tres servicios | | ~300 MiB |
| Volumen de Valhalla | 2,7 GB | 840 MB |
| Volumen de PostGIS | | 115 MB |
| Imágenes de Docker | | ~2 GB |

| En el volumen de Valhalla | |
|---|---|
| `tiles/`, el grafo | 426 MB |
| `pbf/`, el extracto | 245 MB |
| `timezones.sqlite`, zonas horarias del mundo | 116 MB |
| `elevation/`, solo Lima | 41 MB |
| `admins.sqlite`, fronteras | 12 MB |

Alcanzan 4 GB de RAM y 10 GB libres. Con menos núcleos el grafo tarda más; es de esperar que use
menos RAM, pero no está medido. Para volver a medir: `docker stats` mientras corre `osm:update`.

## Pendiente

| Qué | Por qué | |
|---|---|---|
| Backups de la base | Dokploy no respalda una base dentro de un compose. Antes de la primera cuenta | 0017 |
| Límite de uso del API | Antes de pasarle el APK a otra persona | 0030 |
| Migraciones fuera del arranque | Con dos réplicas migrarían a la vez | 0009 |
