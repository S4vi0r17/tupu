import type { CyclewayFeature, CyclewayKind } from '@tupu/contracts'
import { sql } from 'drizzle-orm'
import { db } from '../../shared/db.ts'
import { cycleways } from './schema.ts'

// Unos dos metros: no se nota a escala de ciudad y aligera la respuesta
const SIMPLIFY_TOLERANCE_DEG = 0.00002

// Un metro, por debajo de lo que ya se simplificó
const COORDINATE_DECIMALS = 5

type CyclewayRow = {
  osm_id: string
  kind: CyclewayKind
  name: string | null
  geometry: CyclewayFeature['geometry']
}

export async function findAllCycleways(): Promise<CyclewayFeature[]> {
  const rows = await db.execute<CyclewayRow>(sql`
    select
      ${cycleways.osmId} as osm_id,
      ${cycleways.kind} as kind,
      ${cycleways.name} as name,
      st_asgeojson(
        st_simplifypreservetopology(${cycleways.geom}, ${SIMPLIFY_TOLERANCE_DEG}),
        ${COORDINATE_DECIMALS}
      )::json as geometry
    from ${cycleways}
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
