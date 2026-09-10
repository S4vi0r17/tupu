import type {
  Cycleway,
  CyclewayFeature,
  CyclewayKind,
  CyclewaysInBboxQuery,
  NearbyCyclewaysQuery,
} from '@tupu/contracts'
import { sql } from 'drizzle-orm'
import { db } from '../../shared/db.ts'
import { cycleways } from './schema.ts'

/**
 * Tolerancia de simplificación, en grados. Unos dos metros.
 *
 * WHY A escala de ciudad no se ve la diferencia, y recorta bastante el peso de
 * la respuesta, que viaja por la señal de un teléfono pedaleando.
 */
const SIMPLIFY_TOLERANCE = 0.00002

/** Tope de seguridad: la red entera de Lima son ~2300 tramos. */
const MAX_FEATURES = 5000

// PERF ST_DWithin usa el índice GiST; ST_Distance(...) < r no lo usaría
export async function findNearbyCycleways(query: NearbyCyclewaysQuery): Promise<Cycleway[]> {
  // ! ::geography y no ::geometry: en 4326 las distancias de geometry salen en
  // ! grados, así que un radio de 1000 daría la vuelta al planeta.
  const origin = sql`ST_SetSRID(ST_MakePoint(${query.lng}, ${query.lat}), 4326)::geography`

  return db
    .select({
      osmId: cycleways.osmId,
      name: cycleways.name,
      kind: cycleways.kind,
      surface: cycleways.surface,
      lengthM: sql<number>`ST_Length(${cycleways.geom}::geography)`.mapWith(Number),
    })
    .from(cycleways)
    .where(sql`ST_DWithin(${cycleways.geom}::geography, ${origin}, ${query.radiusM})`)
}

type BboxRow = {
  osm_id: string
  kind: CyclewayKind
  name: string | null
  geometry: CyclewayFeature['geometry']
}

/** Las ciclovías del área visible del mapa, ya en GeoJSON. */
export async function findCyclewaysInBbox(bbox: CyclewaysInBboxQuery): Promise<CyclewayFeature[]> {
  // ! El recuadro también se compara como geography: el índice está sobre esa
  // ! expresión, y con ::geometry el planificador vuelve a recorrer la tabla.
  const envelope = sql`ST_MakeEnvelope(${bbox.west}, ${bbox.south}, ${bbox.east}, ${bbox.north}, 4326)::geography`

  const rows = await db.execute<BboxRow>(sql`
    select
      ${cycleways.osmId} as osm_id,
      ${cycleways.kind} as kind,
      ${cycleways.name} as name,
      st_asgeojson(st_simplifypreservetopology(${cycleways.geom}, ${SIMPLIFY_TOLERANCE}))::json as geometry
    from ${cycleways}
    where st_intersects(${cycleways.geom}::geography, ${envelope})
    limit ${MAX_FEATURES}
  `)

  return Array.from(rows).map((row) => ({
    type: 'Feature' as const,
    geometry: row.geometry,
    properties: {
      osmId: Number(row.osm_id),
      kind: row.kind,
      name: row.name,
    },
  }))
}
