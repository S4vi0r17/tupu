# 0002 — Layout del repositorio

**Estado:** Aceptada · 2026-09-08

## Contexto

Con el monorepo decidido ([0001](0001-monorepo-con-bun.md)), faltaba definir qué carpetas hay en
la raíz y qué puede importar qué.

## Decisión

```
tupu/
├── apps/
│   ├── api/         @tupu/api        el servidor
│   └── mobile/      @tupu/mobile     la app
├── packages/
│   ├── contracts/   @tupu/contracts  qué se manda y qué se recibe
│   └── geo/         @tupu/geo        matemática geográfica
├── infra/                             docker, base de datos, motor de ruteo
└── docs/                              convenciones y decisiones
```

**La regla de dependencia, que es el punto de todo esto:** `apps/*` puede importar de
`packages/*`. Nunca al revés, y las apps no se importan entre sí. Cabe en una frase y se hace
cumplir con el linter — no se queda en buena intención dentro de un README.

### Por qué dos paquetes y no uno

- **`contracts`** — la forma de los datos: qué campos tiene un recorrido, qué pide el endpoint de
  planificar ruta, qué devuelve. Se define una vez y la usan los dos lados: el API para validar lo
  que entra, el móvil para saber qué recibe y validar sus formularios.
- **`geo`** — funciones puras, sin red ni base de datos: distancia entre dos puntos, ángulo hacia
  el destino, decodificar el trazado de una ruta, formatear `12,4 km` y `1 h 20 min`.

Fusionarlos en un `@tupu/core` se consideró y se descartó: `geo` es matemática estable que casi
no cambia, `contracts` cambia cada vez que se toca un endpoint. Juntos, cada cambio de API
invalidaría el paquete entero.

## Consecuencias

**A favor**

- La regla de dependencia es explícita y verificable.
- `infra/` y `docs/` quedan fuera de las apps, que es donde les toca: el `docker compose` levanta
  base de datos y motor de ruteo, no pertenece ni al API ni al móvil.
- Los `packages/*` **no necesitan compilarse**: Bun y Metro consumen TypeScript directo, así que
  son código fuente que las apps importan tal cual. Sin paso de build, sin modo watch, sin `dist/`
  desincronizado. Esto es específico de la combinación Bun + Expo.

**En contra**

- **Config extra en Expo.** Metro necesita que se le indique explícitamente la raíz del monorepo y
  que resuelva desde el `node_modules` de arriba. Es un archivo y se escribe una vez; el problema
  es que cuando algo falla ahí, los mensajes de error de Metro son pésimos.
- **Dos paquetes que empiezan diminutos**, unas 200 líneas cada uno. La ceremonia llega antes que
  el beneficio; durante el primer mes puede sentirse burocrático.
- Buscar en el repo devuelve resultados de las dos apps mezclados.

## Alternativa descartada

Aplanar a `api/`, `mobile/`, `shared/` sin los niveles `apps/`/`packages/`. Menos ceremonia y menos
que explicar. Se descartó porque con todo al mismo nivel no hay nada que impida que `shared/`
importe de `api/`, y con el tiempo lo hará.
