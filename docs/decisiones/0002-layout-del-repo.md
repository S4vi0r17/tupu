# 0002 — Layout del repositorio

Aceptada · 2026-09-08

## Contexto

Con el monorepo (0001), faltaba decidir las carpetas de la raíz y qué puede importar qué.

## Decisión

```
apps/api            @tupu/api        el servidor
apps/mobile         @tupu/mobile     la app
packages/contracts  @tupu/contracts  lo que viaja entre los dos
packages/geo        @tupu/geo        matemática geográfica
infra/                               docker, base de datos, ruteo
docs/
```

`apps/*` importa de `packages/*`. Nunca al revés, y las apps no se importan entre sí. Lo hace
cumplir el linter.

`contracts` y `geo` van separados porque cambian a ritmos distintos: `geo` casi nunca, `contracts`
con cada endpoint.

Los paquetes no se compilan: Bun y Metro leen TypeScript directo.

## Se paga

- Metro necesita configuración para encontrar la raíz del monorepo, y sus errores ahí son malos.
- Dos paquetes que empiezan chicos: la ceremonia llega antes que el beneficio.

## Descartado

- **Todo plano (`api/`, `mobile/`, `shared/`).** Nada impide que `shared/` termine importando de
  `api/`.
- **Un solo `@tupu/core`.** Cada cambio de endpoint invalidaría también la matemática.
