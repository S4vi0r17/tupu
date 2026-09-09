#!/usr/bin/env bash
# Actualiza los datos de OSM: las ciclovías de PostGIS y el grafo de Valhalla,
# los dos desde la misma descarga para que no puedan desincronizarse (0020).
set -euo pipefail

INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$INFRA_DIR"

EXTRACT_URL="${EXTRACT_URL:-https://download.geofabrik.de/south-america/peru-latest.osm.pbf}"
PBF="/data/pbf/peru-latest.osm.pbf"

# Los tiles de elevación se bajan solo para este recuadro, no para todo el país.
# Sin elevación, use_hills del perfil ciclista no hace absolutamente nada (0029).
ELEVATION_BBOX="${ELEVATION_BBOX:--77.25,-12.55,-76.65,-11.60}"

compose() { docker compose --env-file ../apps/api/.env "$@"; }

echo '==> 1/4  Levantando PostGIS'
compose up -d --wait postgis

echo '==> 2/4  Descargando el extracto de Perú'
# -z descarga solo si Geofabrik tiene algo más nuevo que lo que ya está bajado
compose run --rm osm sh -c "
  mkdir -p /data/pbf
  [ -f '$PBF' ] && nuevo_si='-z $PBF' || nuevo_si=''
  curl --fail --location --progress-bar \$nuevo_si -o '$PBF' '$EXTRACT_URL'
  ls -lh '$PBF'
"

echo '==> 3/4  Ciclovías a PostGIS'
compose run --rm -e "OSM_PBF=$PBF" osm bun apps/api/src/features/cycleways/ingest.ts

echo '==> 4/4  Grafo de Valhalla'
# Se construye al lado, en tiles.new, para que el motor siga sirviendo con los
# datos viejos durante los minutos que tarda. El cambio es el paso final (0020).
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

  # ! Antes de build_tiles: si la elevación llega después, el grafo ya se
  # ! construyó sin pendientes y hay que rehacerlo entero.
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
