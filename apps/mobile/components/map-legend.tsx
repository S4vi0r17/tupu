import { Text, View } from 'react-native'
import { LANE_COLOR, SHARED_COLOR, TRACK_COLOR } from '../lib/map.ts'

// Los colores vienen de map.ts y no de Tailwind porque MapLibre necesita el literal
export function MapLegend() {
  return (
    <View className="m-3.5 gap-2.5 self-start rounded-2xl bg-neutral-950/90 px-4 py-3">
      <Text className="text-[15px] tracking-[5px] text-neutral-100">tupu</Text>

      <View className="gap-1.5">
        <View className="flex-row items-center gap-2">
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
  )
}
