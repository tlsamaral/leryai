import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSignIn } from '../features/auth/hooks/use-sign-in'
import { theme } from '../shared/theme'

export default function AuthPage() {
  const { signIn, isPending, error, isCancelled } = useSignIn()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
        <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Login</Text>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>
          Entre para continuar praticando com o Lery.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
            isPending && styles.disabled,
          ]}
          onPress={signIn}
          disabled={isPending}
        >
          <Ionicons name="logo-google" size={18} color="#040D12" />
          <Text style={styles.primaryButtonText}>
            {isPending ? 'Conectando...' : 'Continuar com Google'}
          </Text>
        </Pressable>

        {error && !isCancelled ? (
          <Text style={styles.errorText}>{error.message}</Text>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#D0E8F0',
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 20,
    gap: 12,
    ...theme.shadow.soft,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: theme.fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: theme.tracking.wider,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: theme.tracking.tight,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
    lineHeight: theme.lineHeights.body,
    marginBottom: 4,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#040D12',
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
  },
  errorText: {
    color: '#D9534F',
    fontSize: theme.typography.caption,
    textAlign: 'center',
  },
})
