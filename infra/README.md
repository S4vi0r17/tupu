# infra

Lo que corre al lado del API y no es código de aplicación: la base de datos, el motor de ruteo y
el comando que los llena con datos de OpenStreetMap.

```
compose.yaml       desarrollo: postgis · valhalla · osm, con puertos en local
compose.prod.yaml  producción en Dokploy: api · postgis · valhalla, detrás de Traefik
osm/Dockerfile     imagen de un solo uso con osmium y ogr2ogr
osm/update.sh      el comando osm:update, los cuatro pasos de 0020
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

## Producción, en Dokploy

Un solo proyecto de Dokploy de tipo **Compose**, apuntando a `infra/compose.prod.yaml`
([0009](../docs/decisiones/0009-despliegue-en-dokploy.md)). Traefik queda delante y **solo el API
sale a internet**: PostGIS y Valhalla viven en la red `internal` y no publican ningún puerto.

El Dockerfile del API se construye **desde la raíz del repo**, porque sin `bun.lock` ni
`packages/` no hay instalación posible ([0001](../docs/decisiones/0001-monorepo-con-bun.md)). El
`--filter '@tupu/api'` del install deja fuera las dependencias del móvil: la imagen queda en unos
150 MB en vez de arrastrar Expo entero.

### Variables de entorno en Dokploy

| Variable | Qué |
|---|---|
| `API_DOMAIN` | El dominio del API, solo el host: `api.ejemplo.pe`, sin `https://` ni barra final |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credenciales de la base. **No** las de `.env.example`, que son de juguete |

`DATABASE_URL` y `VALHALLA_URL` no se cargan a mano: las arma el compose con los nombres de
servicio de la red interna. Si falta cualquiera de las cuatro, el despliegue falla al interpolar y
dice cuál.

### El primer despliegue

1. **Apuntá el DNS al VPS antes de desplegar.** Sin el registro resuelto, Let's Encrypt no emite
   el certificado y Traefik sirve el suyo, autofirmado.
2. Proyecto nuevo en Dokploy, tipo Compose, con el repositorio y la ruta
   `infra/compose.prod.yaml`.
3. Cargá las variables de arriba y desplegá. El API corre las migraciones al arrancar y recién
   después sirve ([0009](../docs/decisiones/0009-despliegue-en-dokploy.md)).
4. **Valhalla todavía no arranca**: no hay grafo. Eso es el paso siguiente, y no es parte del
   despliegue.

Si preferís cargar el dominio desde la interfaz de Dokploy en vez del compose, borrá las etiquetas
de Traefik del servicio `api`. Las dos cosas a la vez dejan dos routers peleando por el mismo host.

### Los datos de OSM, a mano y aparte

Decenas de minutos y varios GB: no puede ir en un `git push`
([0009](../docs/decisiones/0009-despliegue-en-dokploy.md)). Por SSH en el VPS, en la carpeta donde
Dokploy clonó el repositorio:

```sh
docker compose ls                     # el nombre del proyecto que creó Dokploy

COMPOSE_FILE=compose.prod.yaml \
COMPOSE_PROJECT=<el nombre de arriba> \
ENV_FILE=/ruta/absoluta/al/.env \
  infra/osm/update.sh
```

`ENV_FILE` es el `.env` que Dokploy escribe en la carpeta del proyecto; va en ruta absoluta porque
el script se mueve a `infra/` antes de correr. Las tres variables tienen valores por defecto que
apuntan al compose de desarrollo, así que en local se sigue corriendo `bun run osm:update` sin
nada delante.

Al terminar, el script reinicia Valhalla con el grafo nuevo y el API empieza a devolver rutas.

### Dimensionar el VPS

Valhalla es el que manda el tamaño, y el pico no es servir sino **construir el grafo**. Con el
extracto de Perú, que hoy pesa unos 250 MB, la estimación de partida es **no bajar de 8 GB de RAM**
y dejar **20-30 GB de disco** libres entre el `.pbf`, los tiles de elevación y el grafo. Es una
estimación, no una medición: si el VPS queda corto, `valhalla_build_tiles` muere sin explicar
mucho.

## Lo que falta

| Qué | Por qué | Decisión |
|---|---|---|
| Backups de la base | PostGIS va dentro del compose, así que la interfaz de Dokploy no lo respalda: hace falta un `pg_dump` propio. **Bloqueante antes de la primera cuenta de usuario** | [0017](../docs/decisiones/0017-backups-aplazados-con-disparador.md) |
| Límite de uso en el API | **Bloqueante antes de pasarle el APK a otra persona**, porque el APK lleva la URL dentro | [0030](../docs/decisiones/0030-sin-limite-de-uso-en-el-api.md) |
| Sacar las migraciones del arranque | Con una réplica está bien; con dos, dos contenedores migrando a la vez es un problema | [0009](../docs/decisiones/0009-despliegue-en-dokploy.md) |
