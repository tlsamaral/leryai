import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { AuthGuard } from '../features/auth/components/auth-guard'
import { SessionBootstrap } from '../features/auth/components/session-bootstrap'
import { createQueryClient } from '../shared/api/query-client'
import { theme } from '../shared/theme'

const headerDefaults = {
  headerBackTitle: 'Voltar',
  headerTintColor: theme.colors.primary,
  headerStyle: { backgroundColor: theme.colors.bg },
  headerShadowVisible: false,
}

export default function RootLayout() {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap />
      <AuthGuard>
        <StatusBar style="auto" />
        <Stack screenOptions={headerDefaults}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pair-lery" options={{ headerShown: false }} />
          <Stack.Screen
            name="lesson/[lessonId]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="results/[lessonId]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </AuthGuard>
    </QueryClientProvider>
  )
}
