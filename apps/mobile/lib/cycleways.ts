import { useQuery } from '@tanstack/react-query'
import type { CyclewayCollection } from '@tupu/contracts'
import { api } from './api.ts'

export type Bbox = { west: number; south: number; east: number; north: number }

/**
 * Lado de la cuadrícula a la que se ajusta el recuadro pedido, en grados.
 *
 * WHY Unos dos kilómetros. Mover el mapa un poco no cambia la clave de la
 * consulta, así que TanStack Query responde de su caché en vez de pedir de
 * nuevo con la señal intermitente de la calle (0014).
 */
const GRID = 0.02

const snapDown = (value: number) => Math.floor(value / GRID) * GRID
const snapUp = (value: number) => Math.ceil(value / GRID) * GRID

/** Ajusta el recuadro hacia afuera, así lo pedido cubre algo más que lo visible. */
export function snapBbox(bbox: Bbox): Bbox {
  return {
    west: snapDown(bbox.west),
    south: snapDown(bbox.south),
    east: snapUp(bbox.east),
    north: snapUp(bbox.north),
  }
}

const EMPTY: CyclewayCollection = { type: 'FeatureCollection', features: [] }

export function useCyclewaysInBbox(bbox: Bbox | null) {
  const snapped = bbox ? snapBbox(bbox) : null

  const query = useQuery({
    queryKey: ['cycleways', snapped],
    enabled: snapped !== null,
    // WHY La red cambia cuando alguien corre osm:update, no mientras pedaleás
    staleTime: 60 * 60 * 1000,
    queryFn: async (): Promise<CyclewayCollection> => {
      if (!snapped) return EMPTY

      const response = await api.v1.cycleways['in-bbox'].$get({
        query: {
          west: String(snapped.west),
          south: String(snapped.south),
          east: String(snapped.east),
          north: String(snapped.north),
        },
      })

      if (!response.ok) throw new Error('No se pudieron traer las ciclovías')
      return (await response.json()) as CyclewayCollection
    },
  })

  return { collection: query.data ?? EMPTY, isLoading: query.isLoading, isError: query.isError }
}
