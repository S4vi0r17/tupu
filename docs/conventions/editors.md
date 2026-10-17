# Editores

VS Code y Zed traen las mismas tareas: `bun run check:agents` falla si sus nombres no coinciden.
Una tarea no tiene lógica propia: llama a un comando de `package.json`, el mismo que corren los
hooks.

| Tarea | Qué corre |
|---|---|
| Verificar | `bun run check`: lint, tipos y agentes |
| Formatear | `bun run lint:fix` |
| Levantar PostGIS | `bun run infra:up` |
| API en desarrollo | `bun run dev:api`, en el puerto 3001 |
| Metro | `bun run dev:mobile` |
| Preparar el clon | `bun install`: dependencias y hooks |

Se corren con `Ctrl+Shift+P`, «Tasks: Run Task» en VS Code y «task: spawn» en Zed. En VS Code,
`Ctrl+Shift+B` lanza «Verificar», y «Preparar el clon» corre al abrir la carpeta; VS Code pregunta
una vez si se permite.

## VS Code

`.vscode/settings.json` formatea con Biome al guardar. Las extensiones recomendadas, en
`.vscode/extensions.json`: Biome, Bun, Expo y Tailwind. Prettier y ESLint quedan como no deseadas
(0031).

## Otros

JetBrains, Neovim, Helix y cualquiera con EditorConfig leen `.editorconfig`. Las tareas se corren
desde la terminal con los mismos comandos. La versión de Bun está en `.bun-version`.
