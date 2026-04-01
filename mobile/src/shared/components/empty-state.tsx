import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
  },
})
