# Comandos

Qué hace cada uno, cuándo se usa y con qué muerde. Los de despliegue, con más contexto, están en
[`infra/README.md`](../infra/README.md).

Todo corre con **Bun**, nunca con npm ni pnpm ([0001](decisiones/0001-monorepo-con-bun.md)).

## Antes de nada

```sh
bun install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Los dos `.env` son distintos a propósito: Expo solo lee el de su carpeta, y el del API es además
el que usa `docker compose` con `--env-file`, así que las credenciales del contenedor y las del
API no pueden desalinearse.

En `apps/mobile/.env` va **la URL del API que verá el teléfono**, y eso nunca es `localhost`:
en el teléfono, `localhost` es el teléfono.

## Día a día

| Comando | Qué hace |
|---|---|
| `bun run check` | `lint` + `typecheck`. Lo mismo que corre el hook de pre-push |
| `bun run lint` | Biome: formato y reglas, incluida la regla de dependencia entre carpetas |
| `bun run lint:fix` | Lo anterior, arreglando lo que se puede solo |
| `bun run typecheck` | `tsc --noEmit` en los cuatro paquetes a la vez |
| `bun run dev:api` | El API en el puerto 3001, recargando al guardar |
| `bun run dev:mobile` | Metro, el servidor de JavaScript del móvil |

Biome no compila, así que `lint` en verde no dice nada sobre los tipos. Por eso `check` corre los
dos y por eso el hook de pre-push existe: no hay CI ([0023](decisiones/0023-sin-ci-dokploy-despliega.md)).

Para saltar el hook en un push de emergencia: `git push --no-verify`.

## Base de datos y datos de OSM

| Comando | Qué hace | Cuánto tarda |
|---|---|---|
| `bun run infra:up` | Levanta PostGIS en Docker | segundos |
| `bun run infra:down` | Lo apaga. Los volúmenes quedan | segundos |
| `bun run db:migrate` | Aplica las migraciones: tablas y extensiones | segundos |
| `bun run osm:update` | Descarga OSM, carga ciclovías y construye el grafo | **unos 20 minutos**, casi todo descarga |

`osm:update` es el único comando largo del repo. Sus cuatro pasos y sus trampas están en
[`infra/README.md`](../infra/README.md). Lo importante: **construye el grafo nuevo al lado y solo
lo cambia al final**, así que si revienta a mitad no te deja el motor de ruteo peor de lo que
estaba.

### Migraciones

```sh
bun run --filter '@tupu/api' db:generate   # escribe el .sql desde el esquema
bun run db:migrate                          # lo aplica
```

Las migraciones van **en su propio commit**, nunca mezcladas con lógica: son lo único del repo que
no se puede revertir con un `git revert` ([0007](decisiones/0007-drizzle-para-acceso-a-datos.md)).

## El móvil

La app **no corre en Expo Go**: MapLibre lleva código nativo, así que hace falta una build propia
([0005](decisiones/0005-expo-en-el-movil.md)).

| Comando | Qué hace |
|---|---|
| `bun run --filter '@tupu/mobile' prebuild` | Genera `android/` desde `app.json`. Esa carpeta no se versiona |
| `bun run --filter '@tupu/mobile' android` | Compila e instala una build de **desarrollo** en el teléfono conectado |
| `bun run dev:mobile` | Metro. Hace falta con la build de desarrollo, no con el APK |

La build de desarrollo necesita Metro corriendo para funcionar. Los cambios de JavaScript entran
solos por fast refresh; **agregar una dependencia nativa obliga a recompilar**.

### El APK que se instala y anda solo

```sh
apps/mobile/android/gradlew -p apps/mobile/android assembleRelease
```

Deja el archivo en `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`. Tarda unos
cinco minutos y **no necesita Metro**: el JavaScript va dentro.

Antes de compilarlo, revisá a qué API apunta:

```sh
grep EXPO_PUBLIC apps/mobile/.env
```

Esa URL **se hornea en el APK**. Cambiarla obliga a recompilar y a repartir de nuevo, porque no
hay actualización forzada ([0030](decisiones/0030-sin-limite-de-uso-en-el-api.md)).

Para instalarlo, con el teléfono por USB y depuración activada:

```sh
adb install -r ruta/al/app-release.apk
```

**Va firmado con la clave de depuración** que genera Expo. Sirve para probar uno mismo y para nada
más: ver **EAS Build** en los aplazados de [`planeacion.md`](planeacion.md).

### Comprobar un APK antes de repartirlo

```sh
APK=apps/mobile/android/app/build/outputs/apk/release/app-release.apk

# ¿a qué API apunta de verdad?
unzip -p $APK assets/index.android.bundle | strings -a | grep -o "https://[a-z0-9.-]*" | sort -u

# ¿trae los permisos de ubicación?
grep -o 'android.permission.[A-Z_]*' \
  apps/mobile/android/app/build/intermediates/merged_manifests/release/AndroidManifest.xml | sort -u
```

El `strings -a` no sobra: el bundle es bytecode de Hermes, y un `grep` a secas no encuentra nada
aunque el texto esté ahí.

## Comprobar el API

```sh
# local
curl -s http://localhost:3001/health

# producción
curl -s https://tupu-api.s4vi0r.dev/health
curl -s "https://tupu-api.s4vi0r.dev/v1/cycleways/in-bbox?west=-77.06&south=-12.14&east=-77.00&north=-12.08"
curl -s -X POST https://tupu-api.s4vi0r.dev/v1/routing/plan \
  -H 'content-type: application/json' \
  -d '{"from":{"lat":-12.1219,"lng":-77.0297},"to":{"lat":-12.0464,"lng":-77.0428}}'
```

Qué significa cada respuesta:

| Respuesta | Qué pasa |
|---|---|
| `{"status":"ok"}` | El API está en pie y su configuración validó al arrancar |
| `{"type":"FeatureCollection","features":[]}` | El API y la base andan, pero **no hay datos**: falta la ingesta |
| `503 upstream_unavailable` en `/routing/plan` | Valhalla no responde: casi siempre, no hay grafo |
| `500` en cualquiera | Mirá los logs del contenedor |

Una lista vacía es muy distinta de un 500: la primera dice que las tablas existen y están vacías.

## En el VPS

Docker pide `sudo`, así que todo va con él.

```sh
sudo docker compose ls          # nombres de proyecto y dónde está cada compose
sudo docker ps                  # qué contenedor está arriba y cuál reiniciando
sudo docker logs <contenedor> --tail 100
```

`valhalla` reiniciando en bucle con `restarting(1)` no es un error del despliegue: es que todavía
no existe el grafo.

Para construirlo, desde la carpeta que clonó Dokploy:

```sh
sudo COMPOSE_FILE=compose.prod.yaml \
     COMPOSE_PROJECT=<el nombre exacto de docker compose ls> \
     ENV_FILE=.env \
     infra/osm/update.sh
```

Las tres variables tienen valores por defecto que apuntan al compose de desarrollo; en el VPS hay
que darlas. **`COMPOSE_PROJECT` tiene que ser exacto**: con otro nombre Docker no protesta, crea
volúmenes nuevos y vacíos, construye el grafo ahí y tu Valhalla sigue caído sin avisar.

Corrélo dentro de `screen` o `tmux`, porque si se corta el SSH a mitad se pierde el trabajo.

## Git

Rama por funcionalidad y pull request, aunque los apruebe quien los abrió
([0021](decisiones/0021-github-rama-por-funcionalidad.md)).

```sh
git switch -c feat/lo-que-sea
# ...
git push -u origin feat/lo-que-sea     # el hook corre lint y typecheck
```

Los mensajes van en inglés, con Conventional Commits, y **sin trailers de coautoría** — ni
`Co-Authored-By`, ni firmas de herramientas. Las reglas completas, con la lista cerrada de scopes,
están en [`conventions/commits.md`](conventions/commits.md).
