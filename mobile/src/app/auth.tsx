import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuthViewModel } from '../features/auth/viewmodels/use-auth-view-model'
import { ScreenContainer } from '../shared/components/screen-container'

export default function AuthPage() {
  const { signInWithGoogle, isLoading } = useAuthViewModel()

  return (
    <ScreenContainer>
      <View style={styles.root}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="arrow-back" size={20} color="#163D32" />
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>Preview de login</Text>
          <Text style={styles.title}>Acesso por Google</Text>
          <Text style={styles.subtitle}>
            Fluxo final de autenticacao unico com Google para sincronizar seu
            progresso.
          </Text>

          <Pressable style={styles.googleButton} onPress={signInWithGoogle}>
            <Ionicons name="logo-google" size={18} color="#F5FFFB" />
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
  root: {
    flex: 1,
    backgroundColor: '#F5FAF8',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D5E6DF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 6,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E0ECE7',
    backgroundColor: '#FFFFFF',
    padding: 18,
    gap: 10,
    shadowColor: '#102A22',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  eyebrow: {
    color: '#2D8068',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#102A22',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: '#5F746C',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
  },
  googleButton: {
    minHeight: 50,
    borderRadius: 999,
    backgroundColor: '#1F8A70',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleButtonText: {
    color: '#F5FFFB',
    fontSize: 15,
    fontWeight: '800',
  },
})
