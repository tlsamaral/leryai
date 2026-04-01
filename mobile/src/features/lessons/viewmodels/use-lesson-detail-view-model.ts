import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getLeryApi } from '../../../shared/api/provider'

export function useLessonDetailViewModel(lessonId: string) {
  const queryClient = useQueryClient()

  const mapQuery = useQuery({
    queryKey: ['learning-map'],
    queryFn: () => getLeryApi().getLearningMap(),
  })

  const lesson = useMemo(() => {
    if (!mapQuery.data) {
      return null
    }

    for (const module of mapQuery.data.modules) {
      const item = module.lessons.find((entry) => entry.id === lessonId)
      if (item) {
        return {
          ...item,
          moduleName: module.name,
        }
      }
    }

    return null
  }, [mapQuery.data, lessonId])

  const currentQuery = useQuery({
    queryKey: ['progress-current'],
    queryFn: () => getLeryApi().getProgressCurrent(),
  })

  const [promptValue, setPromptValue] = useState('')

  const hydratedPrompt =
    promptValue || currentQuery.data?.lesson?.systemPrompt || ''

  const saveMutation = useMutation({
    mutationFn: (prompt: string) =>
      getLeryApi().updateLessonPromptOverride(lessonId, {
        systemPromptOverride: prompt,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['progress-current'] })
    },
  })

  const retryMutation = useMutation({
    mutationFn: () => getLeryApi().retryLesson(lessonId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['learning-map'] })
      await queryClient.invalidateQueries({ queryKey: ['progress-current'] })
    },
  })

  return {
    lesson,
    isLoading: mapQuery.isLoading,
    promptValue: hydratedPrompt,
    setPromptValue,
    savePrompt: () => saveMutation.mutate(hydratedPrompt),
    retryLesson: () => retryMutation.mutate(),
    isSaving: saveMutation.isPending,
    isRetrying: retryMutation.isPending,
  }
}
