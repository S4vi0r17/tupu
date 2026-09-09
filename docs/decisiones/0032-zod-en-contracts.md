# 0032 — Zod para validar y definir los contratos

**Estado:** Aceptada · 2026-09-08

## Contexto

[0002](0002-layout-del-repo.md) define `packages/contracts` como «qué se manda y qué se recibe», y
[0004](0004-hono-en-el-api.md) dice que el API valida lo que entra. **Con qué librería no se dijo
nunca**, y sin eso no se puede escribir el primer endpoint.

Hay un detalle que condiciona la elección: `packages/contracts` lo importan **los dos lados** — el
API para validar lo que entra, el móvil para validar sus formularios. Así que el peso de la
librería entra también en el bundle de la app.

## Decisión

**Zod.**

Un esquema por contrato, y el tipo de TypeScript **se infiere del esquema** en vez de escribirse
aparte. Eso es lo que hace que `contracts` sea una sola fuente y no dos que se desincronizan:

```ts
// packages/contracts/src/routing.ts
export const routePlanRequest = z.object({
  from: z.object({ lat: z.number(), lng: z.number() }),
  to:   z.object({ lat: z.number(), lng: z.number() }),
})
export type RoutePlanRequest = z.infer<typeof routePlanRequest>
```

En el API se enchufa con el validador oficial de Hono, así que la validación y el tipado de la ruta
son la misma línea — y de ahí sale el tipo que consume el cliente RPC, que es la razón por la que se
eligió Hono ([0004](0004-hono-en-el-api.md)).

En el móvil, el mismo esquema valida el campo de coordenadas pegadas
([0028](0028-destino-por-mapa-o-coordenadas.md)), que es justo donde un `-77, -12` invertido mandaría
la ruta al Atlántico.

## Consecuencias

**A favor**

- **Un solo sitio define la forma de los datos.** El esquema valida en tiempo de ejecución y genera
  el tipo en compilación; no hay una interfaz escrita a mano que se olvide de actualizar.
- Validador oficial para Hono, así que no hay pegamento propio que mantener.
- **Precedente cerca**: el repo hermano `fulfillment-api` migró a Zod, así que las dudas ya están
  resueltas una vez.
- El ecosistema más grande de las opciones: casi cualquier problema ya está respondido.

**En contra**

- **Es la más pesada de las tres**, y ese peso viaja al bundle de la app móvil porque `contracts` se
  importa desde los dos lados. No es dramático, pero es un costo que Valibot no tendría.
- Los mensajes de error por defecto son en inglés y no sirven para mostrar al usuario: hay que
  traducirlos, y [0003](0003-idioma-del-codigo.md) exige que los textos que ve el usuario vayan en
  español. Esa capa hay que escribirla.
- Es una dependencia más en `contracts`, que [0002](0002-layout-del-repo.md) describía como un
  paquete diminuto.

## Alternativas descartadas

- **Valibot** — API casi idéntica y muchísimo más liviano, que es una ventaja real y medible en una
  app móvil. También tiene validador oficial para Hono. Se descartó por rodaje y por el precedente:
  ante un problema raro hay muchas menos respuestas escritas, y en este proyecto la coherencia con
  `fulfillment-api` vale más que unos kilobytes.
- **TypeBox** — genera JSON Schema y es el más rápido validando; encajaría bien si algún día se
  quisiera OpenAPI. Se descartó porque su API es bastante menos agradable de leer y escribir, y
  OpenAPI no está en el horizonte con un cliente RPC tipado ([0004](0004-hono-en-el-api.md)).
- **ArkType** — el más expresivo de todos. Se descartó por ser el más nuevo, en un paquete que es la
  frontera entre las dos apps y que conviene que sea aburrido.
