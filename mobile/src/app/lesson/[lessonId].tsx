import { Ionicons } from '@expo/vector-icons'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSessionStore } from '../../features/auth/store/session-store'
import { PromptEditorCard } from '../../features/lessons/components/prompt-editor-card'
import { useLessonDetailViewModel } from '../../features/lessons/viewmodels/use-lesson-detail-view-model'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { theme } from '../../shared/theme'

export default function LessonDetailPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>()
  const vm = useLessonDetailViewModel(lessonId)

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

  if (vm.isLoading || !vm.lesson) {
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Text style={styles.heroBadge}>Modulo {vm.lesson.moduleName}</Text>
            <View style={styles.heroStatusChip}>
              <Ionicons name="flash" size={12} color="#F4FFFC" />
              <Text style={styles.heroStatusText}>{vm.lesson.status}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{vm.lesson.title}</Text>
          <Text style={styles.heroSubtitle}>{vm.lesson.scenario}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricChip}>
              <Text style={styles.metricValue}>{vm.lesson.score}%</Text>
              <Text style={styles.metricLabel}>Score atual</Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricValue}>{vm.lesson.attempts}</Text>
              <Text style={styles.metricLabel}>Tentativas</Text>
            </View>
          </View>
        </View>

        <PromptEditorCard
          value={vm.promptValue}
          isSaving={vm.isSaving}
          onChange={vm.setPromptValue}
          onSave={vm.savePrompt}
        />

        <Pressable style={styles.retryButton} onPress={vm.retryLesson}>
          <Ionicons name="reload" size={15} color="#12392F" />
          <Text style={styles.retryText}>
            {vm.isRetrying ? 'Atualizando...' : 'Refazer lesson'}
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 10,
    gap: 12,
    paddingBottom: 120,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#156B55',
    backgroundColor: '#1D8A70',
    padding: 14,
    gap: 8,
    shadowColor: '#1D8A70',
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    color: '#D2F2E6',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  heroStatusText: {
    color: '#F4FFFC',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#F5FFFB',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginTop: 4,
  },
  heroSubtitle: {
    color: '#D6F3E9',
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  metricChip: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  metricValue: {
    color: '#F6FFFB',
    fontSize: 19,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#D6F3E9',
    fontSize: 11,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: theme.colors.accent,
    minHeight: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  retryText: {
    color: '#12392F',
    fontWeight: '700',
    fontSize: 14,
  },
})
