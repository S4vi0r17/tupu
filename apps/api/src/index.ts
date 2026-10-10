import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cyclewaysRoutes } from './features/cycleways/index.ts'
import { routingRoutes } from './features/routing/index.ts'
import { config } from './shared/config.ts'
import { toErrorResponse } from './shared/errors.ts'

const app = new Hono()

app.onError(toErrorResponse)
app.use(compress())

// Fuera de /v1: lo consulta Traefik, no el móvil
app.get('/health', (c) => c.json({ status: 'ok' }))

// Versionado desde el principio: el APK lleva la URL dentro y no se puede forzar a actualizar
const routes = app.route('/v1/cycleways', cyclewaysRoutes).route('/v1/routing', routingRoutes)

/** Lo único que el móvil importa del API: el tipo para su cliente RPC (0004). */
export type AppType = typeof routes

export default {
  port: config.PORT,
  fetch: app.fetch,
}
