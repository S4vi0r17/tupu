# Comentarios

El código se explica con nombres, tipos y funciones chicas. Un comentario es la excepción.

## Cuándo

Solo lo que el código no puede decir:

- un porqué que sorprende
- una trampa que va a morder
- una unidad
- un dato externo: qué devuelve Valhalla, cómo etiqueta OSM, qué hace Android

Si parafrasea la línea de abajo, sobra. Si necesita más de una línea, el código no está claro o
es documentación: va a `docs/`.

## Cómo

- Una línea, en español.
- Sin tags (`WHY`, `NOTE`, `!`). Solo `TODO:` para un pendiente concreto.
- Con el número de decisión al final cuando el comentario la resume: `(0041)`.

```ts
// Valhalla codifica con 6 decimales; con 5 las coordenadas salen 10 veces fuera de sitio
const POLYLINE_PRECISION = 6
```

## TSDoc

- Una línea, solo en exportados cuyo nombre y tipo no alcanzan.
- `@throws` siempre que la función lance.
- Resumen en presente: «Calcula la distancia», no «Calcular».

```ts
/** @throws {UpstreamError} Si Valhalla no responde o responde sin trazado. */
export async function planRoute(request: RoutePlanRequest) {
```
