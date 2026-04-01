import { useQuery } from '@tanstack/react-query'
import { getLeryApi } from '../../../shared/api/provider'
import { useSessionStore } from '../../auth/store/session-store'

export function useProfileViewModel() {
  const user = useSessionStore((state) => state.user)
  const clearSession = useSessionStore((state) => state.clearSession)
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => getLeryApi().getProfile(),
  })

  return {
    user,
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
    logout: clearSession,
  }
}
