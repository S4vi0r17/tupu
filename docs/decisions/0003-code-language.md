# 0003 — Código en inglés, comentarios en español

Aceptada · 2026-09-08 · Reemplazada en parte por 0022

## Contexto

Se trabaja en español, pero el dominio llega en inglés: OSM etiqueta `cycleway` y `surface`,
Valhalla devuelve `legs` y `maneuvers`. Sin regla, conviven `getCiclovias()` y `findById()`.

## Decisión

- En inglés: identificadores, archivos, ramas, campos del API, tablas y columnas.
- En español: comentarios, `docs/` y los textos de la app.

## Se paga

- Hay que sostener la disciplina: un `ciclovia` suelto rompe la coherencia.
- Los códigos de error van en inglés y los mensajes en español: la traducción tiene que existir
  desde el principio.
- Si el repo se abre, `docs/` habría que traducirlo.

## Descartado

- **Todo en español.** Obliga a traducir en cada capa lo que OSM ya nombra en inglés.
- **Todo en inglés.** Lo correcto para un repo público o un equipo mixto; hoy no es ninguno.
