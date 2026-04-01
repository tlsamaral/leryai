import { Redirect } from 'expo-router'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSessionStore } from '../features/auth/store/session-store'
import { usePairLeryViewModel } from '../features/device-pairing/viewmodels/use-pair-lery-view-model'
import { ScreenContainer } from '../shared/components/screen-container'
import { SectionTitle } from '../shared/components/section-title'
import { theme } from '../shared/theme'

export default function PairLeryPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const {
    pairingCode,
    setPairingCode,
    submitCode,
    status,
    errorMessage,
    isLoading,
  } = usePairLeryViewModel()

  if (!isBootstrapped) {
    return (
      <ScreenContainer>
        <View style={styles.loadingWrap}>
          <Text style={styles.hint}>Carregando sessao...</Text>
        </View>
      </ScreenContainer>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <SectionTitle
          title="Configurar Lery"
          subtitle="Escaneie o QR no dispositivo ou digite o codigo de pareamento."
        />

        <View style={styles.card}>
          <Text style={styles.label}>Codigo de pareamento</Text>
          <TextInput
            style={styles.input}
            value={pairingCode}
            onChangeText={setPairingCode}
            placeholder="Ex.: LERY-PAIR-001"
            autoCapitalize="characters"
            placeholderTextColor={theme.colors.muted}
          />
          <Pressable
            style={styles.button}
            onPress={submitCode}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Pareando...' : 'Parear dispositivo'}
            </Text>
          </Pressable>
          <Text style={styles.hint}>No mock, utilize: LERY-PAIR-001</Text>
          {status === 'paired' ? (
            <Text style={styles.success}>Lery pareado com sucesso.</Text>
          ) : null}
          {status === 'error' ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.surface,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
  hint: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
  success: {
    color: theme.colors.success,
    fontWeight: '600',
    fontSize: theme.typography.caption,
  },
  error: {
    color: theme.colors.danger,
    fontWeight: '600',
    fontSize: theme.typography.caption,
  },
})
