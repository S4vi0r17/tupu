import { smoothHeadingDegrees } from '@tupu/geo'
import * as Location from 'expo-location'
import { useEffect, useRef, useState } from 'react'

/**
 * Cada cuánto avanza el filtro, en milisegundos.
 *
 * WHY Android calla en cuanto el rumbo deja de cambiar. Si el filtro avanzara
 * solo con cada lectura, el cono se quedaría clavado antes de llegar.
 */
const TICK_MS = 50

/**
 * Lecturas a dejar pasar antes de creerle al nivel de calibración.
 *
 * WHY Android arranca ese nivel en 0 —«sin calibrar»— y solo lo corrige cuando
 * el sensor avisa. Sin la espera, la app pide calibrar cada vez que abre.
 */
const CALIBRATION_GRACE_READINGS = 12

/** Nivel de calibración de Android, de 0 a 3, por debajo del cual el rumbo no es fiable. */
const MIN_TRUSTED_ACCURACY = 2

/**
 * Cuánto se espera la primera lectura antes de dar la brújula por ausente.
 *
 * ! Sin magnetómetro no hay error: el sensor no emite nunca. Y Android calla
 * ! mientras el rumbo no cambie unos 2°, así que un plazo corto da falsos.
 */
const SENSOR_TIMEOUT_MS = 6_000

export type Heading = {
  /** Grados horarios desde el norte, ya suavizados. `null` hasta la primera lectura. */
  degrees: number | null
  hasCompass: boolean
  needsCalibration: boolean
}

/**
 * Sigue hacia dónde apunta el teléfono, suavizado para que el cono no tiemble (0025).
 *
 * @remarks Sin permiso de ubicación Android no arranca el sensor: de ahí `enabled`.
 */
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

        // ! trueHeading vale -1 hasta que haya un fix con el que calcular la
        // ! declinación. En Lima son un par de grados: el magnético alcanza.
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
