# 0032 — Zod para validar y definir los contratos

Aceptada · 2026-09-08

## Contexto

`packages/contracts` define lo que viaja entre el API y la app (0002), pero no se había elegido
con qué. Lo importan los dos lados, así que su peso también entra en la app.

## Decisión

Zod. El tipo se infiere del esquema, así hay una sola fuente:

```ts
export const routePlanRequestSchema = z.object({ from: pointSchema, to: pointSchema })
export type RoutePlanRequest = z.infer<typeof routePlanRequestSchema>
```

En el API se conecta con el validador de Hono, y de ahí sale el tipo del cliente RPC (0004). En el
móvil valida las coordenadas pegadas (0028).

El repo hermano `fulfillment-api` ya usa Zod.

## Se paga

- Es la más pesada de las opciones, y viaja en la app.
- Sus mensajes de error están en inglés: los textos para el usuario hay que escribirlos.

## Descartado

- **Valibot.** Casi la misma API y mucho más liviano, pero menos rodaje y sin precedente cerca.
- **TypeBox.** Genera JSON Schema, pero es menos legible y OpenAPI no hace falta con el RPC.
- **ArkType.** El más nuevo, en la frontera entre las dos apps.
