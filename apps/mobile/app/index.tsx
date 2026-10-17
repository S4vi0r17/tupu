import {
  Camera,
  type CameraRef,
  Map as MapView,
  type PressEvent,
  type ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native'
import type { Point } from '@tupu/geo'
import { useEffect, useRef, useState } from 'react'
import { type NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraModeButton } from '../components/camera-mode-button.tsx'
import { CyclewayLayers } from '../components/cycleway-layers.tsx'
import { MapLegend } from '../components/map-legend.tsx'
import { RiderPuck } from '../components/rider-puck.tsx'
import { RouteLayers } from '../components/route-layers.tsx'
import { RoutePanel } from '../components/route-panel.tsx'
import { useFollowCamera } from '../lib/camera.ts'
import { useCycleways } from '../lib/cycleways.ts'
import { useHeading } from '../lib/heading.ts'
import { useCurrentLocation } from '../lib/location.ts'
import { LIMA_CENTER, MAP_STYLE_URL } from '../lib/map.ts'
import { useRouteEndpoints, useRoutePlan } from '../lib/route.ts'

const INITIAL_ZOOM = 14

// Deja libre la leyenda arriba y el panel de la ruta abajo
const ROUTE_PADDING = { top: 140, right: 40, bottom: 220, left: 40 }

type NoticeState = {
  cyclewaysFailed: boolean
  isLocationDenied: boolean
  hasCompass: boolean
  needsCalibration: boolean
}

function noticeFor({
  cyclewaysFailed,
  isLocationDenied,
  hasCompass,
  needsCalibration,
}: NoticeState) {
  if (cyclewaysFailed) return 'No se pudo traer la red ciclista. El mapa base sigue funcionando.'
  if (isLocationDenied) return 'Sin permiso de ubicación no se puede mostrar dónde estás.'
  if (!hasCompass) return 'Este teléfono no tiene brújula: no se puede mostrar hacia dónde miras.'
  if (needsCalibration) return 'Brújula perdida. Mueve el teléfono dibujando un ocho en el aire.'
  return null
}

export default function MapScreen() {
  const { collection, isError } = useCycleways()

  const { permission, point, accuracyM } = useCurrentLocation()
  const { degrees, hasCompass, needsCalibration } = useHeading(permission === 'granted')

  const cameraRef = useRef<CameraRef>(null)
  const { mode, cycleMode, releaseOnGesture, release } = useFollowCamera({
    cameraRef,
    point,
    headingDegrees: degrees,
  })

  const { start, destination } = useRouteEndpoints()
  const plan = useRoutePlan(point)
  const [pending, setPending] = useState<Point | null>(null)

  const routeBounds = plan.status === 'ready' ? plan.bounds : null
  useEffect(() => {
    if (!routeBounds) return
    release()
    cameraRef.current?.fitBounds(routeBounds, { padding: ROUTE_PADDING, duration: 600 })
  }, [release, routeBounds])

  const onRegionWillChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    releaseOnGesture(event.nativeEvent)
  }

  const onLongPress = (event: NativeSyntheticEvent<PressEvent>) => {
    const [lng, lat] = event.nativeEvent.lngLat
    setPending({ lat, lng })
  }

  const notice = noticeFor({
    cyclewaysFailed: isError,
    isLocationDenied: permission === 'denied',
    hasCompass,
    needsCalibration,
  })

  return (
    <View className="flex-1">
      <MapView
        style={StyleSheet.absoluteFill}
        mapStyle={MAP_STYLE_URL}
        attribution
        logo={false}
        onRegionWillChange={onRegionWillChange}
        onLongPress={onLongPress}
      >
        <Camera ref={cameraRef} initialViewState={{ center: LIMA_CENTER, zoom: INITIAL_ZOOM }} />

        <CyclewayLayers collection={collection} />

        <RouteLayers
          plan={plan}
          start={start?.point ?? null}
          destination={destination}
          pending={pending}
        />

        {point ? <RiderPuck point={point} headingDegrees={degrees} accuracyM={accuracyM} /> : null}
      </MapView>

      <SafeAreaView className="absolute inset-x-0 top-0" pointerEvents="none">
        <MapLegend />
      </SafeAreaView>

      <SafeAreaView className="absolute inset-x-0 bottom-0" pointerEvents="box-none">
        <View className="m-3.5 gap-2.5">
          {notice ? (
            <View className="rounded-2xl bg-neutral-950/90 px-4 py-3" pointerEvents="none">
              <Text className="text-[12px] leading-4 text-neutral-300">{notice}</Text>
            </View>
          ) : null}

          <View className="self-end">
            <CameraModeButton mode={mode} onPress={cycleMode} />
          </View>

          <RoutePanel
            plan={plan}
            pending={pending}
            onPendingDone={() => setPending(null)}
            isLocationDenied={permission === 'denied'}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}
