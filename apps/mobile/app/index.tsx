import {
  Camera,
  type CameraRef,
  Map as MapView,
  type ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native'
import { useRef } from 'react'
import { type NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraModeButton } from '../components/camera-mode-button.tsx'
import { CyclewayLayers } from '../components/cycleway-layers.tsx'
import { MapLegend } from '../components/map-legend.tsx'
import { RiderPuck } from '../components/rider-puck.tsx'
import { useFollowCamera } from '../lib/camera.ts'
import { useCycleways } from '../lib/cycleways.ts'
import { useHeading } from '../lib/heading.ts'
import { useCurrentLocation } from '../lib/location.ts'
import { LIMA_CENTER, MAP_STYLE_URL } from '../lib/map.ts'

const INITIAL_ZOOM = 14

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
  const { mode, cycleMode, releaseOnGesture } = useFollowCamera({
    cameraRef,
    point,
    headingDegrees: degrees,
  })

  const onRegionWillChange = (event: NativeSyntheticEvent<ViewStateChangeEvent>) => {
    releaseOnGesture(event.nativeEvent)
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
      >
        <Camera ref={cameraRef} initialViewState={{ center: LIMA_CENTER, zoom: INITIAL_ZOOM }} />

        <CyclewayLayers collection={collection} />

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
        </View>
      </SafeAreaView>
    </View>
  )
}
