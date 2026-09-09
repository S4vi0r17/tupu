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
