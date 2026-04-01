import { Redirect, Tabs } from 'expo-router'
import { useSessionStore } from '../../features/auth/store/session-store'
import { LoadingState } from '../../shared/components/loading-state'
import { PillTabBar } from '../../shared/components/pill-tab-bar'
import { ScreenContainer } from '../../shared/components/screen-container'

export default function TabsLayout() {
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)

  if (!isBootstrapped) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />
  }

  return (
    <Tabs
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="results" options={{ title: 'Resultados' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  )
}
