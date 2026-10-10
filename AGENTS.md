# tupu

Instrucciones para agentes de IA en este repo.

Proyecto personal: una app para ciclistas en Lima. Leer primero [`docs/planeacion.md`](docs/planeacion.md).

## Cómo trabajar

- **No reabrir lo decidido.** Cada decisión en [`docs/decisiones/`](docs/decisiones/) dice contra
  qué se comparó. Para cambiarla se escribe una nueva que la reemplace.
- Separar lo que necesita el MVP ahora de lo que se agrega después.
- Preferir lo que hoy cuesta poco y evita una migración, aunque no sea lo más barato hoy.
- Explicar antes de pedir una decisión: qué es la herramienta y qué problema de tupu resuelve,
  con el ejemplo real. Después las opciones, cada una con lo que se paga.

## Stack

| | Se usa | No usar |
|---|---|---|
| Runtime y paquetes | Bun (0001) | npm, pnpm, yarn, Node |
| API | Hono (0004) | Express, NestJS |
| Base de datos | PostgreSQL + PostGIS (0011) | `jsonb` para geometrías |
| Acceso a datos | Drizzle, también en el móvil (0007, 0033) | Prisma, SQL suelto |
| Contratos | Zod (0032) | tipos escritos a mano |
| Lint y formato | Biome (0031) | ESLint, Prettier |
| Móvil | Expo Router, Zustand, TanStack Query (0014) | Redux, Context para estado compartido |
| Estilos | NativeWind 5 con Tailwind 4 (0036) | `StyleSheet` a secas |
| Mapa | MapLibre + OpenFreeMap (0005, 0016) | react-native-maps, Mapbox |
| Ruteo | Valhalla propio (0006) | OSRM, Google, Mapbox |
| Tests | Ninguno todavía (0024) | agregar tests sin hablarlo |

## Idiomas

En inglés: identificadores, archivos, ramas, campos del API, tablas y commits (0022).
En español: comentarios, `docs/` y los textos de la app (0003).

## Dependencias

```
apps/*      →  packages/*                    sí
packages/*  →  apps/*                        no
apps/api    ↔  apps/mobile                   no, salvo el tipo AppType
features/x  →  features/y/cualquier-cosa     no, solo su index.ts
```

Lo hace cumplir Biome (0002, 0008). Si se tocan esas reglas, se prueban rompiéndolas a propósito:
una regla mal escrita no dispara y parece verde.

## Convenciones

- [Commits](docs/conventions/commits.md): sin trailers de coautoría ni firmas de herramientas.
- [Comentarios](docs/conventions/comments.md): una línea, solo lo que el código no dice.
- [Documentación](docs/conventions/docs.md): corta y sin relleno.

## Bloqueantes

- Límite de uso en el API antes de pasarle el APK a otra persona: lleva la URL dentro (0030).
- Backups antes de la primera cuenta de usuario (0017).
