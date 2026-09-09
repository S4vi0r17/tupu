import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // El esquema vive junto a cada feature, no centralizado (0008)
  schema: './src/features/**/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  // ! Sin esto Drizzle querría borrar las tablas internas de PostGIS (0007)
  extensionsFilters: ['postgis'],
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
})
