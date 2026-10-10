import { sql } from 'drizzle-orm'
import { closeDb, db } from '../../shared/db.ts'
import { osmImports } from './schema.ts'

const PBF_PATH = process.env.OSM_PBF ?? '/repo/infra/data/peru-latest.osm.pbf'
const FILTERED_PATH = '/tmp/tupu-cycleways.osm.pbf'
const RAW_TABLE = 'osm_cycleways_raw'

// Una red que se encoge a menos de la mitad es una ingesta rota, no una ciudad que borró ciclovías
const MAX_SHRINK_RATIO = 0.5

async function run(command: string[]): Promise<string> {
  const proc = Bun.spawn(command, { stdout: 'pipe', stderr: 'pipe' })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])

  if (exitCode !== 0) throw new Error(`${command[0]} falló:\n${stderr}`)
  return stdout.trim()
}

// En Lima el carril pintado va casi siempre en cycleway:left/right: sin eso falta un tercio
const CYCLING_VALUES = 'lane,track,shared_lane,opposite_lane,opposite_track'

async function filterCycleways(): Promise<void> {
  await run([
    'osmium',
    'tags-filter',
    PBF_PATH,
    'w/highway=cycleway',
    `w/cycleway=${CYCLING_VALUES}`,
    `w/cycleway:both=${CYCLING_VALUES}`,
    `w/cycleway:left=${CYCLING_VALUES}`,
    `w/cycleway:right=${CYCLING_VALUES}`,
    'w/bicycle=designated',
    '--overwrite',
    '-o',
    FILTERED_PATH,
  ])
}

async function loadRawTable(): Promise<void> {
  await run([
    'ogr2ogr',
    '-f',
    'PostgreSQL',
    `PG:${process.env.DATABASE_URL}`,
    FILTERED_PATH,
    'lines',
    '-nln',
    RAW_TABLE,
    '-overwrite',
    '-nlt',
    'LINESTRING',
    '-lco',
    'GEOMETRY_NAME=geom',
    // Las etiquetas que no son columna llegan en other_tags con formato hstore
    '-lco',
    'COLUMN_TYPES=other_tags=hstore',
  ])
}

async function readExtractDate(): Promise<string> {
  const timestamp = await run([
    'osmium',
    'fileinfo',
    '-e',
    '-g',
    'header.option.osmosis_replication_timestamp',
    PBF_PATH,
  ])

  // Sin ese encabezado la mejor fecha disponible es la del archivo
  if (!timestamp) return new Date(Bun.file(PBF_PATH).lastModified).toISOString().slice(0, 10)
  return timestamp.slice(0, 10)
}

async function replaceCycleways(extractDate: string): Promise<number> {
  const [previous] = await db
    .select({ count: osmImports.cyclewayCount })
    .from(osmImports)
    .orderBy(sql`${osmImports.importedAt} desc`)
    .limit(1)

  return db.transaction(async (tx) => {
    await tx.execute(sql`truncate table cycleways`)

    const inserted = await tx.execute(sql`
      insert into cycleways (osm_id, name, kind, surface, geom)
      select distinct on (osm_id)
        osm_id::bigint,
        name,
        -- El orden importa: track gana a lane, y lane gana a shared
        case
          when highway = 'cycleway'
            or coalesce(other_tags -> 'cycleway', '') = 'track'
            or coalesce(other_tags -> 'cycleway:both', '') = 'track'
            or coalesce(other_tags -> 'cycleway:left', '') = 'track'
            or coalesce(other_tags -> 'cycleway:right', '') = 'track'
            then 'track'
          when coalesce(other_tags -> 'cycleway', '') in ('lane', 'opposite_lane')
            or coalesce(other_tags -> 'cycleway:both', '') in ('lane', 'opposite_lane')
            or coalesce(other_tags -> 'cycleway:left', '') in ('lane', 'opposite_lane')
            or coalesce(other_tags -> 'cycleway:right', '') in ('lane', 'opposite_lane')
            then 'lane'
          else 'shared'
        end::cycleway_kind,
        other_tags -> 'surface',
        st_force2d(geom)
      from ${sql.identifier(RAW_TABLE)}
      where osm_id is not null and geom is not null
    `)

    const count = inserted.count ?? 0

    if (previous && count < previous.count * MAX_SHRINK_RATIO) {
      throw new Error(
        `La ingesta bajó de ${previous.count} a ${count} tramos. Se revierte: revisá el extracto.`,
      )
    }

    await tx.insert(osmImports).values({ extractDate, cyclewayCount: count })
    await tx.execute(sql`drop table if exists ${sql.identifier(RAW_TABLE)}`)

    return count
  })
}

console.log('Filtrando ciclovías del extracto…')
await filterCycleways()

console.log('Cargando en PostGIS…')
await loadRawTable()

const extractDate = await readExtractDate()
const count = await replaceCycleways(extractDate)

console.log(`Listo: ${count} tramos, datos de OSM al ${extractDate}`)
await closeDb()
