# Modelo de datos

Las entidades del MVP. No introduce decisiones nuevas: es el resultado de aplicar las que están en
[`decisiones/`](decisiones/). Cuando algo aquí sorprenda, la razón está en la decisión enlazada.

## Cuántas entidades hay

**Cuatro en el MVP.** Siete filas en esta tabla, pero seis tablas distintas: `rides` aparece dos
veces porque existe en las dos bases con forma diferente.

| # | Entidad | Dónde vive | Cuándo |
|---|---|---|---|
| 1 | `cycleways` | PostgreSQL, servidor | MVP |
| 2 | `osm_imports` | PostgreSQL, servidor | MVP |
| 3 | `rides` | SQLite, teléfono | MVP |
| 4 | `ride_points` | SQLite, teléfono | MVP |
| 5 | `users` | PostgreSQL, servidor | Después del MVP |
| 6 | `sessions` | PostgreSQL, servidor | Después del MVP |
| 7 | `rides` *(la del servidor)* | PostgreSQL, servidor | Después del MVP |

### PostGIS no es una de ellas

PostGIS **no es una entidad y no es la base de datos**. La base de datos es PostgreSQL; PostGIS es
una extensión —un plugin— que se instala dentro de ella:

```
PostgreSQL                     ← la base de datos
 └── extensión PostGIS         ← un plugin instalado dentro
      ├── tipos nuevos:        geometry(LineString, 4326)
      └── funciones nuevas:    ST_DWithin(), ST_Length(), ST_MakeLine()

 tus tablas
 ├── cycleways                 ← su columna geom usa el tipo que trajo el plugin
 └── osm_imports
```

Se instala una vez con `CREATE EXTENSION postgis;` y no añade ninguna tabla tuya: añade tipos de
columna y funciones. Es como instalar una librería — no crea archivos en tu `src/`, te da
herramientas para escribir tu código.

PostGIS sí crea tablas internas suyas (`spatial_ref_sys`, `geometry_columns`), pero son su
fontanería y nunca se tocan. [0007](decisiones/0007-drizzle-para-acceso-a-datos.md) ya anota que
hay que configurar `extensionsFilters: ['postgis']` justo para que Drizzle las ignore.

Y lo que vive en `packages/contracts` tampoco cuenta: es la forma de lo que viaja por HTTP, no se
guarda en ninguna parte.

## El reparto

El MVP tiene **dos bases de datos y no guardan lo mismo**:

| | PostGIS, en el servidor | SQLite, en el teléfono |
|---|---|---|
| Qué guarda | La red de ciclovías de Lima | Los recorridos del usuario |
| De dónde viene | OSM ([0012](decisiones/0012-ingesta-de-osm-por-extracto.md)) | El GPS, mientras se pedalea |
| Quién escribe | El comando `osm:update` | La tarea de fondo ([0015](decisiones/0015-grabacion-en-segundo-plano.md)) |
| Se pierde si… | Nada: se regenera ([0017](decisiones/0017-backups-aplazados-con-disparador.md)) | Se desinstala la app ([0010](decisiones/0010-alcance-del-mvp.md)) |

No hay `users` ni `rides` en el servidor: las cuentas están fuera del MVP.

## Servidor — PostgreSQL con PostGIS

### `cycleways`

La red de infraestructura ciclista de Lima, sacada de OSM.

| Columna | Tipo | Nulo | Qué es | Para qué sirve |
|---|---|---|---|---|
| `osm_id` | `bigint` **PK** | no | El identificador del *way* en OpenStreetMap | Clave estable entre ingestas. También permite abrir el tramo en osm.org para corregirlo cuando el mapeo esté mal |
| `name` | `text` | **sí** | El nombre, si lo tiene | Mostrarlo. En Lima la mayoría son tramos anónimos, por eso es nulo |
| `kind` | `'track' \| 'lane' \| 'shared'` | no | Qué tipo de infraestructura es | Un carril pintado y una vía separada no son lo mismo pedaleando |
| `surface` | `text` | sí | Material: `asphalt`, `concrete`, `unpaved`… | Avisar de tramos malos. Llega tal cual de OSM, sin traducir ([0003](decisiones/0003-idioma-del-codigo.md)) |
| `geom` | `geometry(LineString, 4326)` | no | La línea del tramo, en coordenadas GPS | La consulta que justifica toda la decisión de PostGIS |

Más un índice **GiST** sobre `geom::geography`, que es lo que hace que buscar por cercanía tarde
milisegundos. Va sobre la expresión y no sobre la columna pelada: las consultas castean a
`geography` para medir en metros, y un índice sobre `geometry` a secas no lo usa el planificador.

- **`4326`** es el sistema de coordenadas: latitud y longitud de toda la vida, el que usa el GPS.
  Aparece en cada columna geográfica y siempre es el mismo en este proyecto.
- **La clave primaria es de OSM y no un `uuid` nuestro** porque
  [0012](decisiones/0012-ingesta-de-osm-por-extracto.md) reemplaza la tabla entera en cada ingesta:
  un id propio cambiaría en cada corrida y ninguna referencia sobreviviría.

**`kind`**, y de qué etiqueta de OSM sale cada valor:

| Valor | Qué es | Etiqueta |
|---|---|---|
| `track` | Vía propia, separada del tráfico | `highway=cycleway`, `cycleway=track` |
| `lane` | Carril pintado dentro de la calzada | `cycleway=lane` |
| `shared` | Vía compartida, señalizada para bicis | `bicycle=designated` |

**Lo que deliberadamente NO tiene**, y por qué: sentido de circulación, pendiente, restricciones de
giro. Todo eso lo sabe Valhalla, que es quien decide rutas
([0006](decisiones/0006-valhalla-para-ruteo.md)). Esta tabla responde **una sola pregunta** —
*"¿qué ciclovías hay cerca de mí?"*— porque el dibujo del mapa tampoco sale de aquí
([0026](decisiones/0026-ciclovias-dibujadas-desde-el-tile.md)). Meterle campos que nadie consulta
es cargar el import con datos muertos.

**Cómo escala:** `length_m` precalculado con `ST_Length` si contar kilómetros de red se vuelve
frecuente; `lit`, `oneway` o `width` si algún día la app los muestra. Todos son columnas nuevas
sobre la misma clave — ninguno obliga a rehacer nada.

### `osm_imports`

Una fila por corrida de `osm:update` ([0020](decisiones/0020-actualizacion-de-datos-en-un-comando.md)).
Existe por un problema concreto: **los datos envejecen hasta que alguien corra el comando**, y sin
esto no hay forma de saber cuánto.

| Columna | Tipo | Nulo | Qué es | Para qué sirve |
|---|---|---|---|---|
| `id` | `uuid` **PK** | no | Identificador de la corrida | Referenciarla desde logs |
| `extract_date` | `date` | no | La fecha del `.pbf` de Geofabrik | La edad **real** de los datos. Poder decir "datos de OSM al 3 de septiembre" |
| `imported_at` | `timestamptz` | no | Cuándo se corrió el comando | Distingue "los datos son viejos" de "hace mucho que no corro esto" |
| `cycleway_count` | `integer` | no | Cuántos tramos entraron | **Chequeo de sanidad**: si pasa de 4.000 a 12, la ingesta falló y hay que mirar |

**Cómo escala:** `duration_s` y un `status` cuando la ingesta corra sola por cron; un
`routing_graph_built` cuando importe distinguir si el grafo de Valhalla se reconstruyó en esa misma
corrida o no.

## Teléfono — SQLite, con Drizzle

Dos tablas, escritas con Drizzle igual que las del servidor
([0033](decisiones/0033-drizzle-tambien-en-el-telefono.md)). La forma sale entera del requisito que
decidió [0013](decisiones/0013-recorrido-en-sqlite-local.md): **una caída a los 40 minutos tiene
que perder segundos, no el recorrido.**

```ts
// apps/mobile/src/db/schema.ts
import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core'

export const rides = sqliteTable('rides', {
  id:             text('id').primaryKey(),            // uuid generado en el teléfono
  startedAt:      integer('started_at').notNull(),    // epoch en milisegundos
  endedAt:        integer('ended_at'),                // nulo mientras se graba
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
}, (t) => [ primaryKey({ columns: [t.rideId, t.seq] }) ])
```

SQLite solo tiene `INTEGER`, `REAL` y `TEXT`, así que las fechas se guardan como **epoch en
milisegundos** y los `uuid` como texto.

### `rides`

La cabecera de un recorrido.

| Columna | Tipo | Nulo | Qué es | Para qué sirve |
|---|---|---|---|---|
| `id` | `TEXT` **PK** | no | `uuid` generado **en el teléfono** | Que la sincronización futura no necesite que el servidor asigne nada |
| `started_at` | `INTEGER` | no | Epoch en milisegundos | Ordenar el historial y calcular la duración |
| `ended_at` | `INTEGER` | **sí** | Epoch ms del fin. **Nulo mientras se graba** | Detectar al abrir la app que el sistema mató la tarea: hay un recorrido sin cerrar |
| `distance_m` | `REAL` | no, `0` | Metros acumulados | Los kilómetros del historial. Se **acumula punto a punto**, no se calcula al final |
| `destination_lat` | `REAL` | sí | A dónde ibas | Mostrar el destino en el historial. Nulo si saliste sin rumbo fijo |
| `destination_lng` | `REAL` | sí | Idem | Idem |

**Cómo escala:** `synced_at` cuando lleguen las cuentas; `title` para nombrar un recorrido;
`moving_time_s` para separar el tiempo parado del pedaleado; `elevation_gain_m` para el desnivel;
`planned_polyline` para poder comparar la ruta propuesta con la que realmente se hizo — que es una
de las cosas más útiles que este modelo permitirá medir.

### `ride_points`

Los puntos GPS, insertados **a medida que llegan**.

| Columna | Tipo | Nulo | Qué es | Para qué sirve |
|---|---|---|---|---|
| `ride_id` | `TEXT` **PK** | no | A qué recorrido pertenece | Agrupar. `ON DELETE CASCADE` |
| `seq` | `INTEGER` **PK** | no | Orden dentro del recorrido | Reconstruir la línea sin depender de empates de reloj |
| `lat` | `REAL` | no | Latitud | Dibujar el trazado |
| `lng` | `REAL` | no | Longitud | Idem |
| `recorded_at` | `INTEGER` | no | Epoch ms **del fix del GPS** | Los puntos se escriben en lotes; la hora de escritura no dice cuándo estuviste ahí |
| `accuracy_m` | `REAL` | no | Radio de error que reporta el GPS | Poder descartar un fix de 80 m **después**. Si no se guarda, ya no se distingue del bueno |
| `altitude_m` | `REAL` | sí | Altitud | Desnivel acumulado más adelante. Con la Costa Verde tiene sentido guardarlo |
| `speed_mps` | `REAL` | sí | Velocidad instantánea del GPS | Más barato que derivarla, y sirve para detectar paradas |

Se guarda el **GPS crudo**, sin ajustar a la vía. Valhalla sabe hacer *map matching*
([glosario](glosario.md)), pero eso es una llamada al servidor y el MVP graba sin conexión. Se puede
aplicar después sin perder nada: el crudo es la fuente.

**Cómo escala:** no crece. Esta tabla ya tiene lo que hace falta, y lo que se añada después
—trazado ajustado, puntos filtrados— son derivados que se calculan, no columnas nuevas.

## Lo que no es una tabla

`packages/contracts` ([0002](decisiones/0002-layout-del-repo.md)) define lo que viaja entre el API
y la app. No se guarda en ninguna parte, pero es igual de parte del modelo:

```ts
type NearbyCyclewaysQuery = { lat: number; lng: number; radiusM: number }
type CyclewayNearby = {
  osmId: number
  name: string | null
  kind: 'track' | 'lane' | 'shared'
  surface: string | null
  distanceM: number          // lo calcula PostGIS, no el móvil
}

type RoutePlanRequest = {
  from: { lat: number; lng: number }
  to:   { lat: number; lng: number }
}
type RoutePlanResponse = {
  distanceM:  number
  durationS:  number
  polyline:   string         // codificada con precisión 6 — ver 0003
}
```

## Después del MVP

Cuando lleguen las cuentas, el servidor suma tres tablas. No están decididas
([0010](decisiones/0010-alcance-del-mvp.md) las dejó fuera), pero la forma se anticipa aquí porque
es lo que hace que el modelo del MVP sea escalable y no un callejón.

### `users`

| Columna | Tipo | Qué es |
|---|---|---|
| `id` | `uuid` **PK** | Identificador de la cuenta |
| `email` | `text` único | Con qué inicia sesión |
| `password_hash` | `text` | Nunca la contraseña |
| `created_at` | `timestamptz` | Cuándo se registró |

### `sessions`

| Columna | Tipo | Qué es |
|---|---|---|
| `id` | `uuid` **PK** | La sesión |
| `user_id` | `uuid` → `users` | De quién |
| `token_hash` | `text` | El token guardado hasheado: si se filtra la base, no sirve |
| `created_at` · `last_used_at` · `expires_at` | `timestamptz` | Caducar y ver sesiones activas |
| `revoked_at` | `timestamptz` nulo | **Cerrar sesión es escribir aquí.** Es la ventaja del token opaco sobre el JWT |

### `rides`, la del servidor

| Columna | Tipo | Qué es |
|---|---|---|
| `id` | `uuid` **PK** | **El mismo id que generó el teléfono.** Ésa es toda la gracia |
| `user_id` | `uuid` → `users` | De quién es el recorrido |
| `started_at` · `ended_at` | `timestamptz` | Igual que en el teléfono |
| `distance_m` | `double precision` | Igual |
| `track` | `geometry(LineString, 4326)` | El trazado entero, en **una** columna |
| `uploaded_at` | `timestamptz` | Cuándo se sincronizó |

Y ahí aparece una **asimetría deliberada** con el teléfono:

| | Teléfono | Servidor |
|---|---|---|
| El trazado se guarda como | ~3.600 filas en `ride_points` | **una** columna `track geometry(LineString, 4326)` |
| Por qué | Llega punto a punto y puede cortarse | Llega completo, de una vez |

Es la misma diferencia que separa las dos bases: una escribe mientras el dato ocurre, la otra lo
recibe terminado. La conversión es `ST_MakeLine` sobre los puntos ordenados por `seq`, y a partir
de ahí `ST_Length` da los kilómetros y cruzar con `cycleways` responde *"¿cuántos km fueron sobre
ciclovía?"* — que es la consulta que justificó PostGIS
([0011](decisiones/0011-postgis-desde-el-inicio.md)).

## Por qué dos entidades no tienen `id`

`cycleways` y `ride_points` no llevan una columna `id`. Son dos razones distintas.

**`cycleways` ya tiene un id, y no es nuestro.** Su clave es `osm_id`. Un `uuid` propio sería una
segunda identidad para la misma cosa, y la peor de las dos: como
[0012](decisiones/0012-ingesta-de-osm-por-extracto.md) reemplaza la tabla entera en cada corrida,
ese uuid cambiaría en cada ingesta. Un identificador que cambia para el mismo objeto real no
identifica nada. `osm_id`, en cambio, es estable entre ingestas y **estable en el mundo**:
`openstreetmap.org/way/<osm_id>` abre ese mismo tramo y permite corregirlo si está mal mapeado.
Eso es una **clave natural**.

**`ride_points` no tiene identidad propia.** Su clave es la pareja `(ride_id, seq)`. Un punto no
es una cosa a la que se apunte, que se edite o que se enlace: solo existe como *"el punto 47 de
este recorrido"*, y su identidad **es** su posición en la secuencia. Darle un uuid costaría 3.600
identificadores por hora de recorrido —unos 130 KB en el teléfono— que ninguna consulta usaría
jamás. Es una **entidad débil**: depende de su padre para existir y para identificarse.

### La regla, para la próxima vez

| Situación | Qué clave | Ejemplo |
|---|---|---|
| El dato viene de fuera y ya trae un id estable | **Natural** | `cycleways.osm_id` |
| El dato es nuestro y algo lo va a referenciar | **`uuid` propio** | `rides.id`, `users.id` |
| El dato solo existe dentro de su padre y nadie lo referencia | **Compuesta** (padre + orden) | `ride_points` |

Y el caso relacionado: **`rides.id` es un `uuid` y no un autoincremental** porque se genera en el
teléfono. Dos dispositivos con autoincremental producirían `1, 2, 3…` los dos y chocarían al
sincronizar.

### Lo que se paga

- **Clave natural:** si OSM parte un *way* en dos, el id cambia y para la base es un tramo nuevo.
  Aceptable, porque la tabla se reemplaza entera de todos modos.
- **Clave compuesta:** enlazar algo a un punto concreto exigiría la pareja, no una columna. Y `seq`
  lo asigna la app, no la base.

Si algún día llega el reporte de incidencias —"aquí hay un hueco"— **no sería un campo en
`ride_points`**: sería una entidad nueva con su propio `id`, porque ahí el punto sí pasa a ser algo
que se referencia y se comenta.

## Qué hace escalable a este modelo

Tres decisiones de identidad, y ninguna cuesta nada hoy:

1. **`cycleways.osm_id` como clave** — sobrevive a que la tabla se reemplace entera en cada
   ingesta, que pasa cada vez que se corre `osm:update`.
2. **El `id` del recorrido se genera en el teléfono** — sincronizar será mandar filas con su id ya
   puesto. Sin ida y vuelta, sin reescribir referencias, y sin duplicados si la subida se reintenta.
3. **Los puntos guardan `accuracy_m` y el crudo del GPS** — todo lo que se quiera hacer después
   (filtrar fixes malos, ajustar a la vía, calcular desnivel) sigue siendo posible, porque no se
   tiró información.

Lo demás —columnas nuevas, tablas nuevas— es aditivo. Nada de lo que se decidió obliga a una
migración destructiva más adelante.
