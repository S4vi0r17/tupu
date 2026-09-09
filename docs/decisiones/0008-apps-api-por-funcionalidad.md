# 0008 — `apps/api` se organiza por funcionalidad

**Estado:** Aceptada · 2026-09-08

## Contexto

Con el API decidido sobre Hono ([0004](0004-hono-en-el-api.md)) y el acceso a datos sobre Drizzle
([0007](0007-drizzle-para-acceso-a-datos.md)), faltaba cómo se ordena el código adentro. La
discusión clásica: carpetas por capa técnica —`controllers/`, `services/`, `repositories/`— o
carpetas por funcionalidad.

Lo que inclinó la balanza no fue la preferencia general, sino mirar qué hay realmente en este API.
Son cuatro áreas, y **no tienen la misma forma**:

| Área | Qué hace | ¿CRUD contra la base? |
|---|---|---|
| `identity` | registro, login, refresco de token | sí, clásico |
| `rides` | guardar recorrido, historial, kilómetros | sí, con PostGIS |
| `routing` | planificar ruta, alternativas, isócronas | **no** — habla con Valhalla y cachea |
| `cycleways` | ciclovías cercanas + ingesta de OSM | mitad consulta, mitad *job* |

Las capas técnicas funcionan cuando toda funcionalidad es el mismo triple
`controller → service → repository`. Acá dos de las cuatro no lo son: `routing` no tendría nada
que poner en `repositories/`, y la ingesta de OSM no tendría dónde vivir porque no entra por un
`controller`.

## Decisión

**Por funcionalidad, con las capas adentro de cada carpeta.** La capa sigue existiendo como
convención de nombres de archivo; lo que no existe es la capa como carpeta de primer nivel.

```
apps/api/src/
├── features/
│   ├── identity/
│   │   ├── routes.ts      router de Hono: POST /register, /login, /refresh
│   │   ├── service.ts     hashear, emitir y validar token
│   │   ├── queries.ts     Drizzle
│   │   └── schema.ts      tablas users, sessions
│   ├── rides/             igual, las cuatro
│   ├── routing/           sin queries.ts — no toca la base, habla con Valhalla
│   └── cycleways/         + ingest.ts, el job de OSM, que no es una petición
├── shared/
│   ├── db.ts              el cliente Drizzle
│   ├── config.ts          lectura y validación del env
│   ├── auth.ts            middleware que valida el token
│   └── errors.ts          cómo se convierte un fallo en respuesta HTTP
└── index.ts               monta los routers
```

**La regla de dependencia es la de [0002](0002-layout-del-repo.md), un nivel más abajo:**
`features/*` importa de `shared/`, nunca al revés, y una feature no entra a los internos de otra —
solo a lo que la otra exporte por su `index.ts`. Se hace cumplir con el linter, igual que la de
arriba.

Una feature no está obligada a tener los cuatro archivos. Tiene los que le tocan, y eso es
precisamente lo que se buscaba.

## Consecuencias

**A favor**

- **La estructura de carpetas y la de URLs son la misma cosa.** Hono compone así de fábrica: cada
  feature exporta un router y `index.ts` hace `app.route('/rides', rides)`.
- **Para tocar una funcionalidad se abre una carpeta.** El diff de un cambio queda contenido, y en
  la revisión se ve de un vistazo qué área se movió.
- **Drizzle no obliga a centralizar el esquema.** `drizzle.config.ts` acepta un glob:
  `schema: './src/features/**/schema.ts'`. Las tablas viven junto al código que las usa y las
  migraciones siguen saliendo de un solo diff.
- Las piezas que no encajan en el triple —el job de ingesta, el cliente de Valhalla— tienen un
  lugar natural en vez de una excepción explicada en un README.

**En contra**

- **Hay que decidir cada vez si algo es compartido**, y esa decisión se toma mal al principio.
  `shared/` tiende a engordar hasta volverse un cajón de sastre; conviene revisarlo de tanto en
  tanto y empujar cosas de vuelta a las features.
- **Va a haber una necesidad entre features y hay que resistirla.** El caso concreto que llegará
  pronto: `rides` querrá saber cuántos kilómetros del recorrido fueron sobre ciclovía, y eso
  necesita `cycleways`. La salida es el `index.ts` de `cycleways`, no su `queries.ts`.
- **Ver "todos los endpoints" o "todas las consultas" de golpe ya no es abrir una carpeta.** Es
  una búsqueda. Se extraña las primeras semanas.
- Con features chicas —cuatro rutas cada una al principio— la ceremonia llega antes que el
  beneficio, igual que con los `packages/` de [0002](0002-layout-del-repo.md).

## Alternativas descartadas

- **Por capas técnicas** — más familiar y sin discutir qué es compartido, pero deja carpetas
  desparejas: `repositories/` sin `routing`, y la ingesta de OSM sin casa. Además obliga a abrir
  tres carpetas lejanas para tocar una sola funcionalidad.
- **Plano, un archivo por feature en `src/`** — cero ceremonia mientras el API sea chico. Se
  descartó porque el refactor está garantizado y llegaría justo cuando el proyecto tenga menos
  tiempo para hacerlo; el paso de `rides.ts` a `rides/` es más barato antes que después.
