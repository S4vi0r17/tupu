# Modelo de datos

Dos bases que no guardan lo mismo:

| | PostGIS, en el servidor | SQLite, en el teléfono |
|---|---|---|
| Guarda | La red ciclista | Los recorridos |
| Viene de | OSM (0012) | El GPS, mientras se pedalea |
| Escribe | `osm:update` | La tarea de segundo plano (0015) |
| Si se pierde | Se regenera (0017) | Se pierde: desinstalar la app la borra (0010) |

| Entidad | Dónde | Cuándo |
|---|---|---|
| `cycleways` | Servidor | MVP |
| `osm_imports` | Servidor | MVP |
| `rides` | Teléfono | MVP |
| `ride_points` | Teléfono | MVP |
| `users`, `sessions`, `rides` | Servidor | Con las cuentas |

PostGIS no es una tabla: es una extensión de PostgreSQL que agrega tipos y funciones geográficas.
Sus tablas internas se excluyen de Drizzle con `extensionsFilters: ['postgis']` (0007).

## Servidor

### `cycleways`

| Columna | Tipo | Nulo | Para qué |
|---|---|---|---|
| `osm_id` | `bigint` PK | no | Estable entre ingestas, y abre el tramo en osm.org para corregirlo |
| `name` | `text` | sí | La mayoría de tramos en Lima no tiene nombre |
| `kind` | `track` · `lane` · `shared` | no | Vía propia, carril pintado o compartida |
| `surface` | `text` | sí | Tal cual viene de OSM: `asphalt`, `unpaved`… |
| `geom` | `geometry(LineString, 4326)` | no | La línea del tramo |

Índice GiST sobre `geom::geography`, porque las consultas miden en metros.

| `kind` | Etiqueta de OSM |
|---|---|
| `track` | `highway=cycleway`, `cycleway=track` |
| `lane` | `cycleway=lane`, también por lado (`cycleway:left`, `cycleway:right`) |
| `shared` | `bicycle=designated` |

No guarda sentido, pendiente ni giros: eso lo sabe Valhalla (0006).

### `osm_imports`

Una fila por corrida de `osm:update`.

| Columna | Tipo | Para qué |
|---|---|---|
| `id` | `uuid` PK | |
| `extract_date` | `date` | La edad real de los datos |
| `imported_at` | `timestamptz` | Cuándo se corrió |
| `cycleway_count` | `integer` | La próxima ingesta se revierte si queda en menos de la mitad |

## Teléfono

SQLite con Drizzle (0013, 0033). Una caída a los 40 minutos tiene que perder segundos, no el
recorrido: cada punto se guarda al llegar. Las fechas van en epoch en milisegundos.

```ts
export const rides = sqliteTable('rides', {
  id:             text('id').primaryKey(),
  startedAt:      integer('started_at').notNull(),
  endedAt:        integer('ended_at'),
  distanceM:      real('distance_m').notNull().default(0),
  destinationLat: real('destination_lat'),
  destinationLng: real('destination_lng'),
})

export const ridePoints = sqliteTable('ride_points', {
  rideId:     text('ride_id').notNull().references(() => rides.id, { onDelete: 'cascade' }),
  seq:        integer('seq').notNull(),
  lat:        real('lat').notNull(),
  lng:        real('lng').notNull(),
  recordedAt: integer('recorded_at').notNull(),
  accuracyM:  real('accuracy_m').notNull(),
  altitudeM:  real('altitude_m'),
  speedMps:   real('speed_mps'),
}, (t) => [primaryKey({ columns: [t.rideId, t.seq] })])
```

### `rides`

| Columna | Para qué |
|---|---|
| `id` | `uuid` generado en el teléfono: sincronizar no necesitará que el servidor asigne nada |
| `ended_at` | Nulo mientras se graba. Un recorrido sin cerrar al abrir la app es una tarea que Android mató |
| `distance_m` | Se acumula punto a punto |
| `destination_*` | Nulo si se salió sin destino |

### `ride_points`

| Columna | Para qué |
|---|---|
| `seq` | El orden, sin depender de empates de reloj |
| `recorded_at` | La hora del fix, no la de escritura |
| `accuracy_m` | Para descartar fixes malos después |
| `altitude_m`, `speed_mps` | Desnivel y paradas, más adelante |

Se guarda el GPS crudo. Ajustarlo a las calles se puede hacer después con Valhalla.

## Contratos

Lo que viaja entre el API y la app, en `packages/contracts`:

```ts
type CyclewayCollection = {            // GET /v1/cycleways
  type: 'FeatureCollection'
  features: {
    geometry: { type: 'LineString'; coordinates: [number, number][] }
    properties: { osmId: number; kind: 'track' | 'lane' | 'shared'; name: string | null }
  }[]
}

type RoutePlanRequest = { from: { lat: number; lng: number }; to: { lat: number; lng: number } }
type RoutePlanResponse = { distanceM: number; durationS: number; shape: string }  // polilínea, precisión 6
```

## Con las cuentas

No está decidido (0010), pero el MVP deja la puerta abierta.

| Tabla | Columnas |
|---|---|
| `users` | `id`, `email` único, `password_hash`, `created_at` |
| `sessions` | `id`, `user_id`, `token_hash`, `created_at`, `last_used_at`, `expires_at`, `revoked_at` |
| `rides` | `id` (el mismo del teléfono), `user_id`, `started_at`, `ended_at`, `distance_m`, `track geometry(LineString, 4326)`, `uploaded_at` |

En el servidor el trazado es una sola columna: llega completo. `ST_MakeLine` sobre los puntos
ordenados lo arma, y cruzarlo con `cycleways` responde cuántos kilómetros fueron sobre ciclovía.

## Claves

| Caso | Clave | Ejemplo |
|---|---|---|
| Viene de fuera con un id estable | Natural | `cycleways.osm_id` |
| Es nuestro y algo lo referencia | `uuid` | `rides.id` |
| Solo existe dentro de su padre | Compuesta | `ride_points (ride_id, seq)` |

`rides.id` es `uuid` y no autoincremental porque lo generan varios teléfonos: dos secuencias
`1, 2, 3` chocarían al sincronizar.
