#!/usr/bin/env bash
# Formatea el archivo que acaba de editar Claude Code, con la configuración de Biome del repo.
file=$(bun -e 'const input = await Bun.stdin.json(); console.log(input.tool_input?.file_path ?? "")')
case "$file" in
  *.ts | *.tsx | *.js | *.json | *.css) ;;
  *) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR" || exit 0
bunx biome format --write --no-errors-on-unmatched "$file" > /dev/null || exit 2
