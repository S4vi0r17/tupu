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
 * Calles donde la bici está señalizada, sin vía propia.
 *
 * ! El tile no expone `cycleway=lane`, así que un carril pintado solo se
 * ! distingue si además está etiquetado con bicycle. Es el límite de dibujar
 * ! desde el tile, y el disparador de 0026 si algún día molesta.
 */
export const BIKE_FRIENDLY_ROAD: FilterSpecification = [
  'all',
  ['!=', ['get', 'subclass'], 'cycleway'],
  ['in', ['get', 'bicycle'], ['literal', ['designated', 'yes']]],
]

export const CYCLEWAY_COLOR = '#0FA47F'
export const BIKE_FRIENDLY_COLOR = '#6FB3A0'

type LineWidth = NonNullable<NonNullable<LineLayerSpecification['paint']>['line-width']>

/** Se engrosa con el zoom para que la red siga leyéndose al alejarse. */
export const CYCLEWAY_WIDTH: LineWidth = [
  'interpolate',
  ['linear'],
  ['zoom'],
  10,
  1.4,
  14,
  3.2,
  18,
  7,
]
