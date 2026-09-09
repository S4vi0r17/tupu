# 0003 — Código en inglés, comentarios en español

**Estado:** Aceptada · 2026-09-08
**Reemplazada en parte** por [0022](0022-mensajes-de-commit-en-ingles.md): los mensajes de commit
pasaron a inglés. Todo lo demás de este documento sigue vigente.

## Contexto

El equipo trabaja en español, pero el dominio del proyecto llega en inglés desde fuera:
OpenStreetMap etiqueta `cycleway`, `highway`, `surface`; el motor de ruteo devuelve `legs`,
`maneuvers`, `bearing_before`. Mezclar idiomas sin una regla explícita termina en `getCiclovias()`
y `RecorridoRepository` conviviendo con `findById()`, que es lo peor de ambos mundos.

## Decisión

- **Inglés**: identificadores, archivos, carpetas, ramas, campos del API, tablas y columnas.
- **Español**: comentarios, `docs/`, y todos los textos que ve el usuario.
  (~~mensajes de commit~~ — ver [0022](0022-mensajes-de-commit-en-ingles.md)).
- **Comentarios breves y solo del *porqué*.** El código se nombra para que se explique solo; si
  hace falta explicar *qué* hace, el arreglo es renombrar, no comentar.

Un comentario que se justifica se parece a este:

```ts
// Precisión 6, no 5: el motor de ruteo codifica con 6 decimales y decodificar
// con 5 no falla — devuelve coordenadas 10x fuera de sitio.
const POLYLINE_PRECISION = 6
```

Eso no se deduce leyendo el código, y sin el comentario se pierde una tarde.

## Consecuencias

**A favor**

- Cero traducciones entre capas. Si OSM dice `cycleway`, la columna se llama `cycleway` y el campo
  del API se llama `cycleway`. Cada traducción es un sitio donde se pierde precisión.
- No hay riesgo de chocar con palabras reservadas ni de tildes en identificadores.
- Las razones de una decisión se escriben en el idioma en que se piensa, que es donde salen mejor.

**En contra**

- Hay que sostener la disciplina: es fácil que se cuele un `ciclovia` suelto en un momento de
  prisa, y un solo caso rompe la coherencia.
- Los textos de cara al usuario van en español mientras los códigos internos de error van en
  inglés, así que la capa que los traduce tiene que existir desde el principio.

## Alternativas descartadas

- **Todo en español, comentarios incluidos** — más cómodo para leer en voz alta y para quien entra
  al proyecto sin inglés. Se descartó por la frontera: el dominio llega en inglés desde OSM y
  desde el motor de ruteo, así que "todo en español" en realidad significa *traducir en cada
  capa*. `superficie` en la base y `surface` en el JSON de OSM es un mapeo más que mantener y un
  sitio más donde perder un caso.
- **Todo en inglés, comentarios y `docs/` incluidos** — lo más común en proyectos abiertos, y lo
  correcto si el repositorio fuera a ser público o el equipo mixto. Se descartó porque ninguna de
  las dos cosas es cierta hoy, y porque el razonamiento de una decisión sale peor escrito en un
  idioma que no es el que se piensa. El costo se paga si el proyecto se abre: habría que traducir
  `docs/`. Se aceptó ese riesgo.
- **Sin regla escrita** — es el estado por defecto y el peor: produce `getCiclovias()` conviviendo
  con `findById()`, que es lo peor de ambos mundos. No es tanto una alternativa como lo que pasa
  si no se decide.
