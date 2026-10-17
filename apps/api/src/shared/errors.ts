import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

/** Valhalla o PostGIS fallaron. Sale como 503, para distinguirlo de «no hay ruta». */
export class UpstreamError extends Error {
  constructor(
    readonly upstream: string,
    override readonly cause?: unknown,
  ) {
    super(`La dependencia ${upstream} no respondió correctamente`)
    this.name = 'UpstreamError'
  }
}

/** Valhalla respondió, pero no hay camino en bici entre los dos puntos. Sale como 422. */
export class NoRouteError extends Error {
  constructor(override readonly cause?: unknown) {
    super('No hay ruta entre los puntos pedidos')
    this.name = 'NoRouteError'
  }
}

type ErrorBody = {
  error: { code: string; message: string }
}

export function toErrorResponse(error: Error, c: Context) {
  if (error instanceof HTTPException) {
    const body: ErrorBody = {
      error: { code: 'bad_request', message: error.message },
    }
    return c.json(body, error.status)
  }

  if (error instanceof NoRouteError) {
    console.info(error.message, error.cause)
    const body: ErrorBody = {
      error: { code: 'no_route', message: 'No hay ruta en bici entre esos puntos.' },
    }
    return c.json(body, 422 satisfies ContentfulStatusCode)
  }

  if (error instanceof UpstreamError) {
    console.error(error.message, error.cause)
    const body: ErrorBody = {
      error: { code: 'upstream_unavailable', message: 'Servicio no disponible. Intenta de nuevo.' },
    }
    return c.json(body, 503 satisfies ContentfulStatusCode)
  }

  console.error('Error no controlado', error)
  const body: ErrorBody = {
    error: { code: 'internal', message: 'Algo salió mal' },
  }
  return c.json(body, 500 satisfies ContentfulStatusCode)
}
