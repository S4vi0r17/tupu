import type { CameraRef, ViewStateChangeEvent } from '@maplibre/maplibre-react-native'
import { angleDeltaDegrees, type Point } from '@tupu/geo'
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

// Entra la cuadra y la esquina siguiente
const FOLLOW_ZOOM = 16

const EASE_MS = 300

// La brújula da un valor cada 50 ms: sin umbral serían veinte animaciones por segundo
const MIN_BEARING_DELTA_DEG = 3

/** `follow` centra con el norte arriba; `follow-heading` además gira el mapa (0039). */
export type CameraMode = 'free' | 'follow' | 'follow-heading'

const NEXT: Record<CameraMode, CameraMode> = {
  free: 'follow',
  follow: 'follow-heading',
  'follow-heading': 'free',
}

type FollowCamera = {
  mode: CameraMode
  cycleMode: () => void
  /** Pasa a `free` si el mapa lo movió un dedo. */
  releaseOnGesture: (event: ViewStateChangeEvent) => void
}

type FollowCameraOptions = {
  cameraRef: RefObject<CameraRef | null>
  point: Point | null
  /** Ya suavizado (0025). */
  headingDegrees: number | null
}

export function useFollowCamera({
  cameraRef,
  point,
  headingDegrees,
}: FollowCameraOptions): FollowCamera {
  // follow para que el primer fix del GPS ya centre el mapa
  const [mode, setMode] = useState<CameraMode>('follow')
  const applied = useRef<{ point: Point; bearing: number } | null>(null)

  const changeMode = useCallback((next: CameraMode) => {
    // Al volver a seguir hay que recolocar la cámara aunque el ciclista no se haya movido
    applied.current = null
    setMode(next)
  }, [])

  const cycleMode = useCallback(() => changeMode(NEXT[mode]), [changeMode, mode])

  const releaseOnGesture = useCallback(
    (event: ViewStateChangeEvent) => {
      // En Android userInteraction también es true en nuestras animaciones (CameraChangeTracker.kt)
      if (!event.userInteraction || event.animated) return

      changeMode('free')
    },
    [changeMode],
  )

  useEffect(() => {
    if (mode === 'free' || !point) return

    const bearing = mode === 'follow-heading' ? (headingDegrees ?? 0) : 0
    const last = applied.current
    const turned =
      !last || Math.abs(angleDeltaDegrees(last.bearing, bearing)) >= MIN_BEARING_DELTA_DEG

    if (last && last.point === point && !turned) return

    applied.current = { point, bearing }
    cameraRef.current?.easeTo({
      center: [point.lng, point.lat],
      zoom: FOLLOW_ZOOM,
      bearing,
      duration: EASE_MS,
    })
  }, [cameraRef, headingDegrees, mode, point])

  return { mode, cycleMode, releaseOnGesture }
}
