import { zValidator } from '@hono/zod-validator'
import { routePlanRequestSchema } from '@tupu/contracts'
import { Hono } from 'hono'
import { planRoute } from './service.ts'

export const routingRoutes = new Hono().post(
  '/plan',
  zValidator('json', routePlanRequestSchema),
  async (c) => {
    const route = await planRoute(c.req.valid('json'))
    return c.json(route)
  },
)
