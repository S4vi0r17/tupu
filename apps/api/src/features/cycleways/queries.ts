import type { Cycleway, NearbyCyclewaysQuery } from '@tupu/contracts'
import { sql } from 'drizzle-orm'
import { db } from '../../shared/db.ts'
import { cycleways } from './schema.ts'

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
