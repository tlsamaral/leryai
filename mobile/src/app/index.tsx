import { Redirect } from 'expo-router'
import { useEffect } from 'react'
import { useSessionStore } from '../features/auth/store/session-store'
import { LoadingState } from '../shared/components/loading-state'
import { ScreenContainer } from '../shared/components/screen-container'

export default function IndexPage() {
  const bootstrap = useSessionStore((state) => state.bootstrap)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)

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

  return <Redirect href="/auth" />
}
