import type { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../theme'

interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean
}

export function ScreenContainer({
  children,
  scroll = false,
}: ScreenContainerProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {children}
        </ScrollView>
      </SafeAreaView>
    )
  }

  return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
})
