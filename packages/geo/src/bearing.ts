import type { Point } from './point.ts'

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180
const toDegrees = (radians: number): number => (radians * 180) / Math.PI

/** Normaliza un ángulo a [0, 360). */
export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360
}

/** Grados desde el norte, en sentido horario. */
export function bearingDegrees(from: Point, to: Point): number {
  const dLng = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const y = Math.sin(dLng) * Math.cos(toLat)
  const x =
    Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng)

  return normalizeDegrees(toDegrees(Math.atan2(y, x)))
}

/** Diferencia más corta, en [-180, 180]: cruzar el norte no da la vuelta entera. */
export function angleDeltaDegrees(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

/** Peso de la lectura nueva, de 0 a 1: más tiembla, menos va con retraso. */
export const HEADING_SMOOTHING = 0.2

/** Filtro paso bajo sobre seno y coseno: la media de 359° y 1° en grados daría 180°. */
export function smoothHeadingDegrees(
  previous: number | null,
  next: number,
  weight: number = HEADING_SMOOTHING,
): number {
  if (previous === null) return normalizeDegrees(next)

  const kept = 1 - weight
  const previousRadians = toRadians(previous)
  const nextRadians = toRadians(next)
  const sin = Math.sin(previousRadians) * kept + Math.sin(nextRadians) * weight
  const cos = Math.cos(previousRadians) * kept + Math.cos(nextRadians) * weight

  return normalizeDegrees(toDegrees(Math.atan2(sin, cos)))
}
