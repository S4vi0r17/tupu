# tupu

App para ciclistas en Lima: ciclovías en el mapa, rutas en bici con voz en cada giro y recorridos
grabados en el teléfono.

## Levantarlo

```sh
bun install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env    # con la IP de tu red local

bun run infra:up      # PostGIS en Docker
bun run db:migrate
bun run osm:update    # ciclovías y grafo de ruteo, unos 20 minutos la primera vez
bun run dev:api       # puerto 3001
```

La app no corre en Expo Go: MapLibre lleva código nativo (0005). Con el SDK de Android:

```sh
bun run --filter '@tupu/mobile' prebuild
bun run --filter '@tupu/mobile' android
bun run dev:mobile
```

El resto, en [`docs/`](docs/README.md).
