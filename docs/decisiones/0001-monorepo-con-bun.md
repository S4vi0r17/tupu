# 0001 — Monorepo con workspaces de Bun

Aceptada · 2026-09-08

## Contexto

Un API y una app móvil que se despliegan por separado, más el código que comparten. Había que
elegir entre un repo por pieza o uno solo, y el gestor de paquetes.

## Decisión

Un repo con workspaces de Bun. Sin pnpm ni Turborepo por ahora.

```jsonc
{ "workspaces": ["apps/*", "packages/*"] }
```

Las dependencias internas van como `"@tupu/geo": "workspace:*"`. Los scripts, con
`bun run --filter '@tupu/api' dev`.

- La app es el único cliente del API: un endpoint y su pantalla caben en un commit.
- El cliente tipado de Hono importa los tipos del API (0004). Entre repos habría que publicar un
  paquete en cada cambio.
- La matemática geográfica corre en los dos lados y se escribe una vez.
- El API ya corre en Bun: un binario para instalar y ejecutar.

## Se paga

- Sin caché de tareas: cambiar el móvil corre también lo del API. Hoy son segundos.
- El Dockerfile del API se construye desde la raíz, porque necesita el lockfile y `packages/`.
- Bun tiene menos rodaje que Node. La salida es el adaptador de Hono para Node, sin tocar rutas.
- El aislamiento entre paquetes depende del enlazador de Bun (0037).

## Descartado

- **Un repo por pieza.** Cada cambio de endpoint serían dos PRs coordinados y un paquete publicado.
- **Submódulos de git.** La ceremonia de varios repos y un puntero de commit que se olvida.
- **npm o yarn clásico.** Más lentos y sin nada que Bun no dé.
- **yarn con PnP.** Metro no lo soporta bien.
- **pnpm.** Aislaría las dependencias, pero Expo obliga a `node-linker=hoisted` y eso apaga la
  ventaja.
- **Nx.** Desproporcionado para dos apps y dos paquetes.
- **Turborepo.** Aplazado: se agrega encima cuando los tests dejen de correr en segundos.
- **Node.** Necesita compilar o `tsx`, y serían dos binarios. Queda como salida.
- **Deno.** Su compatibilidad con npm todavía roza con React Native.
