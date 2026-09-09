import { formatDistance, formatDuration } from '@tupu/geo'
import { StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.wordmark}>tupu</Text>
      <Text style={styles.caption}>
        {formatDistance(12_400)} · {formatDuration(4800)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e0e0e',
    gap: 8,
  },
  wordmark: {
    color: '#f4f4f4',
    fontSize: 34,
    letterSpacing: 8,
  },
  caption: {
    color: '#6f6f6f',
    fontSize: 13,
    letterSpacing: 1,
  },
})
