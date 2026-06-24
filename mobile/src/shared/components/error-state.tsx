import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Algo deu errado. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconWrap}>
        <Ionicons name="cloud-offline" size={28} color={theme.colors.primary} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Ionicons name="refresh" size={16} color="#040D12" />
          <Text style={styles.buttonText}>Tentar de novo</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#040D12',
    fontWeight: theme.fontWeights.bold,
    fontSize: 14,
  },
})
