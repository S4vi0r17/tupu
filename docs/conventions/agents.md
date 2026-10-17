# Herramientas de IA

`AGENTS.md` es la única fuente de instrucciones. Cada herramienta lo recibe así:

| Herramienta | Cómo lee las instrucciones | Configuración |
|---|---|---|
| Claude Code | `CLAUDE.md`, symlink a `AGENTS.md` | `.claude/settings.json`: permisos, atribución y formato |
| Codex | `AGENTS.md` | `.codex/config.toml`: aprobación y sandbox |
| Copilot, Windsurf, Cline, Zed | `AGENTS.md` | |

`.claude/rules/` son symlinks a las convenciones, para las herramientas que cargan reglas por
carpeta.

## Skills y agentes

La fuente está en `.claude/skills/<nombre>/`. `.agents/skills/<nombre>` es un symlink a ella:
ahí buscan Codex, Copilot y VS Code. Una nueva se crea en `.claude/skills/` y se enlaza con
`ln -s ../../.claude/skills/<nombre> .agents/skills/<nombre>`.

| | Qué hace |
|---|---|
| `/new-spec` | Una regla nueva o corregida, con SDD |
| `/new-decision` | Una decisión, con su formato, índice y reemplazos |
| Agente `sdd` | Implementa reglas dentro de un alcance de archivos, sin commitear |

## Worktrees

Claude Code con `--worktree` y Codex le dan a cada agente su worktree. Los de Claude Code van en
`.claude/worktrees/`, que git ignora. En cada uno, `bun install` una vez: instala y activa los
hooks.

Lint y tipos corren en paralelo sin problema. Solo un worktree levanta `infra:up` y `dev:api`: el
compose fija el nombre del proyecto y los puertos.

## Restricciones

- Ninguna herramienta añade atribución de IA a commits ni a PR.
- Ninguna guarda reglas en su memoria local: lo que se aprende va a `docs/`, para que cualquiera
  lo encuentre sin depender de un agente.
- Prohibidos en Claude Code: `push --force`, `--no-verify` y leer o editar los `.env`.
- Piden confirmación: `git push`, `git reset --hard`, `git clean`, `rm -rf`, `infra:down` y
  `osm:update`.
- Codex corre con sandbox `workspace-write` y pide aprobación (`on-request`).
- Cada edición de Claude Code pasa por el formato de Biome (`.claude/hooks/format.sh`).

`scripts/check-agents.sh` comprueba que nada de esto se rompa: symlinks, tamaño de `AGENTS.md` y
skills enlazadas. Lo corre `bun run check`.
