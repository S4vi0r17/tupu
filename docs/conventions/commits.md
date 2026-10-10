# Commits

Conventional Commits, en inglés (0022).

```
type(scope): subject

body opcional
```

## Tipo

Por el efecto del cambio.

| Tipo | Cuándo |
|---|---|
| `feat` | Algo nuevo que nota quien usa la app |
| `fix` | Corrige algo roto |
| `perf` | Lo mismo, más rápido o más barato |
| `refactor` | Lo mismo, mejor código |
| `docs` | Solo documentación |
| `chore` | Build, dependencias, config, Docker, despliegue |
| `style` | Formato |

`!` antes de los dos puntos si rompe el contrato entre el API y la app.

## Scope

Lista cerrada. Uno nuevo se agrega acá primero.

| Zona | Scopes |
|---|---|
| API | `rides` · `routing` · `cycleways` · `identity` · `api` |
| Móvil | `map` · `recording` · `compass` · `voice` · `mobile` |
| Paquetes | `contracts` · `geo` |
| Datos e infra | `db` · `osm` · `valhalla` · `docker` · `deps` |

Sin scope si el cambio es transversal.

## Subject

- 72 caracteres como máximo, mejor 50.
- Imperativo, minúscula, sin punto: `add`, no `added`.
- Qué cambió, no qué archivos.
- Nada de `improve`, `enhance` o `update ... for better ...`.
- Si necesita «and», son dos commits.

```
feat(compass): point the arrow at the destination
perf(cycleways): use ST_DWithin instead of filtering in TypeScript
```

## Body

Solo el porqué, si el subject no lo dice.

## Reglas

- Sin trailers: ni `Co-Authored-By`, ni enlaces de sesión, ni firmas de herramientas.
- Las migraciones de Drizzle, en su propio commit: no se revierten con `git revert` (0007).
