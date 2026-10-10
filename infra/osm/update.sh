#!/usr/bin/env bash
# Ciclovías de PostGIS y grafo de Valhalla desde la misma descarga (0020)
set -euo pipefail

INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$INFRA_DIR"

# Por defecto, el compose de desarrollo; en el VPS se pasan los de Dokploy (infra/README.md)
COMPOSE_FILE="${COMPOSE_FILE:-compose.yaml}"
COMPOSE_PROJECT="${COMPOSE_PROJECT:-tupu}"
ENV_FILE="${ENV_FILE:-../apps/api/.env}"

EXTRACT_URL="${EXTRACT_URL:-https://download.geofabrik.de/south-america/peru-latest.osm.pbf}"
PBF="/data/pbf/peru-latest.osm.pbf"

# Elevación solo de Lima; sin ella, use_hills no hace nada (0029)
ELEVATION_BBOX="${ELEVATION_BBOX:--77.25,-12.55,-76.65,-11.60}"

compose() { docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@"; }

echo '==> 1/4  Levantando PostGIS'
compose up -d --wait postgis

echo '==> 2/4  Descargando el extracto de Perú'
# -z baja solo si hay uno más nuevo. Va a un .part: un corte no deja un .pbf roto con fecha nueva
compose run --rm osm sh -c "
  set -e
  mkdir -p /data/pbf
  rm -f '$PBF.part'
  [ -f '$PBF' ] && nuevo_si='-z $PBF' || nuevo_si=''
  curl --fail --location --remote-time --progress-bar \$nuevo_si -o '$PBF.part' '$EXTRACT_URL'

  # Con 304 curl no escribe nada: lo bajado sigue siendo lo más nuevo
  if [ -s '$PBF.part' ]; then
    # -F porque .part no le dice el formato; -e lo lee entero, así un corte falla
    osmium fileinfo -e -F pbf '$PBF.part' > /dev/null
    mv '$PBF.part' '$PBF'
  fi
  ls -lh '$PBF'
"

echo '==> 3/4  Ciclovías a PostGIS'
compose run --rm -e "OSM_PBF=$PBF" osm bun apps/api/src/features/cycleways/ingest.ts

echo '==> 4/4  Grafo de Valhalla'
# En tiles.new, para que Valhalla siga sirviendo mientras se construye (0020)
compose run --rm --entrypoint bash valhalla -c "
  set -euo pipefail
  rm -rf /data/tiles.new /data/valhalla.new.json

  valhalla_build_config \
    --mjolnir-tile-dir /data/tiles.new \
    --mjolnir-admin /data/admins.sqlite \
    --mjolnir-timezone /data/timezones.sqlite \
    --additional-data-elevation /data/elevation \
    > /data/valhalla.new.json

  [ -f /data/timezones.sqlite ] || valhalla_build_timezones > /data/timezones.sqlite
  valhalla_build_admins -c /data/valhalla.new.json '$PBF'

  # Antes de build_tiles: si llega después, el grafo queda sin pendientes
  valhalla_build_elevation -c /data/valhalla.new.json -b '$ELEVATION_BBOX' -o /data/elevation

  valhalla_build_tiles -c /data/valhalla.new.json '$PBF'

  rm -rf /data/tiles.old
  [ -d /data/tiles ] && mv /data/tiles /data/tiles.old
  mv /data/tiles.new /data/tiles
  sed 's#/data/tiles.new#/data/tiles#g' /data/valhalla.new.json > /data/valhalla.json
  rm -rf /data/tiles.old /data/valhalla.new.json
"

echo '==> Reiniciando el motor de ruteo con el grafo nuevo'
compose up -d --force-recreate --wait valhalla

echo 'Listo. Datos de OSM actualizados en PostGIS y en Valhalla.'
