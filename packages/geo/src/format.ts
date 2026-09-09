/**
 * Distancia lista para pantalla: `840 m` o `12,4 km`.
 *
 * @remarks Texto para el usuario, así que va en español y con coma decimal (0003).
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`

  const km = meters / 1000
  return `${km.toFixed(1).replace('.', ',')} km`
}

/** Duración lista para pantalla: `18 min` o `1 h 20 min`. */
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes} min`
  if (minutes === 0) return `${hours} h`
  return `${hours} h ${minutes} min`
}
