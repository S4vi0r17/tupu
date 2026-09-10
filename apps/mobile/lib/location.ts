import type { Point } from '@tupu/geo'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

/** Metros a recorrer para que el GPS avise de una posición nueva. */
const DISTANCE_INTERVAL_M = 5

export type LocationPermission = 'pending' | 'granted' | 'denied'

export type CurrentLocation = {
  permission: LocationPermission
  point: Point | null
  /** Incertidumbre que reporta el GPS, en metros. */
  accuracyM: number | null
}

/**
 * Sigue la posición del ciclista.
 *
 * @remarks Abre el diálogo de permisos del sistema en el primer render.
 */
export function useCurrentLocation(): CurrentLocation {
  const [permission, setPermission] = useState<LocationPermission>('pending')
  const [point, setPoint] = useState<Point | null>(null)
  const [accuracyM, setAccuracyM] = useState<number | null>(null)

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null
    let cancelled = false

    async function watch() {
      const { granted } = await Location.requestForegroundPermissionsAsync()
      if (cancelled) return

      setPermission(granted ? 'granted' : 'denied')
      if (!granted) return

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: DISTANCE_INTERVAL_M },
        ({ coords }) => {
          setPoint({ lat: coords.latitude, lng: coords.longitude })
          setAccuracyM(coords.accuracy)
        },
      )

      // ! Llega después del await: si la pantalla ya se fue, nadie la corta
      if (cancelled) subscription.remove()
    }

    watch()

    return () => {
      cancelled = true
      subscription?.remove()
    }
  }, [])

  return { permission, point, accuracyM }
}
