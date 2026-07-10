import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../shared/api/query-keys'
import type { User } from '../../../shared/types/domain'
import { httpClient } from '../services/http-client'
import { useSessionStore } from '../store/session-store'

interface MeResponse {
  id: string
  email: string
  username: string
  name: string
  avatarUrl: string | null
  currentLevel: string
  diagnosisCompleted: boolean
  createdAt: string
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    enabled,
    queryFn: async (): Promise<User> => {
      const data = await httpClient.request<MeResponse>('/me')
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
      }
      const current = useSessionStore.getState().user
      if (
        !current ||
        current.id !== user.id ||
        current.name !== user.name ||
        current.email !== user.email ||
        current.avatarUrl !== user.avatarUrl
      ) {
        useSessionStore.getState().setUser(user)
      }
      return user
    },
    staleTime: 5 * 60 * 1000,
  })
}
