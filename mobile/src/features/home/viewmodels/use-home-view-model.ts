import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { getLeryApi } from '../../../shared/api/provider'

export function useHomeViewModel() {
  const router = useRouter()
  const mapQuery = useQuery({
    queryKey: ['learning-map'],
    queryFn: () => getLeryApi().getLearningMap(),
  })

  return {
    map: mapQuery.data,
    isLoading: mapQuery.isLoading,
    isError: mapQuery.isError,
    refetch: mapQuery.refetch,
    openLesson: (lessonId: string) => router.push(`/lesson/${lessonId}`),
  }
}
