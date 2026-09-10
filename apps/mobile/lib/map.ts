import type { FilterSpecification, LineLayerSpecification } from '@maplibre/maplibre-react-native'

/** Estilo base del mapa. Cambiar de proveedor de tiles es cambiar esta URL (0016). */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/** Parque Kennedy, Miraflores. Centro por defecto hasta que haya ubicación. */
export const LIMA_CENTER: [number, number] = [-77.0297, -12.1219]

/**
 * La fuente y la capa vectorial que ya trae el estilo base.
 *
 * NOTE Esquema OpenMapTiles: la infraestructura ciclista viaja en
 * `transportation` como class=path con subclass=cycleway.
 */
export const BASE_SOURCE = 'openmaptiles'
export const TRANSPORTATION_LAYER = 'transportation'

/** Vía propia, separada del tráfico. Es la mayoría de la red de Lima. */
export const SEPARATED_CYCLEWAY: FilterSpecification = ['==', ['get', 'subclass'], 'cycleway']

/**
 * Vías sin espacio propio donde la bici está señalizada como corresponde.
 *
 * ! Solo `designated`, nunca `yes`: `yes` significa apenas «se permite», y
 * ! pintarlo convierte media ciudad en infraestructura ciclista que no existe.
 * ! El tile tampoco expone `cycleway=lane`, así que el carril pintado no se
 * ! distingue desde acá — es el disparador de 0026.
 */
export const SIGNPOSTED_SHARED: FilterSpecification = [
  'all',
  ['!=', ['get', 'subclass'], 'cycleway'],
  ['==', ['get', 'bicycle'], 'designated'],
]

/** Verde: tenés la vía para vos. */
export const CYCLEWAY_COLOR = '#0E9F6E'
/** Ámbar: compartís el espacio, y el color lo dice antes de leer la leyenda. */
export const SHARED_COLOR = '#D97706'
/** Halo blanco por debajo, para que la línea no se pierda sobre el mapa base. */
export const CASING_COLOR = '#FFFFFF'

type LineWidth = NonNullable<NonNullable<LineLayerSpecification['paint']>['line-width']>

/** Se engrosa con el zoom para que la red siga leyéndose al alejarse. */
export const CYCLEWAY_WIDTH: LineWidth = [
  'interpolate',
  ['linear'],
  ['zoom'],
  10,
  1.8,
  14,
  4,
  18,
  9,
]

/** El halo va siempre un poco más ancho que la línea que envuelve. */
export const CASING_WIDTH: LineWidth = ['interpolate', ['linear'], ['zoom'], 10, 3.4, 14, 7, 18, 13]

/** La compartida va más fina: no es lo mismo y no debe pesar lo mismo. */
export const SHARED_WIDTH: LineWidth = [
  'interpolate',
  ['linear'],
  ['zoom'],
  10,
  1.2,
  14,
  2.6,
  18,
  5,
]

/** Guiones cortos, que se leen como «esto no es continuo ni es tuyo». */
export const SHARED_DASH: [number, number] = [1.5, 1.5]
