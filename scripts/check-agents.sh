#!/usr/bin/env bash
# Comprueba que la configuración de agentes y editores esté entera.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

errors=()

[ -f AGENTS.md ] || errors+=("falta AGENTS.md")
[ -f AGENTS.md ] && [ "$(wc -c < AGENTS.md)" -gt 32768 ] &&
  errors+=("AGENTS.md supera los 32 KiB que lee Codex")
[ "$(readlink CLAUDE.md)" = "AGENTS.md" ] || errors+=("CLAUDE.md debe ser un symlink a AGENTS.md")

for convention in docs/conventions/*.md; do
  name=$(basename "$convention")
  [ "$(readlink ".claude/rules/$name")" = "../../$convention" ] ||
    errors+=(".claude/rules/$name debe enlazar a $convention")
done

for link in .claude/rules/*.md .agents/skills/*; do
  [ -e "$link" ] || errors+=("$link apunta a algo que no existe")
done

for skill in .claude/skills/*/; do
  name=$(basename "$skill")
  [ "$(readlink ".agents/skills/$name")" = "../../.claude/skills/$name" ] ||
    errors+=(".agents/skills/$name debe enlazar a .claude/skills/$name")
done

bun -e '
  const vscode = (await Bun.file(".vscode/tasks.json").json()).tasks.map((task) => task.label)
  const zed = (await Bun.file(".zed/tasks.json").json()).map((task) => task.label)
  process.exit(vscode.toSorted().join() === zed.toSorted().join() ? 0 : 1)
' || errors+=("las tareas de .vscode/tasks.json y .zed/tasks.json no coinciden")

[ "${#errors[@]}" -eq 0 ] && exit 0
printf '%s\n' "${errors[@]}" >&2
exit 1
