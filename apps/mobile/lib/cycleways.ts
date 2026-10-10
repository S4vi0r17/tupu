import { useQuery } from '@tanstack/react-query'
import type { CyclewayCollection } from '@tupu/contracts'
import { api } from './api.ts'

const EMPTY: CyclewayCollection = { type: 'FeatureCollection', features: [] }

/** La red entera, pedida una vez por sesión: solo cambia cuando corre osm:update (0041). */
export function useCycleways() {
  const query = useQuery({
    queryKey: ['cycleways'],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async (): Promise<CyclewayCollection> => {
      const response = await api.v1.cycleways.$get()
      if (!response.ok) throw new Error('No se pudieron traer las ciclovías')
      return (await response.json()) as CyclewayCollection
    },
  })

  return { collection: query.data ?? EMPTY, isError: query.isError }
}
