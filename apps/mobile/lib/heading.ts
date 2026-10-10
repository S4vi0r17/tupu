import { smoothHeadingDegrees } from '@tupu/geo'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'

// El filtro avanza por reloj: Android calla cuando el rumbo se queda quieto y el cono no llegaría
const TICK_MS = 50

// Android arranca la calibración en 0; sin esperar, la app pediría calibrar cada vez que abre
const CALIBRATION_GRACE_READINGS = 12

// En la escala de 0 a 3 de Android
const MIN_TRUSTED_ACCURACY = 2

// Sin magnetómetro no hay error, solo silencio; y Android calla si el rumbo no cambia 2°
const SENSOR_TIMEOUT_MS = 6_000

export type Heading = {
  /** Grados desde el norte, ya suavizados. */
  degrees: number | null
  hasCompass: boolean
  needsCalibration: boolean
}

/** Sin permiso de ubicación Android no arranca el sensor: por eso `enabled` (0025). */
export function useHeading(enabled: boolean): Heading {
  const [degrees, setDegrees] = useState<number | null>(null)
  const [hasCompass, setHasCompass] = useState(true)
  const [needsCalibration, setNeedsCalibration] = useState(false)

  const target = useRef<number | null>(null)
  const smoothed = useRef<number | null>(null)
  const readings = useRef(0)

  useEffect(() => {
    if (!enabled) return

    let subscription: Location.LocationSubscription | null = null
    let cancelled = false

    const timeout = setTimeout(() => setHasCompass(false), SENSOR_TIMEOUT_MS)

    const tick = setInterval(() => {
      if (target.current === null) return

      smoothed.current = smoothHeadingDegrees(smoothed.current, target.current)
      setDegrees(Math.round(smoothed.current) % 360)
    }, TICK_MS)

    async function watch() {
      subscription = await Location.watchHeadingAsync((reading) => {
        clearTimeout(timeout)
        setHasCompass(true)
        readings.current += 1

        // trueHeading es -1 hasta el primer fix; en Lima la declinación es de un par de grados
        target.current = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading

        setNeedsCalibration(
          readings.current >= CALIBRATION_GRACE_READINGS && reading.accuracy < MIN_TRUSTED_ACCURACY,
        )
      })

      if (cancelled) subscription.remove()
    }

    watch()

    return () => {
      cancelled = true
      clearTimeout(timeout)
      clearInterval(tick)
      subscription?.remove()
    }
  }, [enabled])

  return { degrees, hasCompass, needsCalibration }
}
