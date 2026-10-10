# 0031 — Biome para lint y formato

Aceptada · 2026-09-08

## Contexto

0002 y 0008 dicen que la regla de dependencia la hace cumplir el linter, pero nunca se eligió
uno. Sin regla, el móvil puede terminar importando el cliente de Postgres.

## Decisión

Biome para lint y formato en todo el monorepo: una herramienta en vez de ESLint y Prettier, y
rápida, que importa cuando se corre a mano antes de cada PR (0023).

La regla de dependencia va con `noRestrictedImports`. Verificado: alcanza también para la regla
entre features de 0008, con `patterns` y grupos estilo gitignore, y para el único cruce entre
apps permitido, el tipo `AppType`.

## Se paga

- Ecosistema de plugins mucho más chico. No hay equivalente a `eslint-plugin-boundaries`.
- Menos reglas de React y React Native que ESLint.
- Si falta una regla, la salida es ESLint encima: dos herramientas otra vez.

## Descartado

- **ESLint y Prettier.** Lo más capaz para esta regla, pero dos herramientas, más configuración y
  más lentas.
- **oxlint y Prettier.** Como el repo hermano, pero sigue siendo dos herramientas.
