import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { theme } from '../shared/theme'

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
          options={{
            title: 'Configurar Lery',
            headerBackTitle: 'Voltar',
            headerTintColor: theme.colors.text,
            headerStyle: { backgroundColor: theme.colors.bg },
          }}
        />
        <Stack.Screen
          name="lesson/[lessonId]"
          options={{
            title: 'Lesson',
            headerBackTitle: 'Voltar',
            headerTintColor: theme.colors.text,
            headerStyle: { backgroundColor: theme.colors.bg },
          }}
        />
        <Stack.Screen
          name="results/[lessonId]"
          options={{
            title: 'Resultado detalhado',
            headerBackTitle: 'Voltar',
            headerTintColor: theme.colors.text,
            headerStyle: { backgroundColor: theme.colors.bg },
          }}
        />
      </Stack>
    </QueryClientProvider>
  )
}
