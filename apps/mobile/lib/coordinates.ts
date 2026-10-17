import type { Point } from '@tupu/geo'

// El grafo de Valhalla es solo Perú: fuera de esta caja no hay ruta
const PERU = { minLat: -18.4, maxLat: 0.1, minLng: -81.4, maxLng: -68.6 }

// `-12.1211, -77.0301`, el formato que copia Google Maps (0028)
const PAIR = /^\s*(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)\s*$/

function isInPeru({ lat, lng }: Point): boolean {
  return lat >= PERU.minLat && lat <= PERU.maxLat && lng >= PERU.minLng && lng <= PERU.maxLng
}

/** Lee `lat, lng`; si viene al revés lo voltea, porque en Perú los dos rangos no se cruzan. */
export function parseCoordinates(text: string): Point | null {
  const match = PAIR.exec(text)
  if (!match) return null

  const first = Number(match[1])
  const second = Number(match[2])

  const asWritten = { lat: first, lng: second }
  if (isInPeru(asWritten)) return asWritten

  const swapped = { lat: second, lng: first }
  if (isInPeru(swapped)) return swapped

  return null
}
