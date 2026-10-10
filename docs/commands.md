# Comandos

Todo con Bun (0001). El despliegue, con más detalle, en [`infra/README.md`](../infra/README.md).

## Configuración

```sh
bun install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

El `.env` del API también lo lee `docker compose`, así las credenciales del contenedor y del API
no se desalinean. En el del móvil va la URL que verá el teléfono, nunca `localhost`.

## Día a día

| Comando | Qué hace |
|---|---|
| `bun run check` | Lint y tipos. Lo corre el hook de pre-push |
| `bun run lint` / `lint:fix` | Biome, incluidas las reglas de dependencia |
| `bun run typecheck` | `tsc --noEmit` en los cuatro paquetes |
| `bun run dev:api` | API en el puerto 3001, con recarga |
| `bun run dev:mobile` | Metro |

No hay CI, así que el hook de pre-push es el único control (0023). Para saltarlo:
`git push --no-verify`.

## Datos

| Comando | Qué hace | Tarda |
|---|---|---|
| `bun run infra:up` / `infra:down` | PostGIS en Docker; los volúmenes quedan | segundos |
| `bun run db:migrate` | Aplica las migraciones | segundos |
| `bun run --filter '@tupu/api' db:generate` | Escribe una migración desde el esquema | segundos |
| `bun run osm:update` | Ciclovías y grafo de ruteo | unos 20 min |

`osm:update` construye el grafo nuevo al lado del viejo y los cambia al final: si falla a la
mitad, Valhalla sigue con el anterior.

## El móvil

No corre en Expo Go: MapLibre lleva código nativo (0005).

| Comando | Qué hace |
|---|---|
| `bun run --filter '@tupu/mobile' prebuild` | Genera `android/`, que no se versiona |
| `bun run --filter '@tupu/mobile' android` | Compila e instala la build de desarrollo |
| `bun run dev:mobile` | Metro, para la build de desarrollo |

Agregar una dependencia nativa obliga a recompilar.

### APK

```sh
apps/mobile/android/gradlew -p apps/mobile/android assembleRelease
adb install -r apps/mobile/android/app/build/outputs/apk/release/app-release.apk
```

Unos cinco minutos. No necesita Metro. Va firmado con la clave de depuración de Expo: sirve para
probar, no para repartir (ver EAS en la [roadmap](roadmap.md)).

`EXPO_PUBLIC_API_URL` queda dentro del APK. Para comprobar a qué API apunta y qué permisos trae:

```sh
APK=apps/mobile/android/app/build/outputs/apk/release/app-release.apk
unzip -p $APK assets/index.android.bundle | strings -a | grep -o "https://[a-z0-9.-]*" | sort -u
grep -o 'android.permission.[A-Z_]*' \
  apps/mobile/android/app/build/intermediates/merged_manifests/release/AndroidManifest.xml | sort -u
```

El bundle es bytecode de Hermes: sin `strings -a`, `grep` no encuentra el texto.

## Probar el API

```sh
curl -s http://localhost:3001/health
curl -s --compressed https://tupu-api.s4vi0r.dev/v1/cycleways
curl -s -X POST https://tupu-api.s4vi0r.dev/v1/routing/plan \
  -H 'content-type: application/json' \
  -d '{"from":{"lat":-12.1219,"lng":-77.0297},"to":{"lat":-12.0464,"lng":-77.0428}}'
```

| Respuesta | Qué pasa |
|---|---|
| `{"status":"ok"}` | El API está arriba y su configuración es válida |
| `features: []` | Las tablas existen pero falta la ingesta |
| `503 upstream_unavailable` | Valhalla no responde; casi siempre falta el grafo |
| `500` | Revisar los logs del contenedor |

## En el VPS

```sh
sudo docker compose ls
sudo docker ps
sudo docker logs <contenedor> --tail 100
```

Valhalla reiniciando en bucle es que todavía no hay grafo. Para construirlo, dentro de `screen` o
`tmux` y desde la carpeta que clonó Dokploy:

```sh
sudo COMPOSE_FILE=compose.prod.yaml \
     COMPOSE_PROJECT=<nombre exacto de docker compose ls> \
     ENV_FILE=.env \
     infra/osm/update.sh
```

Con un `COMPOSE_PROJECT` distinto, Docker crea volúmenes vacíos sin avisar y Valhalla sigue caído.

## Git

Rama por funcionalidad y pull request (0021). Mensajes según
[`conventions/commits.md`](conventions/commits.md).
