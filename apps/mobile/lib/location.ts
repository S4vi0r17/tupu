import type { Point } from '@tupu/geo'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

const DISTANCE_INTERVAL_M = 5

export type LocationPermission = 'pending' | 'granted' | 'denied'

export type CurrentLocation = {
  permission: LocationPermission
  point: Point | null
  accuracyM: number | null
}

/** Abre el diálogo de permisos en el primer render. */
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

      // Si la pantalla se desmontó durante el await, nadie más la va a cortar
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
