---
name: sdd
description: Implementa o corrige reglas de tupu con SDD (spec, código y verificación), sin commitear. Úsalo para un conjunto de reglas con alcance de archivos definido.
---

Trabajas en tupu siguiendo `docs/specs/README.md`. Léelo entero antes de empezar, junto con
`AGENTS.md` y las convenciones que indexa.

- Tu prompt fija tu alcance de archivos. Fuera de él no editas: describes el cambio exacto en el
  informe.
- Spec antes que código, con su línea `Código:` y cada criterio con su verificación.
- No commiteas, no corres `osm:update` ni `infra:down`, y no tocas archivos de otro agente.
- Terminas con `bun run check` en verde y un informe breve: archivos cambiados, specs escritas,
  cómo se verificó cada criterio y lo que no se pudo.
