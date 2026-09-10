import { Camera, Layer, Map as MapView } from '@maplibre/maplibre-react-native'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  BASE_SOURCE,
  CASING_COLOR,
  CASING_WIDTH,
  CYCLEWAY_COLOR,
  CYCLEWAY_WIDTH,
  LIMA_CENTER,
  MAP_STYLE_URL,
  SEPARATED_CYCLEWAY,
  SHARED_COLOR,
  SHARED_DASH,
  SHARED_WIDTH,
  SIGNPOSTED_SHARED,
  TRANSPORTATION_LAYER,
} from '../lib/map.ts'

export default function MapScreen() {
  return (
    <View className="flex-1">
      <MapView style={StyleSheet.absoluteFill} mapStyle={MAP_STYLE_URL} attribution logo={false}>
        <Camera initialViewState={{ center: LIMA_CENTER, zoom: 14 }} />

        <Layer
          id="tupu-shared"
          type="line"
          source={BASE_SOURCE}
          source-layer={TRANSPORTATION_LAYER}
          filter={SIGNPOSTED_SHARED}
          layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
          paint={{
            'line-color': SHARED_COLOR,
            'line-width': SHARED_WIDTH,
            'line-dasharray': SHARED_DASH,
          }}
        />

        <Layer
          id="tupu-cycleways-casing"
          type="line"
          source={BASE_SOURCE}
          source-layer={TRANSPORTATION_LAYER}
          filter={SEPARATED_CYCLEWAY}
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{ 'line-color': CASING_COLOR, 'line-width': CASING_WIDTH, 'line-opacity': 0.9 }}
        />

        <Layer
          id="tupu-cycleways"
          type="line"
          source={BASE_SOURCE}
          source-layer={TRANSPORTATION_LAYER}
          filter={SEPARATED_CYCLEWAY}
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{ 'line-color': CYCLEWAY_COLOR, 'line-width': CYCLEWAY_WIDTH }}
        />
      </MapView>

      <SafeAreaView className="absolute inset-x-0 top-0" pointerEvents="none">
        <View className="m-3.5 gap-2.5 self-start rounded-2xl bg-neutral-950/90 px-4 py-3">
          <Text className="text-[15px] tracking-[5px] text-neutral-100">tupu</Text>

          <View className="gap-1.5">
            <View className="flex-row items-center gap-2">
              {/* El color sale de map.ts porque MapLibre necesita el literal */}
              <View className="h-1 w-5 rounded-sm" style={{ backgroundColor: CYCLEWAY_COLOR }} />
              <Text className="text-[11px] text-neutral-200">vía propia</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-5 flex-row gap-[3px]">
                <View className="h-1 flex-1 rounded-sm" style={{ backgroundColor: SHARED_COLOR }} />
                <View className="h-1 flex-1 rounded-sm" style={{ backgroundColor: SHARED_COLOR }} />
              </View>
              <Text className="text-[11px] text-neutral-400">compartida</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
