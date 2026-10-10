import type { AppType } from '@tupu/api'
import { hc } from 'hono/client'

// Queda dentro del APK: cambiarla obliga a reconstruir y repartir de nuevo (0030)
const apiUrl = process.env.EXPO_PUBLIC_API_URL

if (!apiUrl) {
  throw new Error('Falta EXPO_PUBLIC_API_URL. Copiá .env.example a .env antes de arrancar.')
}

/** Tipado desde el API: si cambia un endpoint, el móvil no compila (0004). */
export const api = hc<AppType>(apiUrl)
