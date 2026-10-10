# Decisiones

Una por archivo. El formato y cuándo escribir una, en
[`conventions/docs.md`](../conventions/docs.md).

| # | Decisión | Cambios |
|---|---|---|
| [0001](0001-monorepo-with-bun.md) | Monorepo con workspaces de Bun |  |
| [0002](0002-repo-layout.md) | Layout del repositorio |  |
| [0003](0003-code-language.md) | Código en inglés, comentarios en español | Reemplazada en parte por 0022 |
| [0004](0004-hono-for-the-api.md) | Hono sobre Bun en el API |  |
| [0005](0005-expo-for-mobile.md) | Expo + MapLibre en el móvil |  |
| [0006](0006-valhalla-for-routing.md) | Valhalla propio para calcular rutas |  |
| [0007](0007-drizzle-for-data-access.md) | Drizzle para el acceso a datos |  |
| [0008](0008-api-by-feature.md) | `apps/api` se organiza por funcionalidad |  |
| [0009](0009-deploy-on-dokploy.md) | Despliegue en Dokploy sobre un VPS |  |
| [0010](0010-mvp-scope.md) | Alcance del MVP | Reemplazada en parte por 0027 y 0040 |
| [0011](0011-postgis-from-the-start.md) | PostgreSQL con PostGIS desde el inicio |  |
| [0012](0012-osm-ingest-from-extract.md) | La red ciclista se ingiere de un extracto de OSM, a mano |  |
| [0013](0013-rides-in-local-sqlite.md) | El recorrido se guarda en SQLite en el teléfono |  |
| [0014](0014-expo-router-zustand-tanstack-query.md) | Expo Router, Zustand y TanStack Query en el móvil |  |
| [0015](0015-background-recording.md) | Grabación en segundo plano con `expo-location` |  |
| [0016](0016-openfreemap-tiles-for-mvp.md) | Tiles del mapa: OpenFreeMap en el MVP, propios después |  |
| [0017](0017-backups-deferred-with-trigger.md) | Backups aplazados, con disparador |  |
| [0018](0018-no-staging-environment.md) | Sin entorno de pruebas: solo producción y local |  |
| [0019](0019-android-only-mvp.md) | El MVP es solo Android |  |
| [0020](0020-one-command-data-update.md) | Los datos de OSM se actualizan con un solo comando, a mano |  |
| [0021](0021-github-feature-branches.md) | GitHub, con rama por funcionalidad y pull request |  |
| [0022](0022-commit-messages-in-english.md) | Mensajes de commit en inglés, con Conventional Commits | Reemplaza en parte a 0003 |
| [0023](0023-no-ci-dokploy-deploys.md) | Sin CI: Dokploy despliega al mergear |  |
| [0024](0024-no-tests-during-mvp.md) | Sin tests durante el MVP |  |
| [0025](0025-fused-compass-heading.md) | La brújula usa el rumbo fusionado del sistema, suavizado en el círculo |  |
| [0026](0026-cycleways-drawn-from-tiles.md) | Las ciclovías se dibujan desde el tile | Reemplazada por 0038 |
| [0027](0027-compass-shows-facing-direction.md) | La brújula muestra hacia dónde mira el teléfono, no el destino | Reemplaza en parte a 0010 · Reemplazada en parte por 0039 |
| [0028](0028-destination-by-map-or-coordinates.md) | El destino se elige tocando el mapa o pegando coordenadas |  |
| [0029](0029-valhalla-cycling-profile.md) | Perfil ciclista: prioriza ciclovía y evita subidas |  |
| [0030](0030-no-api-rate-limit.md) | Sin límite de uso en el API, con disparador |  |
| [0031](0031-biome-for-lint-and-format.md) | Biome para lint y formato |  |
| [0032](0032-zod-for-contracts.md) | Zod para validar y definir los contratos |  |
| [0033](0033-drizzle-on-the-phone.md) | Drizzle también en el teléfono |  |
| [0034](0034-project-named-tupu.md) | El proyecto se llama `tupu` |  |
| [0035](0035-bun-hoisted-linker.md) | Bun instala con enlazador plano | Reemplazada por 0037 |
| [0036](0036-nativewind-for-styles.md) | NativeWind para los estilos del móvil |  |
| [0037](0037-bun-isolated-linker.md) | Bun se queda con el enlazador aislado | Reemplaza a 0035 |
| [0038](0038-cycleways-drawn-from-api.md) | Las ciclovías se dibujan desde el API | Reemplaza a 0026 · Reemplazada en parte por 0041 |
| [0039](0039-three-camera-modes.md) | La cámara del mapa tiene tres modos, y un botón los cicla | Reemplaza en parte a 0027 |
| [0040](0040-voice-scope-requires-google.md) | El MVP suma voz, velocímetro y pantalla encendida, y requiere Google Play Services | Reemplaza en parte a 0010 |
| [0041](0041-cycleways-in-one-request.md) | La red ciclista se pide entera, una vez | Reemplaza en parte a 0038 |
