import { z } from 'zod'
import { pointSchema } from './geo.ts'

export const routePlanRequestSchema = z.object({
  from: pointSchema,
  to: pointSchema,
})

export const routePlanResponseSchema = z.object({
  distanceM: z.number(),
  durationS: z.number(),
  // Polilínea de Valhalla, con precisión 6
  shape: z.string(),
})

export type RoutePlanRequest = z.infer<typeof routePlanRequestSchema>
export type RoutePlanResponse = z.infer<typeof routePlanResponseSchema>
