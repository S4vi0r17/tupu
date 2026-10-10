import { Hono } from 'hono'
import { findAllCycleways } from './queries.ts'

export const cyclewaysRoutes = new Hono().get('/', async (c) => {
  const features = await findAllCycleways()
  return c.json({ type: 'FeatureCollection' as const, features })
})
