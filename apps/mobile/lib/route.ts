import type { LngLatBounds } from '@maplibre/maplibre-react-native'
import { useQuery } from '@tanstack/react-query'
import { decodePolyline, type Point } from '@tupu/geo'
import { useEffect } from 'react'
import { create } from 'zustand'
import { api } from './api.ts'

export type RouteStart = {
  point: Point
  /** Tomado del GPS al fijar el destino; se vuelve a tomar si cambia el destino. */
  fromGps: boolean
}

type RouteEndpoints = {
  start: RouteStart | null
  destination: Point | null
  setStart: (start: RouteStart) => void
  setDestination: (destination: Point) => void
  clear: () => void
}

export const useRouteEndpoints = create<RouteEndpoints>()((set) => ({
  start: null,
  destination: null,
  setStart: (start) => set({ start }),
  setDestination: (destination) =>
    set(({ start }) => ({ destination, start: start?.fromGps ? null : start })),
  clear: () => set({ start: null, destination: null }),
}))

type RouteLine = {
  type: 'Feature'
  properties: Record<string, never>
  geometry: { type: 'LineString'; coordinates: [number, number][] }
}

type PlannedRoute = {
  line: RouteLine
  bounds: LngLatBounds
  distanceM: number
  durationS: number
}

export type RoutePlan =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'no-route' | 'unavailable'; retry: () => void }
  | ({ status: 'ready' } & PlannedRoute)

class RoutePlanError extends Error {
  constructor(readonly kind: 'no-route' | 'unavailable') {
    super(`No se pudo calcular la ruta: ${kind}`)
    this.name = 'RoutePlanError'
  }
}

function boundsOf(coordinates: [number, number][]): LngLatBounds {
  let [west, south, east, north] = [180, 90, -180, -90]
  for (const [lng, lat] of coordinates) {
    west = Math.min(west, lng)
    east = Math.max(east, lng)
    south = Math.min(south, lat)
    north = Math.max(north, lat)
  }
  return [west, south, east, north]
}

/** Sin inicio fijado sale de la posición del GPS, congelada para no recalcular cada 5 m. */
export function useRoutePlan(currentPoint: Point | null): RoutePlan {
  const { start, destination, setStart } = useRouteEndpoints()

  useEffect(() => {
    if (destination && !start && currentPoint) setStart({ point: currentPoint, fromGps: true })
  }, [currentPoint, destination, setStart, start])

  const from = start?.point ?? null

  const query = useQuery({
    queryKey: ['route', from?.lat, from?.lng, destination?.lat, destination?.lng],
    enabled: from !== null && destination !== null,
    staleTime: Number.POSITIVE_INFINITY,
    // Reintentar «no hay ruta» da la misma respuesta
    retry: (failureCount, error) =>
      !(error instanceof RoutePlanError && error.kind === 'no-route') && failureCount < 3,
    queryFn: async (): Promise<PlannedRoute> => {
      if (!from || !destination) throw new Error('Falta el inicio o el destino')

      const response = await api.v1.routing.plan
        .$post({ json: { from, to: destination } })
        .catch(() => {
          throw new RoutePlanError('unavailable')
        })

      if (response.status === 422) throw new RoutePlanError('no-route')
      if (!response.ok) throw new RoutePlanError('unavailable')

      const { shape, distanceM, durationS } = await response.json()
      const coordinates = decodePolyline(shape).map(({ lat, lng }): [number, number] => [lng, lat])

      return {
        line: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } },
        bounds: boundsOf(coordinates),
        distanceM,
        durationS,
      }
    },
  })

  if (!from || !destination) return { status: 'idle' }
  if (query.data) return { status: 'ready', ...query.data }

  if (query.isError) {
    const kind = query.error instanceof RoutePlanError ? query.error.kind : 'unavailable'
    return { status: kind, retry: () => void query.refetch() }
  }

  return { status: 'loading' }
}
