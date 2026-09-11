import type { CircleLayerSpecification } from '@maplibre/maplibre-react-native'
import { GeoJSONSource, Images, Layer } from '@maplibre/maplibre-react-native'
import type { Point } from '@tupu/geo'
import { useMemo } from 'react'
import coneIcon from '../assets/heading-cone.png'

const RIDER_SOURCE = 'tupu-rider'
const CONE_IMAGE = 'tupu-heading-cone'

/** Azul: en este mapa el verde y el ámbar ya son la red ciclista (0038). */
const RIDER_COLOR = '#2563EB'

/** Metros por píxel a zoom 0 en la latitud de Lima. */
const METERS_PER_PIXEL_AT_ZOOM_0 = 153_054

type CircleRadius = NonNullable<NonNullable<CircleLayerSpecification['paint']>['circle-radius']>

/**
 * Traduce la incertidumbre del GPS al radio en píxeles que pide MapLibre.
 *
 * WHY Cada zoom parte en dos el metro por píxel, que es exactamente lo que
 * interpola `exponential` en base 2 entre los extremos de la escala.
 */
function accuracyRadius(accuracyM: number): CircleRadius {
  return [
    'interpolate',
    ['exponential', 2],
    ['zoom'],
    0,
    accuracyM / METERS_PER_PIXEL_AT_ZOOM_0,
    22,
    (accuracyM * 2 ** 22) / METERS_PER_PIXEL_AT_ZOOM_0,
  ]
}

type RiderPuckProps = {
  point: Point
  headingDegrees: number | null
  accuracyM: number | null
}

/** El punto azul con el cono de visión: hacia dónde mira el teléfono (0027). */
export function RiderPuck({ point, headingDegrees, accuracyM }: RiderPuckProps) {
  const data = useMemo(
    () => ({
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'Point' as const, coordinates: [point.lng, point.lat] },
    }),
    [point],
  )

  return (
    <>
      <Images images={{ [CONE_IMAGE]: coneIcon }} />

      <GeoJSONSource id={RIDER_SOURCE} data={data}>
        {accuracyM === null ? null : (
          <Layer
            id="tupu-rider-accuracy"
            type="circle"
            source={RIDER_SOURCE}
            paint={{
              'circle-color': RIDER_COLOR,
              'circle-opacity': 0.12,
              'circle-pitch-alignment': 'map',
              'circle-radius': accuracyRadius(accuracyM),
            }}
          />
        )}

        {headingDegrees === null ? null : (
          <Layer
            id="tupu-rider-cone"
            type="symbol"
            source={RIDER_SOURCE}
            layout={{
              'icon-image': CONE_IMAGE,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-pitch-alignment': 'map',
              // ! Alineado al mapa, no a la pantalla: el cono tiene que girar
              // ! también cuando gire el mapa en el modo que lo sigue (0039).
              'icon-rotation-alignment': 'map',
              'icon-rotate': headingDegrees,
            }}
          />
        )}

        <Layer
          id="tupu-rider-halo"
          type="circle"
          source={RIDER_SOURCE}
          paint={{
            'circle-radius': 8,
            'circle-color': '#FFFFFF',
            'circle-pitch-alignment': 'map',
          }}
        />

        <Layer
          id="tupu-rider-dot"
          type="circle"
          source={RIDER_SOURCE}
          paint={{
            'circle-radius': 5.5,
            'circle-color': RIDER_COLOR,
            'circle-pitch-alignment': 'map',
          }}
        />
      </GeoJSONSource>
    </>
  )
}
