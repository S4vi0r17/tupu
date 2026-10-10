# tupu

Instrucciones para agentes de IA en este repo.

Proyecto personal: una app para ciclistas en Lima. Leer primero
[`docs/roadmap.md`](docs/roadmap.md) y [`docs/conventions/workflow.md`](docs/conventions/workflow.md).

## Cómo trabajar

- **No reabrir lo decidido.** Cada decisión en [`docs/decisions/`](docs/decisions/) dice contra
  qué se comparó. Para cambiarla se escribe una nueva que la reemplace.
- Separar lo que necesita el MVP ahora de lo que se agrega después.
- Preferir lo que hoy cuesta poco y evita una migración, aunque no sea lo más barato hoy.
- Explicar antes de pedir una decisión: qué es la herramienta y qué problema de tupu resuelve,
  con el ejemplo real. Después las opciones, cada una con lo que se paga.
- Seguir el [flujo de trabajo](docs/conventions/workflow.md): los docs se actualizan en el mismo
  commit que el código, y nada se crea fuera de la estructura de [docs.md](docs/conventions/docs.md).

## Stack

Lo que se usa y lo que no, en [`docs/stack.md`](docs/stack.md). Tests: ninguno todavía, y no se
agregan sin hablarlo (0024).

## Dependencias

```
apps/*      →  packages/*                    sí
packages/*  →  apps/*                        no
apps/api    ↔  apps/mobile                   no, salvo el tipo AppType
features/x  →  features/y/cualquier-cosa     no, solo su index.ts
```

Lo hace cumplir Biome (0002, 0008). Si se tocan esas reglas, se prueban rompiéndolas a propósito:
una regla mal escrita no dispara y parece verde.

## Convenciones

- [Flujo de trabajo](docs/conventions/workflow.md): ramas, qué doc se actualiza, nombres.
- [Commits](docs/conventions/commits.md): en inglés, sin trailers de coautoría ni firmas.
- [Comentarios](docs/conventions/comments.md): una línea, solo lo que el código no dice.
- [Documentación](docs/conventions/docs.md): dónde va cada cosa, estilo y decisiones.

## Bloqueantes

- Límite de uso en el API antes de pasarle el APK a otra persona: lleva la URL dentro (0030).
- Backups antes de la primera cuenta de usuario (0017).
