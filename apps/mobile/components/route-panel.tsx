import { formatDistance, formatDuration, type Point } from '@tupu/geo'
import { type ReactNode, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { parseCoordinates } from '../lib/coordinates.ts'
import { ROUTE_COLOR } from '../lib/map.ts'
import { type RoutePlan, useRouteEndpoints } from '../lib/route.ts'

type ActionProps = {
  label: string
  onPress: () => void
  primary?: boolean
}

function Action({ label, onPress, primary = false }: ActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="rounded-full bg-neutral-800 px-4 py-2.5"
      style={primary ? { backgroundColor: ROUTE_COLOR } : undefined}
    >
      <Text className="text-[13px] font-medium text-neutral-100">{label}</Text>
    </Pressable>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <View className="gap-3 rounded-2xl bg-neutral-950/90 px-4 py-3">{children}</View>
}

function Message({ children }: { children: ReactNode }) {
  return <Text className="text-[13px] leading-5 text-neutral-200">{children}</Text>
}

function CoordinatesForm({ onDone }: { onDone: () => void }) {
  const setDestination = useRouteEndpoints((state) => state.setDestination)
  const [text, setText] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const submit = () => {
    const point = parseCoordinates(text)
    if (!point) {
      setIsInvalid(true)
      return
    }
    setDestination(point)
    onDone()
  }

  return (
    <Card>
      <TextInput
        autoFocus
        value={text}
        onChangeText={(next) => {
          setText(next)
          setIsInvalid(false)
        }}
        onSubmitEditing={submit}
        placeholder="-12.1211, -77.0301"
        placeholderTextColor="#737373"
        keyboardType="numbers-and-punctuation"
        returnKeyType="go"
        className="rounded-xl bg-neutral-800 px-3 py-2.5 text-[15px] text-neutral-100"
      />
      {isInvalid ? (
        <Text className="text-[12px] leading-4 text-amber-400">
          No se entiende. Pega latitud y longitud de un punto en Perú, como las copia Google Maps.
        </Text>
      ) : null}
      <View className="flex-row justify-end gap-2">
        <Action label="Cancelar" onPress={onDone} />
        <Action label="Ir ahí" onPress={submit} primary />
      </View>
    </Card>
  )
}

function statusMessage(plan: Exclude<RoutePlan, { status: 'ready' }>, isLocationDenied: boolean) {
  switch (plan.status) {
    case 'idle':
      return isLocationDenied
        ? 'Sin tu ubicación no hay desde dónde salir. Mantén presionado el mapa para fijar el inicio.'
        : 'Esperando tu ubicación para calcular la ruta…'
    case 'loading':
      return 'Calculando la ruta…'
    case 'no-route':
      return 'No hay ruta en bici hasta ahí. Prueba con un punto sobre una calle.'
    case 'unavailable':
      return 'El servidor de rutas no responde. Revisa la señal o prueba en un rato.'
  }
}

type RoutePanelProps = {
  plan: RoutePlan
  pending: Point | null
  onPendingDone: () => void
  isLocationDenied: boolean
}

export function RoutePanel({ plan, pending, onPendingDone, isLocationDenied }: RoutePanelProps) {
  const { start, destination, setStart, setDestination, clear } = useRouteEndpoints()
  const [isTypingCoordinates, setIsTypingCoordinates] = useState(false)

  if (pending) {
    return (
      <Card>
        <Message>¿Qué hacemos con este punto?</Message>
        <View className="flex-row flex-wrap justify-end gap-2">
          <Action label="Cancelar" onPress={onPendingDone} />
          <Action
            label="Salir de aquí"
            onPress={() => {
              setStart({ point: pending, fromGps: false })
              onPendingDone()
            }}
          />
          <Action
            label="Ir aquí"
            primary
            onPress={() => {
              setDestination(pending)
              onPendingDone()
            }}
          />
        </View>
      </Card>
    )
  }

  if (isTypingCoordinates) return <CoordinatesForm onDone={() => setIsTypingCoordinates(false)} />

  if (!destination) {
    return (
      <Card>
        <Message>
          {start ? 'Inicio fijado. ' : ''}Mantén presionado el mapa donde quieres llegar.
        </Message>
        <View className="flex-row justify-end gap-2">
          {start ? <Action label="Quitar" onPress={clear} /> : null}
          <Action label="Pegar coordenadas" onPress={() => setIsTypingCoordinates(true)} />
        </View>
      </Card>
    )
  }

  return (
    <Card>
      {plan.status === 'ready' ? (
        <Text className="text-[17px] font-semibold text-neutral-100">
          {formatDistance(plan.distanceM)} · {formatDuration(plan.durationS)}
        </Text>
      ) : (
        <Message>{statusMessage(plan, isLocationDenied)}</Message>
      )}
      <View className="flex-row justify-end gap-2">
        {plan.status === 'unavailable' ? <Action label="Reintentar" onPress={plan.retry} /> : null}
        <Action label="Quitar ruta" onPress={clear} />
      </View>
    </Card>
  )
}
