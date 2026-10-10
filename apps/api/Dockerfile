# Se construye desde la raíz del repo: necesita bun.lock y packages/ (0001)
FROM oven/bun:1.4.0-alpine

WORKDIR /repo

# Los manifiestos primero, para reaprovechar la capa de dependencias
COPY package.json bun.lock bunfig.toml ./
COPY apps/api/package.json apps/api/
COPY apps/mobile/package.json apps/mobile/
COPY packages/contracts/package.json packages/contracts/
COPY packages/geo/package.json packages/geo/

# --filter deja fuera las dependencias del móvil
RUN bun install --frozen-lockfile --filter '@tupu/api'

COPY packages packages
COPY apps/api apps/api

WORKDIR /repo/apps/api
USER bun
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

# Migra antes de servir; con dos réplicas habría que sacarlo de acá (0009)
CMD ["sh", "-c", "bun run db:migrate && bun run start"]
