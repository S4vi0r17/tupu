# ! El contexto de build es la raíz del repo, no esta carpeta: sin bun.lock ni
# ! packages/ no hay instalación posible (0001, 0009).
FROM oven/bun:1.4.0-alpine

WORKDIR /repo

# Los manifiestos primero: la capa de dependencias se reaprovecha mientras no
# cambien, aunque cambie el código.
COPY package.json bun.lock bunfig.toml ./
COPY apps/api/package.json apps/api/
COPY apps/mobile/package.json apps/mobile/
COPY packages/contracts/package.json packages/contracts/
COPY packages/geo/package.json packages/geo/

# --filter deja fuera las dependencias del móvil, que acá no pintan nada
RUN bun install --frozen-lockfile --filter '@tupu/api'

COPY packages packages
COPY apps/api apps/api

WORKDIR /repo/apps/api
USER bun
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

# WHY Las migraciones corren al arrancar, antes de servir. Vale con una sola
# réplica; con dos habría que sacarlas a un paso previo (0009).
CMD ["sh", "-c", "bun run db:migrate && bun run start"]
