import type { FilterSpecification, LineLayerSpecification } from '@maplibre/maplibre-react-native'

/** Estilo base del mapa. Cambiar de proveedor de tiles es cambiar esta URL (0016). */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/** Parque Kennedy, Miraflores. Centro por defecto hasta que haya ubicación. */
export const LIMA_CENTER: [number, number] = [-77.0297, -12.1219]

/**
 * La red ciclista ya no sale del tile.
 *
 * WHY El tile solo transporta `subclass=cycleway`: no sabe de carriles
 * pintados y trae casi ningún `bicycle=designated`. En el Centro mostraba 4
 * tramos donde PostGIS tiene 128. Se dibuja desde el API (0026).
 */
export const CYCLEWAYS_SOURCE = 'tupu-cycleways'

/** Filtros sobre el GeoJSON del API: el tipo llega en la propiedad kind. */
export const IS_TRACK: FilterSpecification = ['==', ['get', 'kind'], 'track']
export const IS_LANE: FilterSpecification = ['==', ['get', 'kind'], 'lane']
export const IS_SHARED: FilterSpecification = ['==', ['get', 'kind'], 'shared']

/** Verde: tenés la vía para vos, separada del tráfico. */
export const TRACK_COLOR = '#0E9F6E'
/** El mismo verde punteado: es infraestructura, pero solo pintura. */
export const LANE_COLOR = '#0E9F6E'
/** Ámbar: compartís el asfalto con los autos. */
export const SHARED_COLOR = '#D97706'
/** Halo blanco por debajo, para que la línea no se pierda sobre el mapa base. */
export const CASING_COLOR = '#FFFFFF'

type LineWidth = NonNullable<NonNullable<LineLayerSpecification['paint']>['line-width']>

/** Se engrosa con el zoom para que la red siga leyéndose al alejarse. */
export const TRACK_WIDTH: LineWidth = ['interpolate', ['linear'], ['zoom'], 10, 1.8, 14, 4, 18, 9]

/** El halo va siempre un poco más ancho que la línea que envuelve. */
export const CASING_WIDTH: LineWidth = ['interpolate', ['linear'], ['zoom'], 10, 3.4, 14, 7, 18, 13]

/** Carril y compartida van más finas: no son lo mismo y no deben pesar igual. */
export const THIN_WIDTH: LineWidth = ['interpolate', ['linear'], ['zoom'], 10, 1.2, 14, 2.8, 18, 6]

/** Guiones: se leen como «acá no hay separación». */
export const LANE_DASH: [number, number] = [3, 1.5]
export const SHARED_DASH: [number, number] = [1.5, 1.5]
