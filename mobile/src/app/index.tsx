import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Redirect, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSessionStore } from '../features/auth/store/session-store'
import { useAuthViewModel } from '../features/auth/viewmodels/use-auth-view-model'
import { LoadingState } from '../shared/components/loading-state'
import { ScreenContainer } from '../shared/components/screen-container'

export default function IndexPage() {
  const router = useRouter()
  const bootstrap = useSessionStore((state) => state.bootstrap)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const { signInWithGoogle, isLoading } = useAuthViewModel()

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  if (!isBootstrapped) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.glowTop} />
      <View style={styles.glowMid} />
      <View style={styles.glowBottom} />

      <View style={styles.logoTopWrap}>
        <View style={styles.logoBadge}>
          <Ionicons name="radio-outline" size={26} color="#04D2FF" />
        </View>
        <View style={styles.logoTextRow}>
          <Text style={styles.logoLery}>Lery</Text>
          <Text style={styles.logoAI}> AI</Text>
        </View>
        <Text style={styles.logoTagline}>Tutor de voz • Aprenda inglês</Text>
      </View>

      <View style={styles.spacer} />

      <View style={styles.bottomWrap}>
        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.bottomCard}>
          <Text style={styles.title}>Fluência em inglês com tutor de voz</Text>
          <Text style={styles.subtitle}>
            Pratique conversação real, acompanhe progresso e controle seu Lery
            físico.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={signInWithGoogle}
          >
            <Ionicons name="logo-google" size={18} color="#040D12" />
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Conectando...' : 'Continuar com Google'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.previewLink}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.previewText}>Entrar com e-mail e senha</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#040D12',
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(4, 210, 255, 0.22)',
  },
  glowMid: {
    position: 'absolute',
    top: '38%',
    left: '30%',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(4, 210, 255, 0.08)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 180,
    left: -100,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 145, 184, 0.16)',
  },
  logoTopWrap: {
    marginTop: 72,
    alignItems: 'center',
    gap: 6,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(4, 210, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(4, 210, 255, 0.36)',
  },
  logoTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  logoLery: {
    color: '#EAFAFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  logoAI: {
    color: '#04D2FF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  logoTagline: {
    color: 'rgba(4, 210, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  spacer: {
    flex: 1,
  },
  bottomWrap: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  bottomCard: {
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E0EBF1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 12,
    shadowColor: '#04D2FF',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
  },
  title: {
    color: '#0A1B23',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: '#5A6E78',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: 4,
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: '#04D2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#04D2FF',
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.97 }],
  },
  primaryButtonText: {
    color: '#040D12',
    fontSize: 16,
    fontWeight: '800',
  },
  previewLink: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  previewText: {
    color: '#5A6E78',
    fontSize: 13,
    fontWeight: '600',
  },
})
