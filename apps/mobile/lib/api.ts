import type { AppType } from '@tupu/api'
import { hc } from 'hono/client'

// ! Se hornea en el APK al construir: cambiarla obliga a reconstruir y repartir
// ! de nuevo, porque no hay actualización forzada (0019, 0030).
const apiUrl = process.env.EXPO_PUBLIC_API_URL

if (!apiUrl) {
  throw new Error('Falta EXPO_PUBLIC_API_URL. Copiá .env.example a .env antes de arrancar.')
}

/** Cliente tipado del API: si el servidor cambia un endpoint, esto no compila (0004). */
export const api = hc<AppType>(apiUrl)
