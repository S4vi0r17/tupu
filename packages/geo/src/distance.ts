import type { Point } from './point.ts'

/** Radio medio de la Tierra en metros, el que usa la fórmula de haversine. */
const EARTH_RADIUS_M = 6_371_008.8

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

/**
 * Distancia sobre la superficie entre dos puntos.
 *
 * @remarks Haversine: asume Tierra esférica. A escala de Lima el error es de
 * centímetros, y no vale la pena Vincenty por eso.
 */
export function distanceMeters(from: Point, to: Point): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

/** Suma la distancia de un trazado punto a punto. */
export function pathLengthMeters(path: readonly Point[]): number {
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const previous = path[i - 1]
    const current = path[i]
    if (previous && current) total += distanceMeters(previous, current)
  }
  return total
}
