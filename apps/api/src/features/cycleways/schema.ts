import {
  bigint,
  customType,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

/**
 * Columna de PostGIS. Drizzle solo trae `geometry` para puntos, así que la
 * línea del tramo se declara a mano. 4326 es lat/lng, como todo el proyecto.
 */
const lineString4326 = customType<{ data: string; driverData: string }>({
  dataType: () => 'geometry(LineString,4326)',
})

export const cyclewayKind = pgEnum('cycleway_kind', ['track', 'lane', 'shared'])

export const cycleways = pgTable(
  'cycleways',
  {
    // WHY La PK es el id de OSM y no uno propio: cada ingesta reemplaza la
    // tabla entera, y un id nuestro no sobreviviría a la corrida (0012).
    osmId: bigint('osm_id', { mode: 'number' }).primaryKey(),
    name: text('name'),
    kind: cyclewayKind('kind').notNull(),
    surface: text('surface'),
    geom: lineString4326('geom').notNull(),
  },
  (table) => [
    // PERF Sin el índice GiST, ST_DWithin recorre la tabla entera
    index('cycleways_geom_idx').using('gist', table.geom),
  ],
)

export const osmImports = pgTable('osm_imports', {
  id: uuid('id').primaryKey().defaultRandom(),
  /** Fecha del `.pbf` de Geofabrik: la edad real de los datos. */
  extractDate: date('extract_date').notNull(),
  importedAt: timestamp('imported_at', { withTimezone: true }).notNull().defaultNow(),
  /** Chequeo de sanidad: una caída brusca respecto de la corrida anterior es una ingesta rota. */
  cyclewayCount: integer('cycleway_count').notNull(),
})
