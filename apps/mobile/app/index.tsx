import { Camera, Layer, Map as MapView } from '@maplibre/maplibre-react-native'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  BASE_SOURCE,
  BIKE_FRIENDLY_COLOR,
  BIKE_FRIENDLY_ROAD,
  CYCLEWAY_COLOR,
  CYCLEWAY_WIDTH,
  LIMA_CENTER,
  MAP_STYLE_URL,
  SEPARATED_CYCLEWAY,
  TRANSPORTATION_LAYER,
} from '../lib/map.ts'

export default function MapScreen() {
  return (
    <View className="flex-1">
      <MapView style={StyleSheet.absoluteFill} mapStyle={MAP_STYLE_URL} attribution logo={false}>
        <Camera initialViewState={{ center: LIMA_CENTER, zoom: 14 }} />

        <Layer
          id="tupu-bike-friendly"
          type="line"
          source={BASE_SOURCE}
          source-layer={TRANSPORTATION_LAYER}
          filter={BIKE_FRIENDLY_ROAD}
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': BIKE_FRIENDLY_COLOR,
            'line-width': CYCLEWAY_WIDTH,
            'line-opacity': 0.55,
            'line-dasharray': [2, 1.5],
          }}
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
        <View className="m-3.5 gap-1.5 self-start rounded-2xl bg-neutral-950/90 px-3.5 py-2.5">
          <Text className="text-[15px] tracking-[5px] text-neutral-100">tupu</Text>
          <View className="flex-row items-center gap-1.5">
            {/* El color sale de map.ts porque MapLibre necesita el literal */}
            <View className="h-[3px] w-3 rounded-sm" style={{ backgroundColor: CYCLEWAY_COLOR }} />
            <Text className="mr-1 text-[11px] text-neutral-400">ciclovía</Text>
            <View
              className="h-[3px] w-3 rounded-sm"
              style={{ backgroundColor: BIKE_FRIENDLY_COLOR }}
            />
            <Text className="mr-1 text-[11px] text-neutral-400">vía compartida</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
