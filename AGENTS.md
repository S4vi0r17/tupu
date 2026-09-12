# Convenciones — tupu

Instrucciones para agentes de IA que trabajen en este repo. `CLAUDE.md` es un symlink a este
archivo.

## Estado del proyecto

**Planeación cerrada.** 38 decisiones tomadas, ninguna abierta.

| Documento | Para qué |
|---|---|
| [`docs/planeacion.md`](docs/planeacion.md) | **Leer esto primero.** Estado, orden de arranque, aplazados con disparador |
| [`docs/como-funciona.md`](docs/como-funciona.md) | El recorrido de un dato de OSM a la pantalla, y cómo funciona cada pieza |
| [`docs/comandos.md`](docs/comandos.md) | Qué hace cada comando, cuándo se usa y con qué muerde |
| [`docs/stack.md`](docs/stack.md) | El stack de un vistazo, con el rival descartado de cada capa |
| [`docs/decisiones/`](docs/decisiones/) | 0001–0038: el razonamiento y qué se dio a cambio |
| [`docs/modelo-datos.md`](docs/modelo-datos.md) | Las entidades campo por campo |
| [`docs/glosario.md`](docs/glosario.md) | OSM, PostGIS, tiles, isócronas, APK… |
| [`docs/conventions/commits.md`](docs/conventions/commits.md) | Todo mensaje de commit |
| [`docs/conventions/comments.md`](docs/conventions/comments.md) | Comentarios y TSDoc en cualquier `.ts` |

**No reabras lo decidido.** Si algo parece mal elegido, el documento de decisión ya dice contra qué
se comparó y qué se pagó. Y una decisión **no se edita** cuando se cambia de opinión: se escribe
una nueva que la reemplace y se marca la vieja como sustituida — ver
[`docs/decisiones/README.md`](docs/decisiones/README.md).

## Cómo se trabaja aquí

Es un **proyecto personal**, no de una empresa. Nació porque no hay apps decentes para ciclistas en
Lima.

- **MVP primero, pero que escale.** Distinguí siempre *qué necesita el MVP ahora* de *qué se añade
  después*, y decí cuál es cuál. Preferí lo que hoy cuesta poco y evita una migración
  (PostGIS es el ejemplo) sobre lo que ahorra hoy y obliga a reescribir.
- **Explicá antes de pedir una decisión.** Quien decide no conoce a fondo el stack geoespacial ni
  el backend, y quiere aprender. Nombrar la herramienta no es explicarla: decí en dos o tres frases
  qué es y **qué problema concreto de tupu resuelve**, con el ejemplo real de la app. Recién
  después las opciones.
- **Alternativas siempre.** Al proponer algo, decí contra qué compite y qué se paga por elegirlo.

## Stack, que no es el default de nada

| | Qué se usa | No uses |
|---|---|---|
| Runtime y paquetes | **Bun** ([0001](docs/decisiones/0001-monorepo-con-bun.md)) | npm, pnpm, yarn, Node |
| API | **Hono** ([0004](docs/decisiones/0004-hono-en-el-api.md)) | Express, NestJS |
| Base de datos | **PostgreSQL + PostGIS** ([0011](docs/decisiones/0011-postgis-desde-el-inicio.md)) | Postgres pelado, `jsonb` para geometrías |
| Acceso a datos | **Drizzle**, también en el móvil ([0007](docs/decisiones/0007-drizzle-para-acceso-a-datos.md), [0033](docs/decisiones/0033-drizzle-tambien-en-el-telefono.md)) | Prisma, SQL crudo |
| Validación y contratos | **Zod** ([0032](docs/decisiones/0032-zod-en-contracts.md)) | class-validator, yup, tipos escritos a mano |
| Lint y formato | **Biome**, una sola herramienta ([0031](docs/decisiones/0031-biome-para-lint-y-formato.md)) | ESLint, Prettier por separado |
| Móvil | **Expo Router + Zustand + TanStack Query** ([0014](docs/decisiones/0014-expo-router-zustand-tanstack-query.md)) | React Navigation directo, Redux, Context para estado compartido |
| Estilos del móvil | **NativeWind 5** con Tailwind 4 ([0036](docs/decisiones/0036-nativewind-para-los-estilos.md)) | `StyleSheet` a secas, NativeWind 4 |
| Mapa | **MapLibre** + tiles de OpenFreeMap ([0005](docs/decisiones/0005-expo-en-el-movil.md), [0016](docs/decisiones/0016-tiles-openfreemap-en-el-mvp.md)) | react-native-maps, SDK de Mapbox, tiles de osm.org |
| Ruteo | **Valhalla** self-hosted ([0006](docs/decisiones/0006-valhalla-para-ruteo.md)) | Mapbox Directions, Google, OSRM |
| Tests | **Ninguno todavía** ([0024](docs/decisiones/0024-sin-tests-durante-el-mvp.md)) | No añadas tests sin hablarlo: es una decisión tomada |

## Idiomas

| En inglés | En español |
|---|---|
| Identificadores, archivos, carpetas, ramas | Comentarios y TSDoc |
| Campos del API, tablas y columnas | `docs/` |
| **Mensajes de commit** ([0022](docs/decisiones/0022-mensajes-de-commit-en-ingles.md)) | Textos que ve el usuario |

[0003](docs/decisiones/0003-idioma-del-codigo.md) fija la regla; 0022 la reemplazó **solo** en los
commits.

**En los commits no van trailers de coautoría** — ni `Co-Authored-By`, ni enlaces de sesión, ni
firmas de herramientas. Si tu agente los añade por defecto, desactivalos
([convenciones](docs/conventions/commits.md)).

## La regla de dependencia

```
apps/*  →  packages/*        sí
packages/*  →  apps/*        NUNCA
apps/api  ↔  apps/mobile     NUNCA
features/rides  →  features/cycleways/queries.ts    NUNCA, solo su index.ts
```

Se hace cumplir desde Biome, no desde la buena intención
([0002](docs/decisiones/0002-layout-del-repo.md), [0008](docs/decisiones/0008-apps-api-por-funcionalidad.md)).
Importa más aquí que en otros repos: el `node_modules` aplanado de Bun **no aísla nada**, así que
el móvil puede importar el cliente de Postgres y en desarrollo no falla — revienta al construir el
bundle, o peor, entra en él.

**Si tocás esas reglas, verificalas rompiéndolas a propósito.** Una regla mal escrita no dispara y
parece verde.

## Disparadores que no se pueden olvidar

Están todos en [`docs/planeacion.md`](docs/planeacion.md). Los dos bloqueantes:

- **Límite de uso en el API, antes de pasarle el APK a otra persona.** El APK lleva la URL dentro,
  así que repartirlo es publicarla — y repartirlo está en el plan
  ([0030](docs/decisiones/0030-sin-limite-de-uso-en-el-api.md), [0019](docs/decisiones/0019-mvp-solo-android.md)).
- **Backups, antes de desplegar la primera cuenta de usuario**
  ([0017](docs/decisiones/0017-backups-aplazados-con-disparador.md)).

## Dos cosas a verificar al configurar

Si fallan, cambian una decisión ya tomada:

- Que `noRestrictedImports` de Biome alcance para la regla entre features. Si no, la salida es
  ESLint ([0031](docs/decisiones/0031-biome-para-lint-y-formato.md)).
- ~~Que los tiles de OpenFreeMap expongan la infraestructura ciclista~~ — verificado y **no alcanzan**:
  las ciclovías se dibujan desde el API ([0038](docs/decisiones/0038-ciclovias-dibujadas-desde-el-api.md)).
