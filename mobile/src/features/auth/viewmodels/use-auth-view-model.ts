import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { getLeryApi } from '../../../shared/api/provider'
import { useSessionStore } from '../store/session-store'

export function useAuthViewModel() {
  const router = useRouter()
  const setSession = useSessionStore((state) => state.setSession)

  const mutation = useMutation({
    mutationFn: () => getLeryApi().authGoogle({ idToken: 'mock-google-token' }),
    onSuccess: (data) => {
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      })
      router.replace('/(tabs)/home')
    },
  })

  return {
    signInWithGoogle: () => mutation.mutate(),
    isLoading: mutation.isPending,
  }
}
