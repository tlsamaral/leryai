import { RefreshControl, ScrollView, StyleSheet } from 'react-native'
import { FeedbackCard } from '../../features/results/components/feedback-card'
import { useResultsViewModel } from '../../features/results/viewmodels/use-results-view-model'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { SectionTitle } from '../../shared/components/section-title'
import { theme } from '../../shared/theme'

export default function ResultsTab() {
  const { items, isLoading, openDetail, refetch } = useResultsViewModel()

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => void refetch()} />
        }
      >
        <SectionTitle
          title="Resultados"
          subtitle="Historico de feedback e pontuacao"
        />
        {items.length === 0 ? (
          <EmptyState message="Voce ainda nao possui resultados." />
        ) : (
          items.map((item) => (
            <FeedbackCard
              key={item.lessonId}
              lessonTitle={item.lessonTitle}
              score={item.latestScore}
              attempts={item.attempts}
              lastSessionAt={item.lastSessionAt}
              onPress={() => openDetail(item.lessonId)}
            />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
})
