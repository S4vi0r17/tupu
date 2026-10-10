import type { Point } from './point.ts'

// No la 5 de Google: decodificar con 5 da coordenadas diez veces fuera de sitio
export const VALHALLA_POLYLINE_PRECISION = 6

/** @throws {SyntaxError} Si la cadena termina a mitad de un valor. */
export function decodePolyline(encoded: string, precision = VALHALLA_POLYLINE_PRECISION): Point[] {
  const factor = 10 ** precision
  const points: Point[] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    lat += decodeValue()
    lng += decodeValue()
    points.push({ lat: lat / factor, lng: lng / factor })
  }

  return points

  function decodeValue(): number {
    let result = 0
    let shift = 0
    let byte: number

    do {
      if (index >= encoded.length) {
        throw new SyntaxError('Polilínea incompleta: la cadena termina a mitad de un valor')
      }
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    return result & 1 ? ~(result >> 1) : result >> 1
  }
}
