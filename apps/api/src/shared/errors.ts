import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

/**
 * Falla de una dependencia externa: Valhalla o PostGIS.
 *
 * @remarks Se traduce a 503 para que el móvil distinga «no hay ruta» de
 * «el servidor no está disponible» (0027 del plan de errores queda pendiente).
 */
export class UpstreamError extends Error {
  constructor(
    readonly upstream: string,
    override readonly cause?: unknown,
  ) {
    super(`La dependencia ${upstream} no respondió correctamente`)
    this.name = 'UpstreamError'
  }
}

type ErrorBody = {
  error: { code: string; message: string }
}

/** Convierte cualquier fallo en una respuesta con la misma forma. */
export function toErrorResponse(error: Error, c: Context) {
  if (error instanceof HTTPException) {
    const body: ErrorBody = {
      error: { code: 'bad_request', message: error.message },
    }
    return c.json(body, error.status)
  }

  if (error instanceof UpstreamError) {
    console.error(error.message, error.cause)
    const body: ErrorBody = {
      error: { code: 'upstream_unavailable', message: 'Servicio no disponible, intentá de nuevo' },
    }
    return c.json(body, 503 satisfies ContentfulStatusCode)
  }

  console.error('Error no controlado', error)
  const body: ErrorBody = {
    error: { code: 'internal', message: 'Algo salió mal' },
  }
  return c.json(body, 500 satisfies ContentfulStatusCode)
}
