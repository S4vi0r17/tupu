# Stack

Cada capa, su rival más cercano y por qué ganó. El detalle está en cada decisión.

| Capa | Elegido | Rival | Por qué | |
|---|---|---|---|---|
| Repositorio | Monorepo | Un repo por pieza | Un endpoint y su pantalla caben en un commit | 0001 |
| Runtime y paquetes | Bun | Node, pnpm | Un binario para instalar y ejecutar | 0001, 0037 |
| Layout | `apps/` `packages/` `infra/` `docs/` | Todo plano | Lo compartido no puede importar de las apps | 0002 |
| Idioma | Código en inglés, comentarios en español | Todo en español | El dominio llega en inglés desde OSM | 0003 |
| Commits | Conventional Commits en inglés | En español | Igual que el repo hermano | 0022 |
| Git | Rama por funcionalidad con PR | Directo a main | Sin staging, el PR es la única revisión | 0021 |
| CI | Ninguno; Dokploy despliega al mergear | GitHub Actions | Sin tests no hay qué correr | 0023 |
| API | Hono | Fastify, Elysia | Cliente RPC tipado sin generar código | 0004 |
| Móvil | Expo | Flutter | Mismo lenguaje y tipos que el API | 0005 |
| Interior del móvil | Expo Router, Zustand, TanStack Query | React Navigation, Redux | Reintentos y caché con señal intermitente | 0014 |
| Estilos | NativeWind 5 | `StyleSheet` | Tailwind en React Native | 0036 |
| Mapa | MapLibre | Mapbox, react-native-maps | Estilo por capa, sin token | 0005 |
| Tiles del mapa | OpenFreeMap | Protomaps propio | Cambiar es cambiar una URL | 0016 |
| Ciclovías en el mapa | GeoJSON del API, entero | Del tile, por recuadro | El tile no trae carriles; la red pesa 84 KB | 0038, 0041 |
| Ruteo | Valhalla propio | GraphHopper, OSRM | Perfil por petición, sin reconstruir el grafo | 0006 |
| Perfil ciclista | `use_roads` y `use_hills` bajos | Valores por defecto | Rutas tranquilas antes que cortas | 0029 |
| Base de datos | PostgreSQL + PostGIS | `jsonb` | Hoy es una línea del compose; después, una migración | 0011 |
| Acceso a datos | Drizzle | Prisma | Prisma no lee bien columnas geométricas | 0007 |
| Contratos | Zod | Valibot, TypeBox | El esquema valida y da el tipo | 0032 |
| Lint y formato | Biome | ESLint + Prettier | Una herramienta, y hace cumplir las dependencias | 0031 |
| Datos de OSM | Extracto de Geofabrik | Overpass en vivo | El mismo archivo que usa Valhalla | 0012, 0020 |
| Despliegue | Dokploy en un VPS | — | Valhalla necesita RAM fija | 0009 |
| Entornos | Producción y local | Staging | No hay usuarios que proteger | 0018 |
| Plataforma | Android con Google Play Services | iOS, Android sin Google | iOS no compila en Linux; la voz necesita GPS en segundo plano | 0019, 0040 |
| Guardado en el teléfono | SQLite con Drizzle | AsyncStorage | Cada punto se guarda al llegar | 0013, 0033 |
| GPS en segundo plano | `expo-location` | `react-native-background-geolocation` | Gratis, y SQLite cubre las caídas | 0015 |
| Brújula | Rumbo del sistema, suavizado | Magnetómetro crudo | Android ya compensa la inclinación | 0025, 0027 |
| Cámara | Tres modos con un botón | Dos modos | El intermedio evita que el mapa tiemble parado | 0039 |
| Destino | Tocar el mapa o pegar coordenadas | Buscar por nombre | Sin infraestructura nueva | 0028 |
| Límite de uso | Ninguno todavía | Middleware de Hono | Bloqueante antes de repartir el APK | 0030 |
| Tests | Ninguno todavía | `bun test` | Hasta el primer error de cálculo en la calle | 0024 |

Dos criterios cruzan la tabla. El tipado va de punta a punta, para que un cambio rompa al
compilar y no en la calle. Y donde Bun es la apuesta, lo de encima es portable: Hono corre
también en Node.
