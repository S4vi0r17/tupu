# Documentación

El contenido en español; los nombres de archivos y carpetas en inglés, en minúsculas y con guiones
(`data-model.md`, `0041-cycleways-in-one-request.md`).

## Dónde va cada cosa

```
README.md                 qué es tupu y cómo levantarlo
AGENTS.md                 instrucciones para agentes de IA
infra/README.md           despliegue y tamaño del VPS
docs/
  README.md               índice
  roadmap.md              estado del MVP, pendientes, aplazados
  architecture.md         cómo funciona cada pieza
  stack.md                qué se usa y qué no
  commands.md             qué corre cada comando
  data-model.md           tablas y contratos
  glossary.md             términos
  decisions/              una decisión por archivo, con su índice
  conventions/            commits, comentarios, docs, flujo de trabajo
```

No se crean documentos nuevos sin pasar por esta lista. Si algo no encaja, se agrega a la lista
primero. Un tema vive en un solo archivo: los demás lo enlazan, no lo copian.

## Estilo

- Corto: si una frase no cambia lo que alguien haría, sobra.
- Frases cortas, una idea por párrafo.
- Negrita solo para lo que no se puede pasar por alto. Casi nunca.
- Tablas para comparar, listas para enumerar. Lo demás, prosa.
- Sin relleno: «lo importante es», «conviene decir», «no es X, es Y», cierres de remate.
- Sin emojis ni ✅/❌.
- Español neutro, sin voseo.
- Las decisiones se citan por número: (0041).
- Las cifras, medidas y con fecha. Una estimación se dice estimación.
- Lo que ya no vale se borra. Nada de ~~tachado~~ ni listas de «hecho»: eso queda en git.

## Decisiones

Se escribe una cuando se elige entre alternativas que alguien podría volver a discutir, o cuando
se cambia algo ya decidido.

1. Número siguiente al último de `docs/decisions/`, nombre en inglés con guiones.
2. El formato de abajo. Que entre en una pantalla.
3. Si reemplaza a otra, se marca en las dos: `Reemplaza en parte a 0038` en la nueva,
   `Reemplazada en parte por 0041` en la vieja. Es lo único que se le edita a una decisión vieja.
4. Se agrega la fila en `docs/decisions/README.md`.
5. Se actualiza lo que la decisión cambia: `roadmap.md`, `stack.md`, `architecture.md`.

```md
# 0042 — Título que dice la decisión

Aceptada · 2026-10-10 · Reemplaza en parte a 0041

## Contexto

El problema, con números si los hay.

## Decisión

Qué se hace.

## Se paga

- Lo que cuesta o deja de funcionar.

## Descartado

- **Alternativa.** Por qué no.
```
