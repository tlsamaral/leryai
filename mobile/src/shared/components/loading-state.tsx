import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { theme } from '../theme'

export function LoadingState() {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
