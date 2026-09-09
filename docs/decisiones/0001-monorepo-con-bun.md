# 0001 — Monorepo con workspaces de Bun

**Estado:** Aceptada · 2026-09-08

## Contexto

El proyecto son dos piezas que se despliegan por separado —un API y una app móvil— más el código
que ambas necesitan. Había que elegir entre un repositorio por pieza o uno solo, y qué gestor de
paquetes usar.

## Decisión

Un solo repositorio, con **workspaces de Bun**. Sin pnpm, sin Turborepo por ahora.

```jsonc
// package.json de la raíz
{ "workspaces": ["apps/*", "packages/*"] }
```

Un `bun install` desde la raíz instala todo. Las dependencias internas se declaran
`"@tupu/geo": "workspace:*"` y Bun las enlaza localmente. Los scripts se lanzan con
`bun run --filter '@tupu/api' dev`, o `--filter '*'` para todos.

### Por qué monorepo

- **La app es el único consumidor del API.** Un cambio de endpoint y el ajuste de la pantalla
  caben en un commit. Separados serían dos PRs coordinados y una ventana con algo roto.
- **El cliente tipado de Hono necesita importar los tipos del API** (ver [0004](0004-hono-en-el-api.md)).
  Aquí es un import normal; entre repos habría que publicar un paquete en cada cambio.
- **Hay matemática que corre en los dos lados**: calcular el ángulo hacia el destino, decodificar
  el trazado de una ruta, sumar kilómetros. Se escribe una vez.

### Por qué Bun y no pnpm

Bun instala `node_modules` **aplanado**, que es lo que Metro —el bundler de React Native— espera.
Con pnpm hay que forzar `node-linker=hoisted` para que Expo no se rompa: se acaba en el mismo
sitio, pero peleando contra el comportamiento por defecto de la herramienta.

Además el API corre sobre Bun ([0004](0004-hono-en-el-api.md)), así que es un único binario para
instalar, ejecutar y testear.

## Consecuencias

**A favor**

- Una sola versión de cada dependencia en todo el repo. Es imposible que el móvil y el API usen
  versiones distintas de la librería de validación.
- Cambios atómicos y reversibles de una pieza.
- `bun install` es notablemente rápido.

**En contra**

- **El `node_modules` aplanado no aísla nada.** El móvil puede importar el cliente de Postgres
  —dependencia del API— y en desarrollo *no falla*, porque está hoisteado en la raíz. Revienta al
  construir el bundle, o peor, entra en él y engorda la app. Hace falta una regla de lint que lo
  impida; es el riesgo más real de esta decisión.
- **Sin caché de tareas.** Tocar una pantalla del móvil corre también los tests del API. Con este
  tamaño son segundos. Cuando deje de serlo, se añade Turborepo encima sin migrar nada.
- **El Dockerfile del API se construye desde la raíz**, no desde su carpeta: sin el lockfile y sin
  `packages/` no puede instalar. Sorprende la primera vez.
- Bun tiene menos rodaje en producción que Node. Si algún paquete nativo diera problemas, el plan
  de salida es el adaptador oficial de Hono para Node — el código de las rutas no cambia.

## Alternativas descartadas

### Cómo se reparte el código

- **Un repositorio por pieza (polyrepo)** — el aislamiento sale gratis y cada pieza tiene su
  historial limpio. Se descartó porque los tres argumentos del monorepo se invierten: cada cambio
  de endpoint pasa a ser dos PRs coordinados, el cliente tipado de Hono obliga a publicar un
  paquete en cada cambio, y la matemática compartida hay que versionarla.
- **Submódulos de git** para lo compartido — la peor de las dos: la ceremonia del polyrepo más la
  fragilidad de un puntero de commit que la mitad del equipo olvida actualizar.

### Con qué se gestionan los paquetes

- **npm / yarn workspaces (clásico)** — funcionan y están en todas partes. Se descartaron por
  lentitud de instalación y porque no aportan nada que Bun no dé, habiendo ya un binario de Bun en
  el proyecto.
- **yarn Berry con PnP** — descartado directamente: PnP no tiene resolución de archivos en disco y
  Metro, el bundler de React Native, no la soporta bien. Es pelear contra el ecosistema móvil
  entero.
- **pnpm** — la alternativa más seria, y con una ventaja real sobre Bun: su `node_modules` con
  enlaces simbólicos **impide de raíz** que el móvil importe una dependencia del API, que es el
  riesgo más grande apuntado arriba. Se descartó por una ironía: para que Expo funcione hay que
  poner `node-linker=hoisted`, lo que apaga exactamente esa ventaja y deja el mismo aplanado de
  Bun, pero con una herramienta más.

### Orquestación de tareas

- **Nx** — grafo de dependencias, caché, generadores. Se descartó por desproporción: dos apps y
  dos paquetes no justifican su configuración ni su forma de tomar el control del repo.
- **Turborepo** — más liviano que Nx y resuelve lo que falta (caché de tareas). No se descartó,
  se **aplazó**: se añade encima el día que los tests dejen de correr en segundos, y no obliga a
  migrar nada.

### El runtime

- **Node** — el más probado en producción y con el ecosistema más grande. Se descartó porque
  obliga a un paso de compilación o a `tsx`, y porque tener Node para ejecutar y Bun para instalar
  son dos binarios donde alcanza uno. Sigue siendo el **plan de salida** si algún paquete nativo
  falla: el adaptador oficial de Hono para Node no cambia el código de las rutas.
- **Deno** — excelente TypeScript nativo y librería estándar cuidada, pero su compatibilidad con
  npm todavía tiene aristas y el ecosistema de React Native asume npm. Poco que ganar, fricción
  segura.
