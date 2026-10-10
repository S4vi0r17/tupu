# Decisiones

Una decisión de arquitectura por archivo, numeradas por orden en que se tomaron. La idea es que
dentro de seis meses se pueda responder *"¿por qué esto está así?"* sin reconstruir la conversación
de memoria — y sobre todo, saber **qué se dio a cambio**, que es lo que siempre se olvida.

Formato: contexto, decisión, y consecuencias separadas en lo que se gana y lo que se paga.
Una decisión no se edita cuando cambia de opinión: se escribe una nueva que la reemplace y se
marca la vieja como sustituida. El historial es el valor.

| # | Decisión | Estado |
|---|---|---|
| [0001](0001-monorepo-con-bun.md) | Monorepo con workspaces de Bun | Aceptada |
| [0002](0002-layout-del-repo.md) | Layout `apps/` · `packages/` · `infra/` · `docs/` | Aceptada |
| [0003](0003-idioma-del-codigo.md) | Código en inglés, comentarios en español | Aceptada, **sustituida en parte** por [0022](0022-mensajes-de-commit-en-ingles.md) |
| [0004](0004-hono-en-el-api.md) | Hono sobre Bun en el API | Aceptada |
| [0005](0005-expo-en-el-movil.md) | Expo + MapLibre GL Native en el móvil | Aceptada |
| [0006](0006-valhalla-para-ruteo.md) | Valhalla self-hosted para calcular rutas | Aceptada |
| [0007](0007-drizzle-para-acceso-a-datos.md) | Drizzle para el acceso a datos | Aceptada |
| [0008](0008-apps-api-por-funcionalidad.md) | `apps/api` se organiza por funcionalidad | Aceptada |
| [0009](0009-despliegue-en-dokploy.md) | Despliegue en Dokploy sobre un VPS | Aceptada |
| [0010](0010-alcance-del-mvp.md) | Alcance del MVP: mapa, ruta, grabación local y brújula | Aceptada, **la brújula redefinida** por [0027](0027-brujula-muestra-hacia-donde-miras.md), **ampliada** por [0040](0040-alcance-con-voz-y-solo-con-google.md) |
| [0011](0011-postgis-desde-el-inicio.md) | PostgreSQL con PostGIS desde el inicio | Aceptada |
| [0012](0012-ingesta-de-osm-por-extracto.md) | Ingesta de OSM por extracto, a mano | Aceptada |
| [0013](0013-recorrido-en-sqlite-local.md) | El recorrido se guarda en SQLite en el teléfono | Aceptada |
| [0014](0014-expo-router-zustand-tanstack-query.md) | Expo Router, Zustand y TanStack Query en el móvil | Aceptada |
| [0015](0015-grabacion-en-segundo-plano.md) | Grabación en segundo plano con `expo-location` | Aceptada |
| [0016](0016-tiles-openfreemap-en-el-mvp.md) | Tiles del mapa: OpenFreeMap en el MVP | Aceptada |
| [0017](0017-backups-aplazados-con-disparador.md) | Backups aplazados, con disparador escrito | Aceptada |
| [0018](0018-sin-entorno-de-pruebas.md) | Sin entorno de pruebas: solo producción y local | Aceptada |
| [0019](0019-mvp-solo-android.md) | El MVP es solo Android | Aceptada |
| [0020](0020-actualizacion-de-datos-en-un-comando.md) | Los datos de OSM se actualizan con un solo comando | Aceptada |
| [0021](0021-github-rama-por-funcionalidad.md) | GitHub, con rama por funcionalidad y pull request | Aceptada |
| [0022](0022-mensajes-de-commit-en-ingles.md) | Mensajes de commit en inglés, Conventional Commits | Aceptada |
| [0023](0023-sin-ci-dokploy-despliega.md) | Sin CI: Dokploy despliega al mergear | Aceptada |
| [0024](0024-sin-tests-durante-el-mvp.md) | Sin tests durante el MVP | Aceptada |
| [0025](0025-brujula-heading-fusionado.md) | La brújula usa el rumbo fusionado, suavizado en el círculo | Aceptada |
| [0026](0026-ciclovias-dibujadas-desde-el-tile.md) | Las ciclovías se dibujan desde el tile | **Sustituida** por [0038](0038-ciclovias-dibujadas-desde-el-api.md) |
| [0027](0027-brujula-muestra-hacia-donde-miras.md) | La brújula muestra hacia dónde miras | Aceptada, **sustituida en parte** por [0039](0039-tres-modos-de-camara.md) |
| [0028](0028-destino-por-mapa-o-coordenadas.md) | El destino se elige tocando el mapa o pegando coordenadas | Aceptada |
| [0029](0029-perfil-ciclista-de-valhalla.md) | Perfil ciclista: prioriza ciclovía y evita cuestas | Aceptada |
| [0030](0030-sin-limite-de-uso-en-el-api.md) | Sin límite de uso en el API, con disparador | Aceptada |
| [0031](0031-biome-para-lint-y-formato.md) | Biome para lint y formato | Aceptada |
| [0032](0032-zod-en-contracts.md) | Zod para validar y definir los contratos | Aceptada |
| [0033](0033-drizzle-tambien-en-el-telefono.md) | Drizzle también en el teléfono | Aceptada |
| [0034](0034-el-proyecto-se-llama-tupu.md) | El proyecto se llama `tupu` | Aceptada, **sustituye** al nombre `rumbo` |
| [0035](0035-bun-instala-con-enlazador-plano.md) | Bun instala con enlazador plano | **Sustituida** por [0037](0037-bun-se-queda-con-el-enlazador-aislado.md) |
| [0036](0036-nativewind-para-los-estilos.md) | NativeWind para los estilos del móvil | Aceptada |
| [0037](0037-bun-se-queda-con-el-enlazador-aislado.md) | Bun se queda con el enlazador aislado | Aceptada, **sustituye** a [0035](0035-bun-instala-con-enlazador-plano.md) |
| [0038](0038-ciclovias-dibujadas-desde-el-api.md) | Las ciclovías se dibujan desde el API | Aceptada, **sustituye** a [0026](0026-ciclovias-dibujadas-desde-el-tile.md) |
| [0039](0039-tres-modos-de-camara.md) | La cámara del mapa tiene tres modos, y un botón los cicla | Aceptada, **sustituye en parte** a [0027](0027-brujula-muestra-hacia-donde-miras.md) |
| [0040](0040-alcance-con-voz-y-solo-con-google.md) | El MVP suma voz, velocímetro y pantalla encendida, y requiere Google Play Services | Aceptada, **sustituye en parte** a [0010](0010-alcance-del-mvp.md) |
