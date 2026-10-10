import { sql } from 'drizzle-orm'
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

// Drizzle solo trae geometry para puntos
const lineString4326 = customType<{ data: string; driverData: string }>({
  dataType: () => 'geometry(LineString,4326)',
})

export const cyclewayKind = pgEnum('cycleway_kind', ['track', 'lane', 'shared'])

export const cycleways = pgTable(
  'cycleways',
  {
    // Un id propio no sobreviviría: cada ingesta reemplaza la tabla entera (0012)
    osmId: bigint('osm_id', { mode: 'number' }).primaryKey(),
    name: text('name'),
    kind: cyclewayKind('kind').notNull(),
    surface: text('surface'),
    geom: lineString4326('geom').notNull(),
  },
  (table) => [
    // Sobre ::geography porque las consultas miden en metros; sobre geometry daba Seq Scan
    index('cycleways_geom_idx').using('gist', sql`(${table.geom}::geography)`),
  ],
)

export const osmImports = pgTable('osm_imports', {
  id: uuid('id').primaryKey().defaultRandom(),
  // La edad real de los datos, no la de la ingesta
  extractDate: date('extract_date').notNull(),
  importedAt: timestamp('imported_at', { withTimezone: true }).notNull().defaultNow(),
  // Contra este número se compara la próxima ingesta
  cyclewayCount: integer('cycleway_count').notNull(),
})
