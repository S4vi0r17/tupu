# Comentarios de código

**El código se lee solo. El comentario cubre lo que el código no puede decir.**

En español ([0003](../decisiones/0003-idioma-del-codigo.md)), a diferencia de los mensajes de
commit. Adaptado de las convenciones del repo hermano `fulfillment-api`.

Orden de preferencia: **tipos > nombres > extraer una función > TSDoc > comentario inline.**
El comentario es la excepción, no el acompañamiento.

## Brevedad

- Inline: **máximo 2 líneas.** Si necesitás 5, el código no está claro — arreglá el código.
- Docblock: **máximo 3 líneas.**
- Si hace falta explicar un mecanismo entero, va a `docs/`, no arriba de la función. Un párrafo
  inline se desactualiza en el primer refactor y nadie lo borra.
- Nunca parafrasees la línea de abajo. Si el comentario y el código dicen lo mismo, sobra el
  comentario.

Cuando un comentario no entra en el límite, la pregunta no es cómo achicarlo: es si el código
necesita otro nombre, o si eso era documentación disfrazada de comentario.

## Cuándo NO comentar

```ts
// ❌ parafrasea
// Trae las ciclovías cercanas
const nearby = await findNearbyCycleways(point)

// ❌ obvio por el nombre
// Map para búsqueda rápida
const byId = new Map(cycleways.map((c) => [c.id, c]))
```

## Tags

Todo comentario inline empieza con un tag. Sin tag, no va.

| Tag | Cuándo |
|---|---|
| `WHY` | Decisión que sorprendería a quien lea |
| `!` | Peligro o gotcha que te va a morder |
| `PERF` | Optimización, **con números** — sin números es una opinión |
| `HACK` | Workaround temporal, siempre con `TODO` al lado |
| `TODO` | Pendiente concreto |

Secundarios, con moderación: `SECURITY`, `FIXME`, `NOTE` (solo contexto externo que no se deduce
del código, por ejemplo qué devuelve Valhalla o cómo etiqueta OSM algo).

```ts
// ✅ WHY Precisión 6, no 5: Valhalla codifica con 6 decimales y decodificar
//    con 5 devuelve coordenadas 10x fuera de sitio.
const POLYLINE_PRECISION = 6

// ✅ ! Sin transacción: si falla a mitad, la tabla queda con la mitad nueva
// ✅ PERF ST_DWithin con índice (3ms) vs filtrar en memoria (400ms con 5k tramos)
// ✅ NOTE OSM etiqueta la infraestructura ciclista de tres formas distintas — ver 0012
```

## TSDoc — solo lo que los tipos no expresan

- `@throws` **siempre** que lance: TypeScript no tiene excepciones declaradas.
- `@remarks` para efectos no obvios (escribe en disco, dispara una petición a Valhalla).
- `@param` / `@returns` **solo** si el nombre y el tipo no alcanzan. Nunca repitas la firma.

## Por zona

Cada parte del proyecto esconde algo distinto, así que comenta distinto:

| Zona | Qué comentar |
|---|---|
| `routes.ts` | Nada. La ruta y el esquema de validación son su documentación. |
| `service.ts` | El *porqué* de una regla de negocio que no se deduce. Si la orquestación no se lee sola, extraé pasos con nombre. |
| `queries.ts` | Acá sí: las rarezas de PostGIS y de Drizzle. Por qué un `::geography` y no un `::geometry`, por qué ese índice. |
| `schema.ts` | Solo la columna con una regla no obvia. La unidad, siempre (`distanceM` en metros, no en km). |
| `packages/geo` | Casi nada: son funciones puras con nombres del dominio. Solo la fórmula que no es evidente, con su fuente. |
| `packages/contracts` | Sin TSDoc. Tag inline solo en campos con reglas no obvias. |
| Móvil, pantallas | Nada. Si hace falta, el componente necesita otro nombre. |
| Móvil, sensores | Acá sí, y bastante: el magnetómetro, el filtro de suavizado y las manías de cada Android son justo lo que el código no puede explicar ([0015](../decisiones/0015-grabacion-en-segundo-plano.md)). |
| Constantes exportadas | Docblock de una línea con la unidad o el porqué del valor. |

## Estilo

En español, y el resumen de TSDoc en imperativo: "Calcula la distancia", no "Calcular la
distancia".
