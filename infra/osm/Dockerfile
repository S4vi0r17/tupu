# Solo para osm:update: osmium y ogr2ogr no van en la imagen del API (0012)
FROM oven/bun:1-debian

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      osmium-tool \
      gdal-bin \
      ca-certificates \
      curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /repo
