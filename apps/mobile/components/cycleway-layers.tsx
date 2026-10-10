import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'
import type { CyclewayCollection } from '@tupu/contracts'
import {
  CASING_COLOR,
  CASING_WIDTH,
  CYCLEWAYS_SOURCE,
  IS_LANE,
  IS_SHARED,
  IS_TRACK,
  LANE_COLOR,
  LANE_DASH,
  SHARED_COLOR,
  SHARED_DASH,
  THIN_WIDTH,
  TRACK_COLOR,
  TRACK_WIDTH,
} from '../lib/map.ts'

export function CyclewayLayers({ collection }: { collection: CyclewayCollection }) {
  return (
    <GeoJSONSource id={CYCLEWAYS_SOURCE} data={collection}>
      <Layer
        id="tupu-shared"
        type="line"
        source={CYCLEWAYS_SOURCE}
        filter={IS_SHARED}
        layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
        paint={{
          'line-color': SHARED_COLOR,
          'line-width': THIN_WIDTH,
          'line-dasharray': SHARED_DASH,
        }}
      />

      <Layer
        id="tupu-lane"
        type="line"
        source={CYCLEWAYS_SOURCE}
        filter={IS_LANE}
        layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
        paint={{
          'line-color': LANE_COLOR,
          'line-width': THIN_WIDTH,
          'line-dasharray': LANE_DASH,
        }}
      />

      <Layer
        id="tupu-track-casing"
        type="line"
        source={CYCLEWAYS_SOURCE}
        filter={IS_TRACK}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{ 'line-color': CASING_COLOR, 'line-width': CASING_WIDTH, 'line-opacity': 0.9 }}
      />

      <Layer
        id="tupu-track"
        type="line"
        source={CYCLEWAYS_SOURCE}
        filter={IS_TRACK}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{ 'line-color': TRACK_COLOR, 'line-width': TRACK_WIDTH }}
      />
    </GeoJSONSource>
  )
}
