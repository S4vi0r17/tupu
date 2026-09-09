# Imagen de un solo uso para osm:update. No es la del API: lleva osmium y
# ogr2ogr, que pesan y solo hacen falta al actualizar los datos (0012, 0020).
FROM oven/bun:1-debian

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      osmium-tool \
      gdal-bin \
      ca-certificates \
      curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /repo
