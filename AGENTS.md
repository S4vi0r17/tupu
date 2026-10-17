# tupu: instrucciones para agentes

Instrucciones para agentes de IA en este repo. `CLAUDE.md` es un symlink a este archivo; Codex,
Copilot, Windsurf, Cline y Zed leen `AGENTS.md`.

App para ciclistas en Lima, proyecto personal: ciclovías en el mapa, rutas en bici con voz en cada
giro y recorridos grabados. Monorepo de Bun: API en Hono con PostGIS y Valhalla, app en Expo con
MapLibre.

## Convenciones

Una por tema. Leer la que aplique antes de tocar algo:

| Convención | Aplica a |
|---|---|
| [`workflow.md`](docs/conventions/workflow.md) | Cómo se trabaja: ramas, spec, docs, verificar y reportar. **Obligatoria** |
| [`specs/`](docs/specs/README.md) | Todo cambio de comportamiento: la regla antes que el código (SDD) |
| [`commits.md`](docs/conventions/commits.md) | Todo mensaje de commit y los hooks |
| [`comments.md`](docs/conventions/comments.md) | Comentarios y TSDoc |
| [`docs.md`](docs/conventions/docs.md) | Dónde va cada doc, su estilo y las decisiones |
| [`agents.md`](docs/conventions/agents.md) | Qué lee cada herramienta de IA y qué tiene prohibido |
| [`editors.md`](docs/conventions/editors.md) | Tareas de VS Code y Zed |
| [`stack.md`](docs/stack.md) | Qué se usa y qué no |
| [`architecture.md`](docs/architecture.md) | El repo, qué puede importar a qué y cómo funciona |
| [`roadmap.md`](docs/roadmap.md) | Lo que falta, y lo que bloquea pasar el APK o crear cuentas |

## Cómo trabajar

- El repo es la única fuente de verdad. Decisiones, specs y reglas viven aquí, nunca en la
  memoria de un agente: lo que valga la pena recordar se escribe en `docs/`.
- Breve, simple, minimalista: en el código, los comentarios y los docs.
- No reabrir lo decidido. Cada decisión en [`docs/decisions/`](docs/decisions/) dice contra qué
  se comparó; para cambiarla se escribe una nueva que la reemplace.
- Separar lo que necesita el MVP ahora de lo que se agrega después.
- Preferir lo que hoy cuesta poco y evita una migración, aunque no sea lo más barato hoy.
- Explicar antes de pedir una decisión: qué es la herramienta y qué problema de tupu resuelve,
  con el ejemplo real. Después las opciones, cada una con lo que se paga.

## Verificar y commitear

`bun install` activa los hooks. Antes de commitear, `bun run check` en verde: lint, tipos y la
configuración de agentes. Commits en inglés, sin coautor ni atribución de IA. Solo se commitea
cuando se pide, el push solo si se pide de forma explícita, y nunca `--no-verify`.

## Arrancar

```sh
bun run infra:up && bun run dev:api    # PostGIS y el API en el puerto 3001
bun run dev:mobile                     # Metro, para la build de desarrollo
```

La primera vez, el [README](README.md).
