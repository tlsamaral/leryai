import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'

interface AsyncBoundaryProps<T> {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
  loading?: ReactNode
  error?: (err: Error, retry: () => void) => ReactNode
  isEmpty?: (data: T) => boolean
  emptyMessage?: string
  emptyState?: ReactNode
}

export function AsyncBoundary<T>({
  query,
  children,
  loading,
  error,
  isEmpty,
  emptyMessage = 'Nada por aqui ainda.',
  emptyState,
}: AsyncBoundaryProps<T>) {
  if (query.isPending) {
    return <>{loading ?? <LoadingState />}</>
  }

  if (query.isError) {
    const retry = () => {
      void query.refetch()
    }
    if (error) return <>{error(query.error as Error, retry)}</>
    return (
      <ErrorState message={(query.error as Error)?.message} onRetry={retry} />
    )
  }

  const data = query.data as T
  if (isEmpty?.(data)) {
    return <>{emptyState ?? <EmptyState message={emptyMessage} />}</>
  }

  return <>{children(data)}</>
}
