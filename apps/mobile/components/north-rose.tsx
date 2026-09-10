import { Pressable, View, type ViewStyle } from 'react-native'

/** Triángulo a base de bordes: React Native no dibuja polígonos. */
const NEEDLE: ViewStyle = {
  width: 0,
  height: 0,
  borderLeftWidth: 5,
  borderRightWidth: 5,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
}

const NORTH_COLOR = '#EF4444'
const SOUTH_COLOR = '#A3A3A3'

type NorthRoseProps = {
  /** Cuánto está girado el mapa en sentido horario, en grados. */
  bearingDegrees: number
  onPress: () => void
}

/** La aguja roja marca el norte; al tocarla el mapa vuelve a tenerlo arriba (0027). */
export function NorthRose({ bearingDegrees, onPress }: NorthRoseProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Volver al norte" onPress={onPress}>
      <View className="h-11 w-11 items-center justify-center rounded-full bg-neutral-950/90">
        <View className="items-center" style={{ transform: [{ rotate: `${-bearingDegrees}deg` }] }}>
          <View style={{ ...NEEDLE, borderBottomWidth: 10, borderBottomColor: NORTH_COLOR }} />
          <View style={{ ...NEEDLE, borderTopWidth: 10, borderTopColor: SOUTH_COLOR }} />
        </View>
      </View>
    </Pressable>
  )
}
