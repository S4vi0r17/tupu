# tupu

App para ciclistas en Lima: el mapa con la red de ciclovías, rutas en bici entre dos puntos con
una voz que anuncia los giros, y los recorridos grabados en el teléfono.

El servidor está desplegado. La app muestra las ciclovías, la posición y hacia dónde mira el
teléfono. Falta la pantalla de ruta, la voz y la grabación.

## Levantarlo

```sh
bun install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env    # con la IP de tu red local

bun run check         # lint y tipos
bun run infra:up      # PostGIS en Docker
bun run db:migrate
bun run osm:update    # ciclovías y grafo de ruteo, unos 20 minutos la primera vez
bun run dev:api       # puerto 3001
```

La app no corre en Expo Go porque MapLibre lleva código nativo (0005). Con el SDK de Android:

```sh
bun run --filter '@tupu/mobile' prebuild
bun run --filter '@tupu/mobile' android
bun run dev:mobile
```

Para un APK que no dependa de Metro:

```sh
apps/mobile/android/gradlew -p apps/mobile/android assembleRelease
```

`EXPO_PUBLIC_API_URL` queda dentro del APK al compilar.

## El repo

```
apps/api             Hono sobre Bun, por funcionalidad
apps/mobile          Expo Router
packages/contracts   esquemas de Zod entre el API y la app
packages/geo         matemática geográfica pura
infra/               Docker, PostGIS, Valhalla y la ingesta de OSM
docs/                decisiones, convenciones y cómo funciona
```

## El MVP

Siete piezas (0010, 0040): ciclovías en el mapa, ruta en bici entre dos puntos, voz en cada giro,
grabación del recorrido, brújula con cámara que te sigue, velocímetro y pantalla que no se apaga
sola. Sin cuentas. Solo Android con Google Play Services.

## Documentación

Todo en [`docs/`](docs/README.md). Cómo se trabaja, en
[`docs/conventions/workflow.md`](docs/conventions/workflow.md).
