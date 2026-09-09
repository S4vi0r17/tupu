# 0004 — Hono sobre Bun en el API

**Estado:** Aceptada · 2026-09-08

## Contexto

El API tiene que hacer tres cosas: servir la red de ciclovías, hablar con el motor de ruteo
([0006](0006-valhalla-para-ruteo.md)) y guardar cuentas e historial de recorridos.

Con eso en mano, lo que más pesa no es el rendimiento ni la ergonomía del framework, sino **cuánto
ayuda a mantener sincronizados el servidor y la app móvil**, que en un monorepo con un solo
consumidor ([0001](0001-monorepo-con-bun.md)) es el trabajo que más se repite. Ese es el criterio
con el que se comparó todo el campo — Express, Fastify, NestJS, Elysia y tRPC — en
*Alternativas descartadas*.

## Decisión

**Hono**, corriendo sobre Bun.

### La razón decisiva

El **cliente RPC tipado**. Hono puede exportar el tipo de la aplicación y la app móvil consumirlo
directamente:

```ts
// en el móvil
const api = hc<AppType>(API_URL)
const res = await api.rides.$post({ json: { ... } })
```

Cambiar un endpoint en el servidor rompe la compilación en la pantalla que lo usa. Sin generación
de código, sin OpenAPI de por medio, sin un paso que alguien olvide correr. Ningún framework del
campo da eso sobre HTTP normal salvo Elysia, y Elysia se descartó por otra razón.

Lo que se renuncia al no tomar un framework grande —contenedor de DI, jobs, scheduling,
interceptores— este proyecto no lo necesita: es un proxy de ruteo más CRUD de recorridos.

### Por qué Bun

Hono está construido sobre APIs web estándar, así que en Bun se sirve sin adaptador. Y siendo Bun
también el gestor de paquetes ([0001](0001-monorepo-con-bun.md)), es un solo binario para instalar,
ejecutar y testear.

## Consecuencias

**A favor**

- Tipado extremo a extremo entre servidor y app, verificado en compilación.
- Superficie mínima: Hono es pequeño y se entiende entero en una tarde.
- Arranque casi instantáneo, que hace el ciclo de desarrollo mucho más ágil.

**En contra**

- **Hono no impone estructura.** Un framework grande te dice dónde va cada cosa; aquí hay que
  decidirlo y escribirlo, o el proyecto degenera en un archivo de rutas de mil líneas. Es justo lo
  que resuelve [0008](0008-apps-api-por-funcionalidad.md).
- **Sin contenedor de DI**, las dependencias se pasan a mano. Con este tamaño es más simple que un
  contenedor; si el proyecto crece mucho, se vuelve repetitivo.
- Comunidad más pequeña que la de Express o NestJS: menos respuestas ya escritas cuando algo raro
  falla.

## Alternativas descartadas

- **NestJS** — da estructura, DI, jobs, interceptores y una comunidad enorme, y es la opción
  correcta para un equipo grande que necesita que todos escriban igual. Se descartó porque nada de
  eso es lo que falta aquí —esto es un proxy de ruteo más CRUD de recorridos— y porque no tiene
  equivalente al cliente RPC tipado: mantener sincronizados servidor y app móvil volvería a pasar
  por OpenAPI y un paso de generación de código que alguien va a olvidar correr.
- **Express** — el estándar de facto y lo que más respuestas tiene escritas. Se descartó por
  tipado: sus tipos son un añadido posterior, `req.body` es `any` salvo que se lo envuelva, y no
  hay forma de derivar un cliente desde las rutas. Es la opción correcta cuando lo que importa es
  que cualquiera pueda entrar al código mañana; aquí importa más que el móvil no compile si el
  API cambió.
- **Fastify** — rápido, maduro, con validación por JSON Schema y muy buenos tipos vía TypeBox.
  Fue la alternativa más razonable después de Hono. Se descartó porque su tipado llega hasta el
  borde del servidor: valida lo que entra, pero el móvil sigue sin saber qué recibe sin generar
  un cliente aparte.
- **Elysia** — la comparación más incómoda, porque en la práctica gana en casi todo: es nativo de
  Bun, es más rápido que Hono ahí, su inferencia de tipos es aún mejor y su cliente *Eden Treaty*
  hace lo mismo que el RPC de Hono. Se descartó por una sola razón, deliberada: **es solo Bun**.
  Elegirlo cierra el plan de salida de [0001](0001-monorepo-con-bun.md) — si Bun diera problemas
  en producción, con Hono se cambia el adaptador y con Elysia se reescribe el API. Siendo Bun la
  pieza menos probada del stack, no conviene atarse dos veces a ella.
- **tRPC** — el mejor tipado extremo a extremo de todos, y encaja bien con Expo. Se descartó
  porque no produce un API HTTP con semántica propia: los endpoints son procedimientos, difíciles
  de consumir desde cualquier cosa que no sea el cliente de tRPC, y eso cierra la puerta a un
  segundo consumidor —una web, un script de ingesta, un `curl` para depurar— por un beneficio que
  el RPC de Hono ya da sobre HTTP normal.
