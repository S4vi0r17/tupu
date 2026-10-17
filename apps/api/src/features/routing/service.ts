import type { RoutePlanRequest, RoutePlanResponse } from '@tupu/contracts'
import { config } from '../../shared/config.ts'
import { NoRouteError, UpstreamError } from '../../shared/errors.ts'

// Por debajo del defecto a propósito: rutas más largas y más tranquilas (0029)
const BICYCLE_COSTING_OPTIONS = {
  bicycle_type: 'Hybrid',
  cycling_speed: 18,
  use_roads: 0.2,
  use_hills: 0.2,
  avoid_bad_surfaces: 0.5,
} as const

// Más de 500 km (154), sin calle cerca (170-172), sin camino (442, 443); otro código es bug nuestro
const NO_ROUTE_ERROR_CODES = new Set([154, 170, 171, 172, 442, 443])

function isNoRoute(valhallaErrorBody: string): boolean {
  try {
    const code = (JSON.parse(valhallaErrorBody) as { error_code?: unknown }).error_code
    return typeof code === 'number' && NO_ROUTE_ERROR_CODES.has(code)
  } catch {
    return false
  }
}

type ValhallaRouteResponse = {
  trip?: {
    summary?: { length?: number; time?: number }
    legs?: { shape?: string }[]
  }
}

/**
 * @throws {NoRouteError} Si no hay camino en bici entre los dos puntos.
 * @throws {UpstreamError} Si Valhalla no responde o responde sin trazado.
 */
export async function planRoute(request: RoutePlanRequest): Promise<RoutePlanResponse> {
  const response = await fetch(`${config.VALHALLA_URL}/route`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      locations: [
        { lat: request.from.lat, lon: request.from.lng },
        { lat: request.to.lat, lon: request.to.lng },
      ],
      costing: 'bicycle',
      costing_options: { bicycle: BICYCLE_COSTING_OPTIONS },
    }),
  }).catch((cause) => {
    throw new UpstreamError('Valhalla', cause)
  })

  if (!response.ok) {
    const body = await response.text()
    if (isNoRoute(body)) throw new NoRouteError(body)
    throw new UpstreamError('Valhalla', body)
  }

  const trip = ((await response.json()) as ValhallaRouteResponse).trip
  const shape = trip?.legs?.[0]?.shape

  if (!trip?.summary || shape === undefined) throw new UpstreamError('Valhalla', trip)

  return {
    // Valhalla da la distancia en km
    distanceM: Math.round((trip.summary.length ?? 0) * 1000),
    durationS: Math.round(trip.summary.time ?? 0),
    shape,
  }
}
