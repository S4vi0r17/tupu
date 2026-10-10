import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/features/**/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  // Sin esto Drizzle intenta borrar las tablas internas de PostGIS (0007)
  extensionsFilters: ['postgis'],
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
})
