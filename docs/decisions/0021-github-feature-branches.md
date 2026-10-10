# 0021 — GitHub, con rama por funcionalidad y pull request

Aceptada · 2026-09-08

## Contexto

Dokploy despliega desde un proveedor de git (0009). Y sin staging (0018), `main` es producción.

## Decisión

GitHub. Rama por funcionalidad y pull request a `main`, aunque lo apruebe quien lo abrió. Sin
`develop` ni `staging`: no hay otro entorno al que promover.

El PR es el único momento en que el cambio se lee entero antes de llegar a producción, y el lugar
donde colgar comprobaciones el día que existan (0023).

## Se paga

- Es ceremonia autoimpuesta: vale lo que valga leerse el diff.
- Un PR para una línea es desproporcionado.
- El código vive en un tercero, fuera del criterio de lo propio del resto del stack.

## Descartado

- **Directo a `main`.** Todo iría a producción sin filtro.
- **`develop` → `staging` → `main`.** Sin entornos detrás de cada rama, es ceremonia pura.
- **Gitea o Forgejo en el VPS.** Otro servicio compitiendo por la RAM con Valhalla.
