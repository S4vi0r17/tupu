import { zValidator } from '@hono/zod-validator'
import { nearbyCyclewaysQuerySchema } from '@tupu/contracts'
import { Hono } from 'hono'
import { findNearbyCycleways } from './queries.ts'

export const cyclewaysRoutes = new Hono().get(
  '/nearby',
  zValidator('query', nearbyCyclewaysQuerySchema),
  async (c) => {
    const cycleways = await findNearbyCycleways(c.req.valid('query'))
    return c.json({ cycleways })
  },
)
