import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'
import type { Point } from '@tupu/geo'
import { useMemo } from 'react'
import { CASING_COLOR, ROUTE_COLOR, ROUTE_HALO_WIDTH, ROUTE_WIDTH } from '../lib/map.ts'
import type { RoutePlan } from '../lib/route.ts'

const ROUTE_SOURCE = 'tupu-route'
const ENDPOINTS_SOURCE = 'tupu-route-endpoints'
const INK_COLOR = '#0A0A0A'

type Role = 'start' | 'destination' | 'pending'

function endpoint(role: Role, { lat, lng }: Point) {
  return {
    type: 'Feature' as const,
    properties: { role },
    geometry: { type: 'Point' as const, coordinates: [lng, lat] },
  }
}

type RouteLayersProps = {
  plan: RoutePlan
  start: Point | null
  destination: Point | null
  /** El punto del toque largo, mientras se elige qué hacer con él. */
  pending: Point | null
}

export function RouteLayers({ plan, start, destination, pending }: RouteLayersProps) {
  const endpoints = useMemo(() => {
    const marks: [Role, Point | null][] = [
      ['start', start],
      ['destination', destination],
      ['pending', pending],
    ]
    return {
      type: 'FeatureCollection' as const,
      features: marks.flatMap(([role, point]) => (point ? [endpoint(role, point)] : [])),
    }
  }, [start, destination, pending])

  return (
    <>
      {plan.status === 'ready' ? (
        <GeoJSONSource id={ROUTE_SOURCE} data={plan.line}>
          <Layer
            id="tupu-route-halo"
            type="line"
            source={ROUTE_SOURCE}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': CASING_COLOR, 'line-width': ROUTE_HALO_WIDTH }}
          />
          <Layer
            id="tupu-route-line"
            type="line"
            source={ROUTE_SOURCE}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': ROUTE_COLOR, 'line-width': ROUTE_WIDTH }}
          />
        </GeoJSONSource>
      ) : null}

      <GeoJSONSource id={ENDPOINTS_SOURCE} data={endpoints}>
        <Layer
          id="tupu-route-endpoints"
          type="circle"
          source={ENDPOINTS_SOURCE}
          paint={{
            'circle-radius': ['match', ['get', 'role'], 'pending', 6, 7],
            'circle-color': [
              'match',
              ['get', 'role'],
              'start',
              CASING_COLOR,
              'destination',
              ROUTE_COLOR,
              INK_COLOR,
            ],
            'circle-stroke-width': 3,
            'circle-stroke-color': ['match', ['get', 'role'], 'start', ROUTE_COLOR, CASING_COLOR],
            'circle-pitch-alignment': 'map',
          }}
        />
      </GeoJSONSource>
    </>
  )
}
