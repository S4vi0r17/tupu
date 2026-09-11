import { Pressable, View, type ViewStyle } from 'react-native'
import type { CameraMode } from '../lib/camera.ts'

/** El mismo azul del ciclista: el botón habla de la cámara sobre él (0038). */
const ACTIVE_COLOR = '#2563EB'
const IDLE_COLOR = '#D4D4D4'

/** Triángulo a base de bordes: React Native no dibuja polígonos. */
const CONE: ViewStyle = {
  width: 0,
  height: 0,
  borderLeftWidth: 7,
  borderRightWidth: 7,
  borderBottomWidth: 13,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
}

/** Cada etiqueta dice qué hará el toque, no en qué modo estás. */
const NEXT_ACTION_LABEL: Record<CameraMode, string> = {
  free: 'Centrar el mapa en tu posición',
  follow: 'Girar el mapa hacia donde mirás',
  'follow-heading': 'Dejar de seguir tu posición',
}

function ModeIcon({ mode }: { mode: CameraMode }) {
  if (mode === 'follow-heading')
    return <View style={{ ...CONE, borderBottomColor: ACTIVE_COLOR }} />

  const color = mode === 'follow' ? ACTIVE_COLOR : IDLE_COLOR

  return (
    <View
      className="h-4.5 w-4.5 items-center justify-center rounded-full border-2"
      style={{ borderColor: color }}
    >
      {mode === 'follow' ? (
        <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      ) : null}
    </View>
  )
}

type CameraModeButtonProps = {
  mode: CameraMode
  onPress: () => void
}

/** Cicla los tres modos de cámara: libre, te sigue, te sigue y gira (0039). */
export function CameraModeButton({ mode, onPress }: CameraModeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={NEXT_ACTION_LABEL[mode]}
      onPress={onPress}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-neutral-950/90">
        <ModeIcon mode={mode} />
      </View>
    </Pressable>
  )
}
