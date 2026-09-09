# El stack, de un vistazo

Qué se eligió en cada capa, contra qué se comparó y en una línea por qué. **El razonamiento
completo, con lo que se paga por cada elección, está en el documento de decisión enlazado** — esto
es solo el mapa para no tener que abrir ocho archivos.

| Capa | Elegido | El rival más cercano | Por qué se ganó |
|---|---|---|---|
| Repositorio | Monorepo | Un repo por pieza | La app es el único consumidor del API: un cambio de endpoint y su pantalla caben en un commit · [0001](decisiones/0001-monorepo-con-bun.md) |
| Paquetes | Workspaces de Bun | pnpm | pnpm aislaría de verdad, pero Expo obliga a `node-linker=hoisted` y eso apaga justo su ventaja · [0001](decisiones/0001-monorepo-con-bun.md) |
| Runtime | Bun | Node | Un solo binario para instalar, ejecutar y testear. Node queda como plan de salida · [0001](decisiones/0001-monorepo-con-bun.md) |
| Tareas / caché | Nada por ahora | Turborepo, Nx | Aplazado, no descartado: se añade encima cuando los tests dejen de correr en segundos · [0001](decisiones/0001-monorepo-con-bun.md) |
| Layout del repo | `apps/` `packages/` `infra/` `docs/` | Todo plano | Con todo al mismo nivel nada impide que lo compartido importe del API, y con el tiempo lo hará · [0002](decisiones/0002-layout-del-repo.md) |
| Idioma | Inglés en el código, español en los comentarios | Todo en español | El dominio llega en inglés desde OSM: traducirlo en cada capa es un mapeo más que mantener · [0003](decisiones/0003-idioma-del-codigo.md) |
| Commits | Conventional Commits en inglés | Español, como decía 0003 | Coherencia con el repo hermano `fulfillment-api`, que se lee saltando entre proyectos · [0022](decisiones/0022-mensajes-de-commit-en-ingles.md) |
| Git | GitHub, rama por funcionalidad con PR | Directo a main; `develop`/`staging` | Sin staging, el PR es el único momento en que el cambio se mira entero · [0021](decisiones/0021-github-rama-por-funcionalidad.md) |
| CI y deploy | Sin CI; Dokploy despliega al mergear | Actions con typecheck y lint | No configurar CI antes de que exista código; la salida es un archivo · [0023](decisiones/0023-sin-ci-dokploy-despliega.md) |
| Framework del API | Hono | Fastify, Elysia, NestJS | El cliente RPC tipado: cambiar el servidor rompe la compilación del móvil, sin generación de código · [0004](decisiones/0004-hono-en-el-api.md) |
| Alcance del MVP | Mapa, ruta, grabación local y brújula | Cuentas desde el inicio | Validar primero que Valhalla dé rutas ciclistas decentes en Lima · [0010](decisiones/0010-alcance-del-mvp.md) |
| Móvil | Expo (React Native) | Flutter | Flutter rinde mejor, pero Dart rompe el monorepo y los tipos compartidos pasan a ser codegen · [0005](decisiones/0005-expo-en-el-movil.md) |
| Mapa | MapLibre GL Native | SDK de Mapbox, `react-native-maps` | Control del estilo por capa y paquetes offline, sin token ni facturación · [0005](decisiones/0005-expo-en-el-movil.md) |
| Motor de ruteo | Valhalla, self-hosted | GraphHopper | Único con costeo dinámico por petición + alternativas + isócronas + map matching sin rehornear el grafo · [0006](decisiones/0006-valhalla-para-ruteo.md) |
| Acceso a datos | Drizzle | Prisma | La tabla central es geoespacial, y Prisma la lee incompleta y la escribe siempre por SQL crudo · [0007](decisiones/0007-drizzle-para-acceso-a-datos.md) |
| Interior de `apps/api` | Por funcionalidad | Por capas técnicas | Dos de las cuatro áreas no son el triple controller/service/repository · [0008](decisiones/0008-apps-api-por-funcionalidad.md) |
| Plataformas del MVP | Solo Android | Android + iOS | En Linux no se puede compilar iOS: cuenta de Apple de 99 USD/año y builds en la nube para cada prueba · [0019](decisiones/0019-mvp-solo-android.md) |
| Entornos | Solo producción y local | Staging | Valhalla ya se come la RAM del VPS, y no hay usuarios que proteger · [0018](decisiones/0018-sin-entorno-de-pruebas.md) |
| Despliegue | Dokploy sobre un VPS | — | Decidido por el equipo. Confirma el self-host de Valhalla y quita el problema de RAM · [0009](decisiones/0009-despliegue-en-dokploy.md) |
| Base de datos | PostgreSQL con PostGIS | Postgres con `jsonb`, SpatiaLite | Adoptarlo hoy cuesta una línea del compose; adoptarlo después cuesta migrar datos y reescribir consultas · [0011](decisiones/0011-postgis-desde-el-inicio.md) |
| Datos de ciclovías | Extracto de Geofabrik, script manual | Overpass API en vivo | El mismo `.pbf` de Perú que Valhalla ya necesita, y sin depender de servidores públicos saturados · [0012](decisiones/0012-ingesta-de-osm-por-extracto.md) |
| Actualización de datos | Un comando que hace PostGIS y Valhalla | Construir el grafo en local y subirlo | Salen de la misma descarga, así que no pueden desincronizarse · [0020](decisiones/0020-actualizacion-de-datos-en-un-comando.md) |
| Tiles del mapa | OpenFreeMap en el MVP | Protomaps self-host, MapTiler | Cambiar de proveedor es cambiar una URL: montar servidor propio hoy compra muy poco · [0016](decisiones/0016-tiles-openfreemap-en-el-mvp.md) |
| Guardado en el teléfono | SQLite con `expo-sqlite` | AsyncStorage, archivos GeoJSON | Los puntos se insertan al llegar: una caída a los 40 min pierde segundos, no el recorrido · [0013](decisiones/0013-recorrido-en-sqlite-local.md) |
| Interior del móvil | Expo Router + Zustand + TanStack Query | React Navigation + Context, Redux | Con señal intermitente las peticiones fallan de rutina, y eso no puede ser código propio esparcido · [0014](decisiones/0014-expo-router-zustand-tanstack-query.md) |
| GPS en segundo plano | `expo-location` + tarea de fondo | `react-native-background-geolocation` (de pago) | No evita que Android mate la tarea; junto con SQLite hace que importe poco · [0015](decisiones/0015-grabacion-en-segundo-plano.md) |
| Brújula, qué dibuja | Cono de visión + mapa que rota al grabar | Flecha al destino; mapa siempre al norte | El teléfono va en el portacelular: el mapa está delante y falta saber cómo orientarse en él · [0027](decisiones/0027-brujula-muestra-hacia-donde-miras.md) |
| Brújula, de dónde sale | `watchHeadingAsync` + filtro circular | Magnetómetro crudo; rumbo del GPS | El sistema ya fusiona los sensores y compensa la inclinación del portacelular · [0025](decisiones/0025-brujula-heading-fusionado.md) |
| Elegir destino | Tocar el mapa o pegar coordenadas | Geocodificador (Nominatim, Photon) | Cero infraestructura nueva; pegar de Google Maps cubre el caso preciso · [0028](decisiones/0028-destino-por-mapa-o-coordenadas.md) |
| Perfil de ruteo | `use_roads` y `use_hills` bajos | Los valores por defecto de Valhalla | Es la premisa de la app escrita en números; tercerizar el criterio es tercerizar el producto · [0029](decisiones/0029-perfil-ciclista-de-valhalla.md) |
| Dibujo de ciclovías | Desde el tile, solo el estilo | Desde el API leyendo PostGIS | Cero peticiones al arrastrar el mapa, que es donde una capa propia se sentiría lenta · [0026](decisiones/0026-ciclovias-dibujadas-desde-el-tile.md) |
| Lint y formato | Biome | ESLint + Prettier, oxlint | Una herramienta y un comando; es lo que hace cumplir la regla de dependencia de 0002 · [0031](decisiones/0031-biome-para-lint-y-formato.md) |
| Validación y contratos | Zod | Valibot, TypeBox, ArkType | El esquema valida y genera el tipo: una sola fuente, con precedente en el repo hermano · [0032](decisiones/0032-zod-en-contracts.md) |
| SQLite del teléfono | Drizzle, igual que el servidor | SQL plano con `expo-sqlite` | Un solo estilo en las dos bases, y sus live queries conectan la tarea de fondo con la pantalla · [0033](decisiones/0033-drizzle-tambien-en-el-telefono.md) |
| Límite de uso del API | Ninguno en el MVP | Middleware de Hono, Traefik | Decisión consciente; **bloqueante antes de repartir el APK** · [0030](decisiones/0030-sin-limite-de-uso-en-el-api.md) |
| Tests | Ninguno durante el MVP | `bun test` sobre `packages/geo` | Decisión consciente por velocidad; el disparador es el primer error de cálculo en la calle · [0024](decisiones/0024-sin-tests-durante-el-mvp.md) |

## Aplazado, con disparador

Nada aquí está sin decidir: está decidido que se hace después. Los disparadores, en
[planeacion](planeacion.md).

| Capa | Estado |
|---|---|

| CI en GitHub Actions | Aplazado con disparador · [0023](decisiones/0023-sin-ci-dokploy-despliega.md) |
| Backups | Aplazados con disparador: la primera cuenta · [0017](decisiones/0017-backups-aplazados-con-disparador.md) |
| iOS | Después del MVP · [0019](decisiones/0019-mvp-solo-android.md) |
| Suavizado de la brújula y estilo del mapa | Pendiente, ambos dentro del MVP |
| Self-host de tiles | Aplazado con disparador: el uso sin señal · [0016](decisiones/0016-tiles-openfreemap-en-el-mvp.md) |
| Autenticación y sincronización | Fuera del MVP · [0010](decisiones/0010-alcance-del-mvp.md) |
| Tests | Aplazado a propósito, al final de la planeación |
| Backups y reconstrucción de tiles | Pendiente, abiertos por [0009](decisiones/0009-despliegue-en-dokploy.md) |
| CI y distribución de la app | Pendiente |

## Dos hilos que atraviesan todo

Vale la pena verlos juntos, porque explican varias decisiones que por separado parecen
inconexas.

**El tipado extremo a extremo.** Monorepo → Bun → Hono con su cliente RPC → Drizzle. Cada eslabón
se eligió para que un cambio rompa en compilación y no en producción. Es también por lo que se
descartó Flutter (rompe la cadena en Dart) y por lo que Prisma perdió (rompe la cadena justo en la
columna geométrica).

**No atarse dos veces a lo mismo.** Bun es la pieza menos probada del stack, así que en las capas
de encima se prefirió lo portable: Hono sobre Elysia porque Elysia es solo Bun, y Node queda como
salida sin reescribir rutas. Lo mismo con el ruteo: Valhalla propio, pero eligiendo el motor que
además se puede alquilar hospedado con la misma API si el self-host duele.
