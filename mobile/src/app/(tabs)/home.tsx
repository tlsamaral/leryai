import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import {
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSessionStore } from '../../features/auth/store/session-store'
import { useHomeViewModel } from '../../features/home/viewmodels/use-home-view-model'
import { getLeryApi } from '../../shared/api/provider'
import { ActivityRow } from '../../shared/components/activity-row'
import { DeviceStatusCard } from '../../shared/components/device-status-card'
import { LessonFocusCard } from '../../shared/components/lesson-focus-card'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { StatCard } from '../../shared/components/stat-card'
import { theme } from '../../shared/theme'

export default function HomeTab() {
  const { map, isLoading, openLesson, refetch } = useHomeViewModel()
  const user = useSessionStore((state) => state.user)
  const insets = useSafeAreaInsets()

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => getLeryApi().getProfile(),
  })

  const resultsQuery = useQuery({
    queryKey: ['results'],
    queryFn: () => getLeryApi().getResults(),
  })

  const fade = useRef(new Animated.Value(0)).current
  const slide = useRef(new Animated.Value(12)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fade, slide])

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  const userName = user?.name?.split(' ')[0] ?? 'Aluno'

  const allLessons = map?.modules.flatMap((m) => m.lessons) ?? []
  const currentLesson = allLessons.find(
    (l) => l.isCurrent || l.status === 'IN_PROGRESS',
  )
  const currentModule = map?.modules.find((m) =>
    m.lessons.some((l) => l.id === currentLesson?.id),
  )

  const completed = allLessons.filter((l) => l.status === 'COMPLETED').length
  const total = allLessons.length

  const streak = profileQuery.data?.streak.currentStreak ?? 0
  const paired = (profileQuery.data?.devices.length ?? 0) > 0
  const deviceName = profileQuery.data?.devices[0]?.nickname ?? undefined

  const recentSessions = (resultsQuery.data?.items ?? []).slice(0, 3)

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            void refetch()
            void profileQuery.refetch()
            void resultsQuery.refetch()
          }}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Animated.View
        style={[
          styles.animatedWrap,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        {/* Greeting + avatar */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTexts}>
            <Text style={styles.greetingLabel}>{greeting}</Text>
            <Text style={styles.greetingName}>{userName}</Text>
          </View>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeLabel}>Nível</Text>
            <Text style={styles.levelBadgeValue}>{map?.level ?? 'A1'}</Text>
          </View>
        </View>

        {/* Device hero */}
        <DeviceStatusCard
          paired={paired}
          deviceName={deviceName}
          onPress={() => router.push('/pair-lery')}
        />

        {/* Stats bento */}
        <View style={styles.bentoRow}>
          <StatCard
            icon="flame"
            label="Sequência"
            value={`${streak}`}
            hint={streak === 1 ? 'dia' : 'dias seguidos'}
            tone="amber"
          />
          <StatCard
            icon="trophy-outline"
            label="Progresso"
            value={`${completed}/${total}`}
            hint="lições concluídas"
            tone="cyan"
          />
        </View>

        {/* Current focus */}
        {currentLesson && currentModule ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>Foco da semana</Text>
              <Text style={styles.sectionTitle}>Próxima lição</Text>
            </View>

            <LessonFocusCard
              moduleName={currentModule.name}
              lessonTitle={currentLesson.title}
              scenario={currentLesson.scenario}
              attempts={currentLesson.attempts}
              score={currentLesson.score}
              onPress={() => openLesson(currentLesson.id)}
            />
          </View>
        ) : (
          <View style={styles.completeBanner}>
            <Text style={styles.completeBannerEmoji}>🎉</Text>
            <Text style={styles.completeBannerTitle}>Trilha em dia</Text>
            <Text style={styles.completeBannerText}>
              Sem lições pendentes. Continue praticando livre no Lery físico.
            </Text>
          </View>
        )}

        {/* Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>Atividade recente</Text>
            <Pressable onPress={() => router.push('/(tabs)/results')}>
              <Text style={styles.sectionLink}>Ver tudo</Text>
            </Pressable>
          </View>

          {recentSessions.length > 0 ? (
            <View style={styles.activityList}>
              {recentSessions.map((item) => (
                <ActivityRow
                  key={item.lessonId}
                  title={item.lessonTitle}
                  subtitle={`${item.attempts} ${item.attempts === 1 ? 'tentativa' : 'tentativas'}`}
                  score={item.latestScore}
                  onPress={() => router.push(`/results/${item.lessonId}`)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyActivity}>
              <Text style={styles.emptyActivityText}>
                Nenhuma sessão ainda. Comece pelo dispositivo físico.
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 130,
  },
  animatedWrap: {
    gap: 18,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  greetingTexts: {
    flex: 1,
    gap: 2,
  },
  greetingLabel: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  greetingName: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
    alignItems: 'center',
  },
  levelBadgeLabel: {
    color: theme.colors.primaryDeep,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  levelBadgeValue: {
    color: theme.colors.primaryDeep,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sectionEyebrow: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionLink: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  activityList: {
    gap: 8,
  },
  completeBanner: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
    gap: 4,
  },
  completeBannerEmoji: {
    fontSize: 30,
  },
  completeBannerTitle: {
    color: theme.colors.primaryDeep,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  completeBannerText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyActivity: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyActivityText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: 'center',
  },
})
