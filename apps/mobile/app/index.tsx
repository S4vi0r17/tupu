import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  Layer,
  Map as MapView,
  type ViewStateChangeEvent,
} from '@maplibre/maplibre-react-native'
import { useRef } from 'react'
import { type NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraModeButton } from '../components/camera-mode-button.tsx'
import { RiderPuck } from '../components/rider-puck.tsx'
import { useFollowCamera } from '../lib/camera.ts'
import { useCycleways } from '../lib/cycleways.ts'
import { useHeading } from '../lib/heading.ts'
import { useCurrentLocation } from '../lib/location.ts'
import {
  CASING_COLOR,
  CASING_WIDTH,
  CYCLEWAYS_SOURCE,
  IS_LANE,
  IS_SHARED,
  IS_TRACK,
  LANE_COLOR,
  LANE_DASH,
  LIMA_CENTER,
  MAP_STYLE_URL,
  SHARED_COLOR,
  SHARED_DASH,
  THIN_WIDTH,
  TRACK_COLOR,
  TRACK_WIDTH,
} from '../lib/map.ts'

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

        <GeoJSONSource id={CYCLEWAYS_SOURCE} data={collection}>
          <Layer
            id="tupu-shared"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_SHARED}
            layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
            paint={{
              'line-color': SHARED_COLOR,
              'line-width': THIN_WIDTH,
              'line-dasharray': SHARED_DASH,
            }}
          />

          <Layer
            id="tupu-lane"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_LANE}
            layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
            paint={{
              'line-color': LANE_COLOR,
              'line-width': THIN_WIDTH,
              'line-dasharray': LANE_DASH,
            }}
          />

          <Layer
            id="tupu-track-casing"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_TRACK}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': CASING_COLOR, 'line-width': CASING_WIDTH, 'line-opacity': 0.9 }}
          />

          <Layer
            id="tupu-track"
            type="line"
            source={CYCLEWAYS_SOURCE}
            filter={IS_TRACK}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            paint={{ 'line-color': TRACK_COLOR, 'line-width': TRACK_WIDTH }}
          />
        </GeoJSONSource>

        {point ? <RiderPuck point={point} headingDegrees={degrees} accuracyM={accuracyM} /> : null}
      </MapView>

      <SafeAreaView className="absolute inset-x-0 top-0" pointerEvents="none">
        <View className="m-3.5 gap-2.5 self-start rounded-2xl bg-neutral-950/90 px-4 py-3">
          <Text className="text-[15px] tracking-[5px] text-neutral-100">tupu</Text>

          <View className="gap-1.5">
            <View className="flex-row items-center gap-2">
              {/* Los colores salen de map.ts porque MapLibre necesita el literal */}
              <View className="h-1 w-5 rounded-sm" style={{ backgroundColor: TRACK_COLOR }} />
              <Text className="text-[11px] text-neutral-200">vía propia</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 flex-row gap-[3px]">
                <View className="h-1 flex-[2] rounded-sm" style={{ backgroundColor: LANE_COLOR }} />
                <View className="h-1 flex-1 rounded-sm" style={{ backgroundColor: LANE_COLOR }} />
              </View>
              <Text className="text-[11px] text-neutral-300">carril pintado</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 flex-row gap-[3px]">
                <View className="h-1 flex-1 rounded-sm" style={{ backgroundColor: SHARED_COLOR }} />
                <View className="h-1 flex-1 rounded-sm" style={{ backgroundColor: SHARED_COLOR }} />
              </View>
              <Text className="text-[11px] text-neutral-400">compartida con autos</Text>
            </View>
          </View>
        </View>
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
