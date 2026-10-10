import type { Point } from './point.ts'

const EARTH_RADIUS_M = 6_371_008.8

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

/** Haversine: Tierra esférica, con error de centímetros a escala de ciudad. */
export function distanceMeters(from: Point, to: Point): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

export function pathLengthMeters(path: readonly Point[]): number {
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const previous = path[i - 1]
    const current = path[i]
    if (previous && current) total += distanceMeters(previous, current)
  }
  return total
}
