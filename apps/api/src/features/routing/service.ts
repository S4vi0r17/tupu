import type { RoutePlanRequest, RoutePlanResponse } from '@tupu/contracts'
import { config } from '../../shared/config.ts'
import { UpstreamError } from '../../shared/errors.ts'

// Por debajo del defecto a propósito: rutas más largas y más tranquilas (0029)
const BICYCLE_COSTING_OPTIONS = {
  bicycle_type: 'Hybrid',
  cycling_speed: 18,
  use_roads: 0.2,
  use_hills: 0.2,
  avoid_bad_surfaces: 0.5,
} as const

type ValhallaRouteResponse = {
  trip?: {
    summary?: { length?: number; time?: number }
    legs?: { shape?: string }[]
  }
}

/** @throws {UpstreamError} Si Valhalla no responde o responde sin trazado. */
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

  if (!response.ok) throw new UpstreamError('Valhalla', await response.text())

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
