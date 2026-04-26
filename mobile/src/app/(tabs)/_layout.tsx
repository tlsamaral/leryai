import { useQuery } from '@tanstack/react-query'
import { Redirect, Tabs } from 'expo-router'
import { useSessionStore } from '../../features/auth/store/session-store'
import { getLeryApi } from '../../shared/api/provider'
import { LoadingState } from '../../shared/components/loading-state'
import { PillTabBar } from '../../shared/components/pill-tab-bar'
import { ScreenContainer } from '../../shared/components/screen-container'

export default function TabsLayout() {
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getLeryApi().getProfile(),
    enabled: isBootstrapped && isAuthenticated,
  })

  if (!isBootstrapped || (isAuthenticated && profileLoading && !profileData)) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />
  }

  if (profileData && (!profileData.profile || !profileData.profile.nativeLanguage)) {
    return <Redirect href="/onboarding" />
  }

  return (
    <Tabs
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: 'Foco' }} />
      <Tabs.Screen name="journey" options={{ title: 'Trilha' }} />
      <Tabs.Screen name="results" options={{ title: 'Resultados' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  )
}
