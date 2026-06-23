import { useEffect } from 'react'
import { useSessionStore } from '../store/session-store'

interface Props {
  onReady?: () => void
}

export function SessionBootstrap({ onReady }: Props) {
  const bootstrap = useSessionStore((s) => s.bootstrap)
  const isBootstrapped = useSessionStore((s) => s.isBootstrapped)

  useEffect(() => {
    if (!isBootstrapped) {
      void bootstrap()
    }
  }, [bootstrap, isBootstrapped])

  useEffect(() => {
    if (isBootstrapped) onReady?.()
  }, [isBootstrapped, onReady])

  return null
}
