# 0008 — `apps/api` se organiza por funcionalidad

Aceptada · 2026-09-08

## Contexto

El API tiene cuatro áreas y no tienen la misma forma:

| Área | Qué hace | ¿CRUD? |
|---|---|---|
| `identity` | registro y sesiones | sí |
| `rides` | recorridos e historial | sí, con PostGIS |
| `routing` | rutas | no: habla con Valhalla |
| `cycleways` | red ciclista e ingesta de OSM | mitad consulta, mitad job |

Las carpetas por capa (`controllers/`, `services/`, `repositories/`) suponen que todo es el mismo
triple. Acá `routing` no tendría repositorio y la ingesta no tendría dónde vivir.

## Decisión

Una carpeta por funcionalidad, con las capas como nombres de archivo:

```
apps/api/src/
├── features/
│   ├── cycleways/   routes.ts · queries.ts · schema.ts · ingest.ts · index.ts
│   └── routing/     routes.ts · service.ts · index.ts
├── shared/          db.ts · config.ts · errors.ts
└── index.ts
```

Cada feature tiene solo los archivos que necesita. `features/*` importa de `shared/`, nunca al
revés, y una feature solo entra a otra por su `index.ts`. Lo hace cumplir el linter.

Las rutas siguen a las carpetas: `app.route('/v1/cycleways', cyclewaysRoutes)`. El esquema de
Drizzle se lee con un glob, `./src/features/**/schema.ts`.

## Se paga

- Decidir cada vez si algo es compartido. `shared/` tiende a engordar.
- Ver todos los endpoints de golpe es una búsqueda, no una carpeta.
- Ceremonia mientras las features son chicas.

## Descartado

- **Por capas.** Carpetas desparejas, y tres carpetas lejanas para tocar una funcionalidad.
- **Un archivo por feature.** El refactor llegaría justo cuando haya menos tiempo.
