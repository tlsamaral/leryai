import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { getLeryApi } from '../../../shared/api/provider'

export function useResultsViewModel() {
  const router = useRouter()

  const resultsQuery = useQuery({
    queryKey: ['results'],
    queryFn: () => getLeryApi().getResults(),
  })

  return {
    items: resultsQuery.data?.items ?? [],
    isLoading: resultsQuery.isLoading,
    isError: resultsQuery.isError,
    refetch: resultsQuery.refetch,
    openDetail: (lessonId: string) => router.push(`/results/${lessonId}`),
  }
}
