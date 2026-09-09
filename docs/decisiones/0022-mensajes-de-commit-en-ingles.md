# 0022 — Los mensajes de commit van en inglés, con Conventional Commits

**Estado:** Aceptada · 2026-09-08
**Reemplaza:** parcialmente a [0003](0003-idioma-del-codigo.md), que ponía los mensajes de commit
en español. El resto de 0003 sigue vigente.

## Contexto

[0003](0003-idioma-del-codigo.md) repartió los idiomas: inglés para el código, español para los
comentarios, `docs/` y los mensajes de commit.

Al mirar el repositorio hermano `fulfillment-api` para tomar sus convenciones, apareció un choque
directo: allí los mensajes de commit van **en inglés**, y esa convención está escrita, razonada y
en uso desde hace tiempo. Todo lo demás coincide exactamente con 0003 — identificadores y archivos
en inglés, comentarios y textos de usuario en español.

Mantener dos criterios distintos para lo mismo entre dos proyectos de la misma persona no aporta
nada: el segundo historial se lee peor por ser distinto, no por ser mejor.

## Decisión

**Conventional Commits, en inglés**, siguiendo el formato de `fulfillment-api` con los *scopes*
de tupu.

```
type(scope): subject

body opcional, también en inglés
```

Las reglas completas —tabla de tipos, límite del subject, verbos prohibidos— quedan en
[`../conventions/commits.md`](../conventions/commits.md), que es donde se consultan a diario.

**El resto de [0003](0003-idioma-del-codigo.md) no cambia**: comentarios, `docs/` y los textos que
ve el usuario siguen en español.

## Consecuencias

**A favor**

- Un solo criterio de commits entre los proyectos, y por lo tanto una sola convención que recordar
  al saltar de uno a otro.
- El prefijo de Conventional Commits es una palabra clave en inglés de todos modos (`feat`,
  `fix`): un subject en español dejaba la mitad de la línea en cada idioma.
- Deja la puerta abierta a generar el changelog automáticamente, que necesita el formato
  respetado.

**En contra**

- **Rompe la regla simple de 0003**, que se resumía en una frase. Ahora hay una excepción, y las
  excepciones se olvidan: el criterio pasa a ser "todo lo escrito en español menos los commits".
- El *porqué* de un cambio, que es lo que va en el body, se escribe peor en un idioma que no es el
  que se piensa. Es exactamente el argumento con el que 0003 puso `docs/` en español, y aquí se
  acepta el costo a cambio de la coherencia entre repos.
- Al escribir un commit hay que cambiar de idioma respecto de los comentarios que se acaban de
  escribir en el mismo archivo.

## Alternativas descartadas

- **Español, como decía 0003** — coherente con el resto del proyecto y con el idioma en que se
  piensa. Se descartó por la coherencia entre repositorios, que en la práctica se usa más: el
  historial se lee saltando de un proyecto a otro.
- **Subject en inglés y body en español** — lo procesable en inglés y la explicación en el idioma
  propio. Se descartó porque deja dos idiomas dentro de un mismo commit, que es peor que cualquiera
  de las dos opciones puras.
