import { zValidator } from '@hono/zod-validator'
import { cyclewaysInBboxQuerySchema, nearbyCyclewaysQuerySchema } from '@tupu/contracts'
import { Hono } from 'hono'
import { findCyclewaysInBbox, findNearbyCycleways } from './queries.ts'

export const cyclewaysRoutes = new Hono()
  .get('/nearby', zValidator('query', nearbyCyclewaysQuerySchema), async (c) => {
    const cycleways = await findNearbyCycleways(c.req.valid('query'))
    return c.json({ cycleways })
  })
  .get('/in-bbox', zValidator('query', cyclewaysInBboxQuerySchema), async (c) => {
    const features = await findCyclewaysInBbox(c.req.valid('query'))
    return c.json({ type: 'FeatureCollection' as const, features })
  })
