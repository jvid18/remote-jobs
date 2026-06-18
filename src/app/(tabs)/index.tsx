import { StyleSheet, View } from 'react-native'

import { ThemedText } from '@/shared/ui/themed-text'

export default function JobsScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Jobs</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
