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
      <StatusBar style="auto" />
      <Stack>
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
    </QueryClientProvider>
  )
}
