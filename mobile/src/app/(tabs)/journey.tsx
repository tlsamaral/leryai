import { StyleSheet, Text, View } from 'react-native'
import { ModuleOverviewCard } from '../../features/home/components/module-overview-card'
import { useHomeViewModel } from '../../features/home/viewmodels/use-home-view-model'
import { CandyBadge } from '../../shared/components/candy-badge'
import { DarkHeroLayout } from '../../shared/components/dark-hero-layout'
import { theme } from '../../shared/theme'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'

export default function JourneyTab() {
  const { map, isLoading, openLesson, refetch } = useHomeViewModel()

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
  const totalCompleted = allLessons.filter(
    (l) => l.status === 'COMPLETED',
  ).length
  const totalLessons = allLessons.length
  const overallPct =
    totalLessons === 0 ? 0 : Math.round((totalCompleted / totalLessons) * 100)

  return (
    <DarkHeroLayout
      onRefresh={() => void refetch()}
      hero={
        <>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Trilha de aprendizado</Text>
            <Text style={styles.title}>Módulos</Text>
          </View>

          <View style={styles.overallHero}>
            <View style={styles.overallTopRow}>
              <CandyBadge
                tone="dark"
                label={`Nível ${map.level}`}
                icon="school"
                size="default"
              />
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
        </>
      }
    >
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
    </DarkHeroLayout>
  )
}

const styles = StyleSheet.create({
  header: { gap: 4 },
  eyebrow: {
    color: '#04D2FF',
    fontFamily: theme.fonts.black,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    fontSize: 26,
    letterSpacing: -0.6,
  },

  overallHero: {
    backgroundColor: 'rgba(4,210,255,0.08)',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.15)',
    gap: 6,
    marginTop: 16,
  },
  overallTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overallPctText: {
    color: '#04D2FF',
    fontFamily: theme.fonts.black,
    fontSize: 26,
    letterSpacing: -0.6,
  },
  overallTitle: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.extraBold,
    fontSize: 20,
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

  modulesList: { gap: 12 },
})
