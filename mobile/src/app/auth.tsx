import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuthViewModel } from '../features/auth/viewmodels/use-auth-view-model'
import { ScreenContainer } from '../shared/components/screen-container'
import { SectionTitle } from '../shared/components/section-title'
import { theme } from '../shared/theme'

export default function AuthPage() {
  const { signInWithGoogle, isLoading } = useAuthViewModel()

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <SectionTitle
          title="Lery AI"
          subtitle="Converse em ingles sem ansiedade, com seu tutor de voz no hardware."
        />
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Entrar no app</Text>
          <Text style={styles.panelDescription}>
            Acesso mobile via Google apenas.
          </Text>
          <Pressable style={styles.googleButton} onPress={signInWithGoogle}>
            <Text style={styles.googleButtonText}>
              {isLoading ? 'Conectando...' : 'Continuar com Google'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.bg,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  panelTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.h1,
    fontWeight: '700',
  },
  panelDescription: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
  },
  googleButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  googleButtonText: {
    color: theme.colors.surface,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
})
