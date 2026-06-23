import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import type {
  AuthGoogleRequest,
  AuthGoogleResponse,
} from '../../../shared/types/api'
import {
  GoogleSignInCancelledError,
  signInWithGoogle,
} from '../services/google-signin'
import { httpClient } from '../services/http-client'
import { useSessionStore } from '../store/session-store'

export function useSignIn() {
  const router = useRouter()
  const setSession = useSessionStore((s) => s.setSession)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const google = await signInWithGoogle()
      const body: AuthGoogleRequest = { idToken: google.idToken }
      const auth = await httpClient.request<AuthGoogleResponse>(
        '/auth/google',
        {
          method: 'POST',
          body,
          anonymous: true,
        },
      )
      return auth
    },
    onSuccess: async (auth) => {
      await setSession({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        user: auth.user,
      })
      qc.setQueryData(['me'], auth.user)
      router.replace('/(tabs)/home')
    },
  })

  return {
    signIn: () => mutation.mutate(),
    isPending: mutation.isPending,
    error: mutation.error,
    isCancelled: mutation.error instanceof GoogleSignInCancelledError,
  }
}
