import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { theme } from '../shared/theme'

const headerDefaults = {
  headerBackTitle: 'Voltar',
  headerTintColor: theme.colors.primary,
  headerStyle: { backgroundColor: theme.colors.bg },
  headerShadowVisible: false,
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pair-lery"
          options={{ ...headerDefaults, title: 'Configurar Lery' }}
        />
        <Stack.Screen
          name="lesson/[lessonId]"
          options={{ ...headerDefaults, title: 'Lição' }}
        />
        <Stack.Screen
          name="results/[lessonId]"
          options={{ ...headerDefaults, title: 'Resultado' }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  )
}
