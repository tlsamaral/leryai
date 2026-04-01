import { Redirect, useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSessionStore } from '../../features/auth/store/session-store'
import { useResultDetailViewModel } from '../../features/results/viewmodels/use-result-detail-view-model'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { SectionTitle } from '../../shared/components/section-title'
import { theme } from '../../shared/theme'

export default function ResultDetailPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>()
  const { data, isLoading } = useResultDetailViewModel(lessonId)

  if (!isBootstrapped) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!data) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <SectionTitle title="Resultado" />
          <EmptyState message="Nao foi possivel carregar o resultado da lesson." />
        </View>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle
          title={data.lessonTitle}
          subtitle="Conversa, feedback e pontuacao"
        />
        {data.attempts.map((attempt) => (
          <View key={attempt.session.id} style={styles.card}>
            <Text style={styles.score}>{attempt.score}%</Text>
            <Text style={styles.summary}>{attempt.feedbackSummary}</Text>
            {attempt.logs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <Text style={styles.logTitle}>Voce</Text>
                <Text style={styles.logText}>{log.userAudioTrans}</Text>
                <Text style={styles.logTitle}>Lery</Text>
                <Text style={styles.logText}>{log.leryResponse}</Text>
                <Text style={styles.fix}>{log.grammaticalFixes}</Text>
              </View>
            ))}
          </View>
        ))}
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
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  score: {
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: theme.typography.h1,
  },
  summary: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
  },
  logCard: {
    backgroundColor: '#FCFFFD',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    gap: 4,
  },
  logTitle: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.caption,
  },
  logText: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
  },
  fix: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    fontStyle: 'italic',
  },
})
