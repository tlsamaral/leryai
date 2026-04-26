import { Ionicons } from '@expo/vector-icons'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ModuleOverviewCard } from '../../features/home/components/module-overview-card'
import { useHomeViewModel } from '../../features/home/viewmodels/use-home-view-model'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { theme } from '../../shared/theme'

export default function JourneyTab() {
  const { map, isLoading, openLesson, refetch } = useHomeViewModel()
  const insets = useSafeAreaInsets()

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!map) {
    return (
      <ScreenContainer>
        <EmptyState message="Nenhum módulo disponível." />
      </ScreenContainer>
    )
  }

  const allLessons = map.modules.flatMap((m) => m.lessons)
  const totalCompleted = allLessons.filter((l) => l.status === 'COMPLETED').length
  const totalLessons = allLessons.length
  const overallPct = totalLessons === 0 ? 0 : Math.round((totalCompleted / totalLessons) * 100)

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => void refetch()}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Trilha de aprendizado</Text>
        <Text style={styles.title}>Módulos</Text>
      </View>

      {/* Overall hero */}
      <View style={styles.overallHero}>
        <View style={styles.overallGlow} />

        <View style={styles.overallTopRow}>
          <View style={styles.levelChip}>
            <Ionicons name="school-outline" size={12} color="#04D2FF" />
            <Text style={styles.levelChipText}>{map.level}</Text>
          </View>
          <Text style={styles.overallPctText}>{overallPct}%</Text>
        </View>

        <Text style={styles.overallTitle}>
          {totalCompleted} de {totalLessons} lições
        </Text>
        <Text style={styles.overallSubtitle}>
          Cada lição precisa de 70+ pontos para liberar a próxima
        </Text>

        <View style={styles.overallTrack}>
          <View style={[styles.overallFill, { width: `${overallPct}%` }]} />
        </View>
      </View>

      {/* Modules list */}
      <View style={styles.modulesList}>
        {map.modules.map((module) => (
          <ModuleOverviewCard
            key={module.id}
            order={module.order}
            name={module.name}
            description={module.description}
            lessons={module.lessons}
            onPressLesson={openLesson}
          />
        ))}
      </View>
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
    gap: 16,
  },
  header: {
    gap: 4,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  overallHero: {
    backgroundColor: '#040D12',
    borderRadius: 26,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.18)',
    shadowColor: '#04D2FF',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    gap: 6,
  },
  overallGlow: {
    position: 'absolute',
    top: -90,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.18)',
  },
  overallTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.30)',
  },
  levelChipText: {
    color: '#04D2FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  overallPctText: {
    color: '#04D2FF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  overallTitle: {
    color: '#F6FAFE',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  overallSubtitle: {
    color: 'rgba(229,250,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  overallTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(229,250,255,0.10)',
    overflow: 'hidden',
    marginTop: 10,
  },
  overallFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#04D2FF',
  },
  modulesList: {
    gap: 12,
  },
})
