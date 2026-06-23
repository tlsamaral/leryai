import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { signOutFromGoogle } from '../services/google-signin'
import { useSessionStore } from '../store/session-store'

export function useSignOut() {
  const router = useRouter()
  const clearSession = useSessionStore((s) => s.clearSession)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      await signOutFromGoogle()
      await clearSession()
      qc.clear()
    },
    onSuccess: () => {
      router.replace('/auth')
    },
  })

  return {
    signOut: () => mutation.mutate(),
    isPending: mutation.isPending,
  }
}
