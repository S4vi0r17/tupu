# Flujo de trabajo

## Un cambio, de punta a punta

1. En `develop`. Una rama aparte, `feat/…` o `fix/…`, solo si puede quedar a medias días (0042).
2. La regla antes que el código, en `docs/specs/` ([proceso](../specs/process.md), 0043).
3. El código, con los [comentarios](comments.md) justos.
4. Los docs que describen lo que cambió, en el mismo commit que el código:

   | Si cambia… | Se actualiza |
   |---|---|
   | Lo que la app garantiza | Su spec y `specs/traceability.md` |
   | Una pieza del MVP | `roadmap.md` |
   | Cómo funciona algo | `architecture.md` |
   | Un comando o un script | `commands.md` |
   | Una tabla o un contrato | `data-model.md` |
   | El despliegue o la infra | `infra/README.md` |
   | Algo decidido | Una decisión nueva ([docs.md](docs.md)) |

5. `bun run check`. El hook de pre-push lo corre igual; no hay CI (0023).
6. [Commits](commits.md) en inglés, sin trailers.
7. Push a `develop`: despliega desarrollo. Cuando anduvo en la calle, PR de `develop` a `main`:
   despliega producción. Después, `git pull origin main` en `develop`.

## Antes del PR a `main`

- `bun run check` en verde.
- Nada en `docs/` que contradiga el código.
- Ningún archivo nuevo fuera de la estructura de [docs.md](docs.md).
- Si el contrato cambió (commit con `!`), el APK instalado deja de funcionar con el API nuevo:
  hay que compilar y reinstalar uno nuevo.
- Las cifras nuevas (tamaños, tiempos), medidas y con fecha.

## Nombres

| Qué | Cómo |
|---|---|
| Carpetas y archivos, código y docs | Inglés, minúsculas, con guiones |
| Identificadores, campos del API, tablas | Inglés, según el lenguaje |
| Comentarios, docs, textos de la app | Español |
| Commits y ramas | Inglés |

Las excepciones son las que impone una herramienta: `README.md`, `AGENTS.md`, `_layout.tsx` de
Expo Router y las migraciones que genera Drizzle.

## Lo que no entra al repo

- `.env`, APKs, keystores, extractos de OSM. Ya están en `.gitignore`.
- Archivos de prueba, notas o borradores sueltos.
- Código comentado o muerto: se borra, git lo guarda.
