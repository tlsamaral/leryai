import { useQuery } from '@tanstack/react-query'
import { getLeryApi } from '../../../shared/api/provider'

export function useResultDetailViewModel(lessonId: string) {
  const detailQuery = useQuery({
    queryKey: ['result-detail', lessonId],
    queryFn: () => getLeryApi().getLessonResult(lessonId),
  })

  return {
    data: detailQuery.data,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    refetch: detailQuery.refetch,
  }
}
