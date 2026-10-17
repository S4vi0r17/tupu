# tupu

App para ciclistas en Lima, proyecto personal. Este archivo es el punto de partida; el resto está
en [`docs/`](docs/README.md).

## Antes de empezar

1. [`docs/roadmap.md`](docs/roadmap.md): qué falta, y lo que bloquea pasar el APK o crear cuentas.
2. [`docs/conventions/workflow.md`](docs/conventions/workflow.md): ramas, qué doc se actualiza,
   nombres.

## Cómo trabajar

- Breve, simple, minimalista: en el código, los comentarios y los docs.
- No reabrir lo decidido. Cada decisión en [`docs/decisions/`](docs/decisions/) dice contra qué
  se comparó; para cambiarla se escribe una nueva que la reemplace.
- Separar lo que necesita el MVP ahora de lo que se agrega después.
- Preferir lo que hoy cuesta poco y evita una migración, aunque no sea lo más barato hoy.
- Explicar antes de pedir una decisión: qué es la herramienta y qué problema de tupu resuelve,
  con el ejemplo real. Después las opciones, cada una con lo que se paga.

## Reglas

| | |
|---|---|
| Comentarios de una línea, solo lo no obvio | [comments.md](docs/conventions/comments.md) |
| Commits en inglés, sin trailers ni firmas | [commits.md](docs/conventions/commits.md) |
| Los docs, en el mismo commit que el código | [workflow.md](docs/conventions/workflow.md) |
| Ningún doc fuera de la estructura | [docs.md](docs/conventions/docs.md) |
| Qué se usa y qué no; tests, no sin hablarlo | [stack.md](docs/stack.md) |
| Qué puede importar a qué | [architecture.md](docs/architecture.md#el-repo) |
