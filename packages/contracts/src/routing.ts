import { z } from 'zod'
import { pointSchema } from './geo.ts'

export const routePlanRequestSchema = z.object({
  from: pointSchema,
  to: pointSchema,
})

export const routePlanResponseSchema = z.object({
  distanceM: z.number(),
  durationS: z.number(),
  // NOTE Polilínea codificada con precisión 6, tal como la devuelve Valhalla
  shape: z.string(),
})

export type RoutePlanRequest = z.infer<typeof routePlanRequestSchema>
export type RoutePlanResponse = z.infer<typeof routePlanResponseSchema>
