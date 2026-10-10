import { z } from 'zod'

export const cyclewayKindSchema = z.enum(['track', 'lane', 'shared'])

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

export type CyclewayKind = z.infer<typeof cyclewayKindSchema>
export type CyclewayFeature = z.infer<typeof cyclewayFeatureSchema>
export type CyclewayCollection = z.infer<typeof cyclewayCollectionSchema>
