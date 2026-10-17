import type { FilterSpecification, LineLayerSpecification } from '@maplibre/maplibre-react-native'

// Cambiar de proveedor de tiles es cambiar esta URL (0016)
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

// Parque Kennedy, hasta que llegue la ubicación
export const LIMA_CENTER: [number, number] = [-77.0297, -12.1219]

// Desde el API y no del tile, que no sabe de carriles pintados (0038)
export const CYCLEWAYS_SOURCE = 'tupu-cycleways'

export const IS_TRACK: FilterSpecification = ['==', ['get', 'kind'], 'track']
export const IS_LANE: FilterSpecification = ['==', ['get', 'kind'], 'lane']
export const IS_SHARED: FilterSpecification = ['==', ['get', 'kind'], 'shared']

export const TRACK_COLOR = '#0E9F6E'
// Mismo verde que la vía propia; lo distingue el punteado
export const LANE_COLOR = '#0E9F6E'
export const SHARED_COLOR = '#D97706'
export const CASING_COLOR = '#FFFFFF'

type LineWidth = NonNullable<NonNullable<LineLayerSpecification['paint']>['line-width']>

// Píxeles a zoom 10, 14 y 18; MapLibre interpola en medio
function byZoom(at10: number, at14: number, at18: number): LineWidth {
  return ['interpolate', ['linear'], ['zoom'], 10, at10, 14, at14, 18, at18]
}

export const TRACK_WIDTH = byZoom(1.8, 4, 9)
export const CASING_WIDTH = byZoom(3.4, 7, 13)
// Carril y compartida, más finas que la vía propia
export const THIN_WIDTH = byZoom(1.2, 2.8, 6)

// Los guiones se leen como «sin separación del tráfico»
export const LANE_DASH: [number, number] = [3, 1.5]
export const SHARED_DASH: [number, number] = [1.5, 1.5]
