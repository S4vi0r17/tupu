# Commits

Conventional Commits, en **inglés** ([0022](../decisiones/0022-mensajes-de-commit-en-ingles.md)).
Adaptado de las convenciones del repo hermano `fulfillment-api`.

```
type(scope): subject

body opcional, también en inglés
```

## Tipos

Elegí el tipo por **el efecto del cambio**, no por si tocaste muchos archivos. `feat` es solo
funcionalidad nueva visible para quien usa la app.

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva. **Solo** si quien usa la app nota algo nuevo. |
| `fix` | Corrige comportamiento roto |
| `perf` | Mismo comportamiento, más rápido o más barato |
| `refactor` | Mismo comportamiento, mejor código |
| `docs` | Solo documentación — `docs/`, `*.md`, TSDoc |
| `test` | Solo tests |
| `chore` | Build, dependencias, config, Docker, despliegue |
| `style` | Formato sin efecto |

Agregá `!` antes de los dos puntos si rompe el contrato entre el API y la app:
`feat(contracts)!: return distance in meters, not kilometers`.

## Scope

Opcional pero preferido. La lista es cerrada — si hace falta uno nuevo, se agrega **acá** primero:

| Zona | Scopes |
|---|---|
| API ([0008](../decisiones/0008-apps-api-por-funcionalidad.md)) | `rides` · `routing` · `cycleways` · `identity` · `api` (transversal) |
| Móvil | `map` · `recording` · `compass` · `mobile` (transversal) |
| Paquetes ([0002](../decisiones/0002-layout-del-repo.md)) | `contracts` · `geo` |
| Datos e infra | `db` · `osm` · `valhalla` · `docker` · `deps` |

Omitilo si el cambio es transversal de verdad. Una lista cerrada evita que el mismo tema aparezca
como `route`, `routing` y `router` en tres commits.

## Subject

- **Máximo 72 caracteres**, apuntá a 50. `git log --oneline` corta lo demás.
- Imperativo, minúscula, sin punto final: `add`, no `added` ni `adds`.
- Decí **qué cambió**, no enumeres archivos ni repitas el diff.
- Prohibidos como verbo principal: `enhance`, `improve`, `update ... for better ...`. No dicen nada.
- Un commit = un cambio. **Si el subject necesita "and", son dos commits.**

```
❌ feat: add compass component and fix magnetometer noise and update map styles
✅ feat(compass): point the arrow at the destination
✅ fix(compass): smooth magnetometer readings with a low-pass filter

❌ feat: improve cycleway query performance
✅ perf(cycleways): use ST_DWithin instead of filtering in TypeScript

❌ chore: update stuff
✅ chore(deps): pin drizzle-orm to 0.44.2
```

## Body

Solo si el **por qué** no es obvio del subject. Breve, y únicamente lo que el diff no dice. Nada de
resumir archivo por archivo lo que ya se ve.

```
perf(cycleways): use ST_DWithin instead of filtering in TypeScript

The endpoint loaded every cycleway in Lima on each request and computed
distances in memory. With the GiST index the database answers in 3ms.
```

## Reglas propias de tupu

- **Las migraciones de Drizzle van en su propio commit**, nunca mezcladas con lógica. Son lo único
  del repo que no se puede revertir con un `git revert`
  ([0007](../decisiones/0007-drizzle-para-acceso-a-datos.md)).
- **Los cambios de `packages/contracts` también van solos.** Tocan el API y el móvil a la vez, y
  aislarlos es lo que permite ver de un vistazo cuándo cambió el contrato
  ([0002](../decisiones/0002-layout-del-repo.md)).
