import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cyclewaysRoutes } from './features/cycleways/index.ts'
import { routingRoutes } from './features/routing/index.ts'
import { config } from './shared/config.ts'
import { toErrorResponse } from './shared/errors.ts'

const app = new Hono()

app.onError(toErrorResponse)
app.use(compress())

// WHY Sin versión y fuera de /v1: lo consulta Traefik, no el móvil
app.get('/health', (c) => c.json({ status: 'ok' }))

/**
 * WHY El prefijo de versión existe desde el primer día porque el APK lleva la
 * URL dentro y no hay forma de forzar la actualización (0019, 0030).
 */
const routes = app.route('/v1/cycleways', cyclewaysRoutes).route('/v1/routing', routingRoutes)

/** El tipo que consume el cliente RPC del móvil (0004). Es lo único que cruza entre apps. */
export type AppType = typeof routes

export default {
  port: config.PORT,
  fetch: app.fetch,
}
