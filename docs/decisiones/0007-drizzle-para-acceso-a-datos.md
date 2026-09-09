# 0007 — Drizzle para el acceso a datos

**Estado:** Aceptada · 2026-09-08

## Contexto

Casi todo lo interesante de esta app es geoespacial, y toda consulta interesante es una variante de
la misma: *"ciclovías a menos de 300 m de este punto, ordenadas por cercanía"*. La elección de
herramienta de acceso a datos se juega ahí, no en el CRUD de usuarios.

### Qué son las funciones `ST_`

PostGIS es una extensión de PostgreSQL que añade tipos geográficos —punto, línea, polígono— y
funciones para operarlos dentro de SQL. Todas llevan el prefijo `ST_`, de *Spatial Type*, del
estándar SQL/MM:

- `ST_Distance(a, b)` → metros entre dos geometrías
- `ST_DWithin(a, b, 300)` → ¿están a menos de 300 m? Usa índice, es rápido
- `ST_Length(track)` → largo de un recorrido, de donde salen los kilómetros
- `ST_MakeLine(puntos)` → convierte los puntos GPS de un viaje en una línea

Sin PostGIS habría que traer todas las ciclovías a memoria y calcular distancias en TypeScript.
Con PostGIS lo resuelve la base en milisegundos.

> Usar PostGIS es en sí una decisión pendiente: depende de si la base guarda geometrías o solo
> metadatos, apuntado en [`../planeacion.md`](../planeacion.md). Esta decisión **asume que sí**;
> si esa se resolviera al revés, conviene revisitar esta.

## Decisión

**Drizzle**, sobre PostgreSQL con PostGIS.

La razón es una sola: trata lo espacial como ciudadano de primera. Si la mayoría de las consultas
llevan `ST_*`, conviene la herramienta donde eso vive **dentro** del sistema de tipos y no fuera.

El caso que lo decidió es `rides`, la tabla central de la app — un recorrido con su trazado:

```ts
// Drizzle: se lee completa y se escribe con el mismo constructor que todo lo demás
const track = sql`ST_GeomFromGeoJSON(${json})`
await db.insert(rides).values({
  userId, startedAt, endedAt, track,
  distanceM: sql`ST_Length(${track}::geography)`,   // los km los calcula PostGIS
}).returning()
```

Con Prisma esa misma tabla se lee **incompleta** —el client borra los campos `Unsupported` del
tipo generado, así que `ride.track` no existe— y se escribe **siempre** por SQL crudo, porque un
modelo con un campo `Unsupported` requerido no se puede crear desde el client.

El anexo al final tiene las tres opciones lado a lado, con esquema, consultas y migraciones.

## Consecuencias

**A favor**

- **Un solo estilo de acceso a datos en todo el repo.** La consulta espacial y el `SELECT` más
  aburrido de la tabla de usuarios se escriben igual.
- **Los refactors rompen en compilación.** `${cycleways.geom}` es una referencia, no un string:
  renombrar la columna rompe también las consultas con `ST_*`. Con las otras dos opciones eso
  falla cuando un usuario abre su historial.
- **Sin shadow database.** Las migraciones no necesitan crear ni destruir bases temporales, lo que
  simplifica tanto el Docker local como cualquier base administrada más adelante.
- Sin fricción sobre Bun.

**En contra**

- **Las migraciones con PostGIS siempre hay que revisarlas.** Drizzle no sabe crear la extensión:
  el `CREATE EXTENSION IF NOT EXISTS postgis;` va a mano en una primera migración `--custom`, y
  los cambios de tipo sobre una columna geométrica los emite como `DROP` + `ADD`.
- **`drizzle-kit push` es peligroso aquí.** Sin `extensionsFilters: ['postgis']` en la config, ve
  `geometry_columns` y `spatial_ref_sys` como tablas huérfanas y propone borrarlas. Queda prohibido
  contra cualquier base que no sea desechable.
- **El tipo `geometry` nativo solo entiende de puntos.** Las líneas —ciclovías y trazados, o sea
  casi todo— se declaran con `customType`. Son cuatro líneas, pero es una pieza propia que
  mantener.
- **Documentación floja y roturas entre versiones menores.** Hay que fijar la versión y leer los
  changelogs antes de subirla.

## Alternativas descartadas

- **Prisma** — el mejor CRUD de los tres y el flujo de migraciones más guiado, y en la parte de
  esquema es más capaz de lo que suele decirse: sabe activar la extensión y declarar el índice
  GiST. Se descartó por el client, no por el esquema: parte el código en dos mitades con reglas
  distintas —la tipada, y la ciega para todo lo geo— y la mitad ciega es justamente el corazón de
  la app.
- **SQL plano con postgres.js** — la mejor versión de las consultas espaciales, sin capa
  intermedia. Se descartó porque es desproporcionado para las tablas normales y porque sin enlace
  entre esquema y consulta cada refactor pasa a ser una búsqueda de texto.

---

# Anexo — sintaxis y migraciones, lado a lado

Añadido el 2026-09-08, porque la comparación de una sola consulta no alcanzaba para decidir.

El ejemplo es una rebanada real del esquema: `cycleways` (la red de OSM, líneas) y `rides` (un
recorrido guardado, también una línea). Sobre ellas, las tres operaciones que se van a escribir
cientos de veces:

1. **CRUD aburrido** — los últimos 20 recorridos de un usuario.
2. **Consulta espacial** — ciclovías a menos de 300 m, por cercanía.
3. **Escribir geometría** — guardar un recorrido y que la base calcule sus kilómetros.

## Drizzle

### Esquema

```ts
// apps/api/src/db/schema.ts
import { pgTable, uuid, text, bigint, timestamp, doublePrecision, index, customType } from 'drizzle-orm/pg-core'

// Drizzle trae un tipo `geometry` nativo, pero solo entiende de puntos.
// Para líneas se declara a mano: son cuatro líneas y se escriben una vez.
const lineString = customType<{ data: string }>({
  dataType: () => 'geometry(LineString, 4326)',
})

export const cycleways = pgTable('cycleways', {
  id: uuid('id').primaryKey().defaultRandom(),
  osmId: bigint('osm_id', { mode: 'number' }).notNull().unique(),
  name: text('name'),
  surface: text('surface'),
  geom: lineString('geom').notNull(),
}, (t) => [
  index('cycleways_geom_idx').using('gist', t.geom),
])

export const rides = pgTable('rides', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }).notNull(),
  track: lineString('track').notNull(),
  distanceM: doublePrecision('distance_m').notNull(),
})
```

### Las tres operaciones

```ts
// 1 · CRUD — tipado de punta a punta, sin escribir el tipo de retorno
const lastRides = await db.query.rides.findMany({
  where: eq(rides.userId, userId),
  orderBy: desc(rides.startedAt),
  limit: 20,
})

// 2 · Espacial — mismo constructor, la columna geom es una columna más
const origin = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`

const nearby = await db
  .select({
    id: cycleways.id,
    name: cycleways.name,
    distanceM: sql<number>`ST_Distance(${cycleways.geom}::geography, ${origin})`.as('distance_m'),
  })
  .from(cycleways)
  .where(sql`ST_DWithin(${cycleways.geom}::geography, ${origin}, 300)`)
  .orderBy(sql`distance_m`)
  .limit(20)

// 3 · Escribir geometría — la expresión SQL convive con los valores normales
const track = sql`ST_GeomFromGeoJSON(${JSON.stringify(geojsonLine)})`

const [ride] = await db.insert(rides).values({
  userId,
  startedAt,
  endedAt,
  track,
  distanceM: sql`ST_Length(${track}::geography)`,   // los km los calcula PostGIS
}).returning()
```

Lo que hay que ver: renombrar `geom` en el esquema rompe **las tres** en compilación, incluidas
las que llevan `ST_*`, porque `${cycleways.geom}` es una referencia y no un string.

### Migraciones

```jsonc
// drizzle.config.ts
{
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  extensionsFilters: ['postgis'],   // ← sin esto, drizzle-kit quiere borrar spatial_ref_sys
}
```

El flujo:

```bash
bun drizzle-kit generate --custom --name enable_postgis   # archivo .sql vacío, se llena a mano
bun drizzle-kit generate                                  # compara esquema vs. snapshot, emite SQL
bun drizzle-kit migrate                                   # aplica lo pendiente
```

`generate` produce `drizzle/0001_xxx.sql` más un snapshot JSON del esquema; el snapshot es lo que
usa para saber qué cambió la próxima vez. El SQL sale legible y se puede editar antes de aplicar.

Lo que **no** hace solo:

- **La extensión.** `CREATE EXTENSION IF NOT EXISTS postgis;` se escribe a mano en una primera
  migración `--custom`, y tiene que correr antes de cualquier tabla con geometría.
- **`drizzle-kit push`** (aplicar sin migración, para prototipar) es directamente peligroso contra
  una base con PostGIS si falta `extensionsFilters`: ve `geometry_columns` y `spatial_ref_sys`
  como tablas huérfanas y propone borrarlas.
- Cambios de tipo sobre una columna geométrica los emite como `DROP` + `ADD`. Hay que releer.

## Prisma

### Esquema

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis]              // requiere el preview de abajo
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

model Cycleway {
  id      String  @id @default(uuid())
  osmId   BigInt  @unique @map("osm_id")
  name    String?
  surface String?
  geom    Unsupported("geometry(LineString, 4326)")

  @@index([geom], map: "cycleways_geom_idx", type: Gist)
  @@map("cycleways")
}

model Ride {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  user       User     @relation(fields: [userId], references: [id])
  startedAt  DateTime @map("started_at") @db.Timestamptz
  endedAt    DateTime @map("ended_at")   @db.Timestamptz
  track      Unsupported("geometry(LineString, 4326)")
  distanceM  Float    @map("distance_m")

  @@map("rides")
}
```

Prisma sí sabe declarar el índice GiST (`type: Gist`) y sí sabe activar la extensión — dos puntos
a su favor frente a lo que suele decirse de él. El problema no está en el esquema.

### Las tres operaciones

```ts
// 1 · CRUD — el más limpio de los tres… con una trampa
const lastRides = await prisma.ride.findMany({
  where: { userId },
  orderBy: { startedAt: 'desc' },
  take: 20,
})
// `lastRides[0].track` NO EXISTE. Prisma borra los campos Unsupported del tipo generado.
// Para dibujar el recorrido en el mapa hace falta una segunda consulta, cruda.

// 2 · Espacial — fuera del client, con el tipo de retorno escrito a mano
const nearby = await prisma.$queryRaw<
  { id: string; name: string | null; distance_m: number }[]
>`
  SELECT id, name,
         ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography) AS distance_m
  FROM cycleways
  WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, 300)
  ORDER BY distance_m
  LIMIT 20
`

// 3 · Escribir geometría — prisma.ride.create() no compila: `track` es requerido y Unsupported
await prisma.$executeRaw`
  INSERT INTO rides (id, user_id, started_at, ended_at, track, distance_m)
  VALUES (
    gen_random_uuid(), ${userId}::uuid, ${startedAt}, ${endedAt},
    ST_GeomFromGeoJSON(${JSON.stringify(geojsonLine)}),
    ST_Length(ST_GeomFromGeoJSON(${JSON.stringify(geojsonLine)})::geography)
  )
`
```

Tres cosas concretas que salen de ahí:

- **Un modelo con un campo `Unsupported` requerido no se puede crear desde el client.** No es que
  quede feo: `prisma.ride.create()` no existe como opción válida. La tabla central de la app se
  escribe siempre por SQL crudo.
- **`findMany` miente por omisión.** Devuelve el recorrido sin su trazado, y nada avisa.
- `$queryRaw` devuelve `BigInt` para columnas `bigint` y `Decimal` para `numeric`. `osm_id` sale
  como `BigInt`, que revienta al serializar a JSON. Se arregla, pero hay que saberlo.

### Migraciones

```bash
bunx prisma migrate dev --name add_cycleways    # genera, aplica y regenera el client
bunx prisma migrate dev --create-only           # genera y para, para editar el SQL a mano
bunx prisma migrate deploy                      # en CI y producción
```

Es el flujo más guiado de los tres, y en desarrollo detecta *drift*: si alguien tocó la base a
mano, avisa y ofrece rehacerla. El precio de eso es la **shadow database**: para calcular el
diff, `migrate dev` crea y destruye una base temporal en cada corrida. Implica que el usuario de
Postgres necesite permiso de `CREATE DATABASE`, y que PostGIS esté disponible también ahí. En el
Docker local es gratis; contra una base administrada es un trámite.

## SQL plano, con postgres.js

### Esquema

Es un archivo `.sql` escrito a mano, que además es la documentación del esquema:

```sql
-- infra/db/migrations/002_cycleways.sql
CREATE TABLE cycleways (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  osm_id  bigint NOT NULL UNIQUE,
  name    text,
  surface text,
  geom    geometry(LineString, 4326) NOT NULL
);
CREATE INDEX cycleways_geom_idx ON cycleways USING gist (geom);
```

Y en TypeScript, los tipos se declaran aparte y **nada garantiza que coincidan**:

```ts
type Cycleway = { id: string; osmId: number; name: string | null; surface: string | null }
```

### Las tres operaciones

```ts
const sql = postgres(process.env.DATABASE_URL!, { transform: postgres.camel })
// ↑ transform: camel convierte started_at → startedAt automáticamente

// 1 · CRUD — verboso, y el tipo lo prometes tú
const lastRides = await sql<Ride[]>`
  SELECT id, started_at, ended_at, distance_m
  FROM rides
  WHERE user_id = ${userId}
  ORDER BY started_at DESC
  LIMIT 20
`

// 2 · Espacial — la mejor versión de las tres: es SQL y ya
const nearby = await sql<{ id: string; name: string | null; distanceM: number }[]>`
  SELECT id, name, ST_Distance(geom::geography, ${origin}) AS distance_m
  FROM cycleways
  WHERE ST_DWithin(geom::geography, ${origin}, 300)
  ORDER BY distance_m
  LIMIT 20
`

// 3 · Escribir geometría — sin ceremonia
const [ride] = await sql`
  INSERT INTO rides (user_id, started_at, ended_at, track, distance_m)
  VALUES (
    ${userId}, ${startedAt}, ${endedAt},
    ST_GeomFromGeoJSON(${json}),
    ST_Length(ST_GeomFromGeoJSON(${json})::geography)
  )
  RETURNING id, distance_m
`
```

Las interpolaciones `${}` de postgres.js son parámetros de verdad, no concatenación: no hay riesgo
de inyección. Eso no es lo que se pierde. Lo que se pierde es que renombrar `distance_m` no rompe
nada hasta que un usuario abre su historial.

### Migraciones

No trae. Hay que elegir:

- **Un runner propio** — unas 40 líneas: leer `infra/db/migrations/*.sql` en orden, comparar contra
  una tabla `schema_migrations`, aplicar lo que falte dentro de una transacción. Es honestamente
  poco código y no tiene magia.
- **Una herramienta externa** — `dbmate` o `Atlas`, que además dan `down` migrations.

En ninguno de los dos casos hay diff automático: cada cambio de esquema se escribe a mano, dos
veces si se quiere reversible.

## Lo que se ve al ponerlos juntos

**Con PostGIS los tres terminan escribiendo SQL a mano en la parte espacial.** Drizzle no genera
la extensión, Prisma no puede tocar la columna desde el client, y el SQL plano es SQL. La
diferencia no está ahí: está en qué te dan gratis en el 80 % restante, y en si el 20 % espacial
queda *dentro* o *fuera* del sistema de tipos.

| | Drizzle | Prisma | SQL plano |
|---|---|---|---|
| Leer un recorrido con su trazado | una consulta | **dos**: el client no ve `track` | una |
| Guardar un recorrido | `.insert()` con un `sql` dentro | `$executeRaw` obligatorio | `sql` |
| Renombrar `geom` | rompe en compilación | compila, falla en producción | falla en producción |
| Diff automático de esquema | sí, revisando el SQL | sí, el mejor | no |
| Reversión de migración | a mano | `migrate diff` ayuda | según la herramienta |
| Requiere shadow database | no | **sí** en desarrollo | no |
