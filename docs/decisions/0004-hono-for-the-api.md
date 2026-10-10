# 0004 — Hono sobre Bun en el API

Aceptada · 2026-09-08

## Contexto

El API sirve la red de ciclovías, habla con Valhalla (0006) y más adelante guarda cuentas y
recorridos. Con un solo cliente en el mismo repo (0001), lo que más pesa es cuánto ayuda a
mantener sincronizados el servidor y la app.

## Decisión

Hono sobre Bun, por su cliente RPC tipado:

```ts
const api = hc<AppType>(API_URL)
const res = await api.v1.routing.plan.$post({ json: { from, to } })
```

Cambiar un endpoint rompe la compilación de la pantalla que lo usa. Sin generar código ni OpenAPI.

Hono usa APIs web estándar, así que corre en Bun sin adaptador y en Node con uno.

## Se paga

- No impone estructura: hay que decidirla (0008).
- Sin inyección de dependencias: se pasan a mano.
- Menos respuestas escritas que para Express o NestJS.

## Descartado

- **NestJS.** Estructura y DI que este API no necesita, y sin cliente tipado: volvería OpenAPI.
- **Express.** `req.body` es `any` y no hay cliente derivable de las rutas.
- **Fastify.** Buen tipado del lado del servidor, pero el móvil seguiría sin saber qué recibe.
- **Elysia.** Más rápido y con mejor inferencia, pero solo corre en Bun: cerraría la salida a
  Node de 0001.
- **tRPC.** El mejor tipado, pero los endpoints son procedimientos: un `curl` o una web se
  complican.
