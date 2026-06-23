import { router, useSegments } from 'expo-router'
import { type ReactNode, useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { theme } from '../../../shared/theme'
import { useSessionStore } from '../store/session-store'

const PUBLIC_ROUTES = new Set(['auth', 'index'])

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)
  const refreshToken = useSessionStore((s) => s.refreshToken)
  const isBootstrapped = useSessionStore((s) => s.isBootstrapped)
  const segments = useSegments()

  useEffect(() => {
    if (!isBootstrapped) return

    const root = segments[0] ?? 'index'
    const isPublic = PUBLIC_ROUTES.has(root)
    // We consider the user "potentially authenticated" if either a live
    // session or a stored refresh token exists. The HttpClient will
    // upgrade/refresh as needed; if refresh fails, clearSession() will
    // flip isAuthenticated to false and this guard kicks in.
    const isPotentiallyAuthed = isAuthenticated || Boolean(refreshToken)

    if (!isPotentiallyAuthed && !isPublic) {
      router.replace('/auth')
    } else if (isAuthenticated && root === 'auth') {
      router.replace('/(tabs)/home')
    }
  }, [isAuthenticated, isBootstrapped, refreshToken, segments])

  if (!isBootstrapped) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return <>{children}</>
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
})
