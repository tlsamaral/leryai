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
    <ScreenContainer>
      <StatusBar style="light" />
      <View style={styles.root}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.logoTopWrap}>
          <View style={styles.logoBadge}>
            <Ionicons name="sparkles" size={24} color="#E8FBF3" />
          </View>
          <Text style={styles.logoLabel}>Lery AI</Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.bottomWrap}>
          <BlurView
            intensity={24}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.bottomCard}>
            <Text style={styles.title}>
              Fluencia em ingles com tutor de voz
            </Text>
            <Text style={styles.subtitle}>
              Pratique conversacao real, acompanhe progresso e controle seu Lery
              fisico.
            </Text>

            <Pressable style={styles.googleButton} onPress={signInWithGoogle}>
              <Ionicons name="logo-google" size={18} color="#0D2A22" />
              <Text style={styles.googleButtonText}>
                {isLoading ? 'Conectando...' : 'Continuar com Google'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.previewLink}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.previewText}>Preview do layout de login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#031824',
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(30, 127, 255, 0.26)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 120,
    left: -90,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: 'rgba(31, 138, 112, 0.2)',
  },
  logoTopWrap: {
    marginTop: 48,
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(231,249,242,0.24)',
  },
  logoLabel: {
    color: '#E7F7F0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  spacer: {
    flex: 1,
  },
  bottomWrap: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    overflow: 'hidden',
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  bottomCard: {
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E2ECE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
    gap: 12,
    shadowColor: '#102A22',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: {
    color: '#102A22',
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '800',
  },
  subtitle: {
    color: '#5F746C',
    fontSize: 15,
    lineHeight: 22,
  },
  googleButton: {
    marginTop: 4,
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: '#F5FFF9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleButtonText: {
    color: '#0D2A22',
    fontSize: 16,
    fontWeight: '800',
  },
  previewLink: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  previewText: {
    color: '#4F6C62',
    fontSize: 12,
    fontWeight: '700',
  },
})
