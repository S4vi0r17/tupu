import { z } from 'zod'

export const cyclewayKindSchema = z.enum(['track', 'lane', 'shared'])

export const nearbyCyclewaysQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  // ! Tope de 5 km: sin él una petición puede pedir la red entera de Lima
  radiusM: z.coerce.number().int().positive().max(5000).default(1000),
})

export const cyclewaySchema = z.object({
  osmId: z.number().int(),
  name: z.string().nullable(),
  kind: cyclewayKindSchema,
  surface: z.string().nullable(),
  lengthM: z.number(),
})

export const nearbyCyclewaysResponseSchema = z.object({
  cycleways: z.array(cyclewaySchema),
})

export type CyclewayKind = z.infer<typeof cyclewayKindSchema>
export type NearbyCyclewaysQuery = z.infer<typeof nearbyCyclewaysQuerySchema>
export type Cycleway = z.infer<typeof cyclewaySchema>
export type NearbyCyclewaysResponse = z.infer<typeof nearbyCyclewaysResponseSchema>

/** El área visible del mapa. Orden oeste, sur, este, norte, como en GeoJSON. */
export const cyclewaysInBboxQuerySchema = z.object({
  west: z.coerce.number().min(-180).max(180),
  south: z.coerce.number().min(-90).max(90),
  east: z.coerce.number().min(-180).max(180),
  north: z.coerce.number().min(-90).max(90),
})

const lineStringSchema = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(z.tuple([z.number(), z.number()])),
})

export const cyclewayFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: lineStringSchema,
  properties: z.object({
    osmId: z.number().int(),
    kind: cyclewayKindSchema,
    name: z.string().nullable(),
  }),
})

/** GeoJSON tal cual, para que el mapa lo consuma sin traducir nada. */
export const cyclewayCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(cyclewayFeatureSchema),
})

export type CyclewaysInBboxQuery = z.infer<typeof cyclewaysInBboxQuerySchema>
export type CyclewayFeature = z.infer<typeof cyclewayFeatureSchema>
export type CyclewayCollection = z.infer<typeof cyclewayCollectionSchema>
