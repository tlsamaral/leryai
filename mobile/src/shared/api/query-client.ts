import { QueryClient } from '@tanstack/react-query'
import { HttpError } from './http-errors'

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof HttpError && error.isClientError) return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
