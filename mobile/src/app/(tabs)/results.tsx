import { Ionicons } from '@expo/vector-icons'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FeedbackCard } from '../../features/results/components/feedback-card'
import { useResultsViewModel } from '../../features/results/viewmodels/use-results-view-model'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { ScreenContainer } from '../../shared/components/screen-container'
import { theme } from '../../shared/theme'

export default function ResultsTab() {
  const { items, isLoading, openDetail, refetch } = useResultsViewModel()
  const insets = useSafeAreaInsets()

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  const totalSessions = items.reduce((sum, i) => sum + i.attempts, 0)
  const avgScore =
    items.length > 0
      ? Math.round(
          items.reduce((sum, i) => sum + i.latestScore, 0) / items.length,
        )
      : 0
  const strongCount = items.filter((i) => i.latestScore >= 70).length

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => void refetch()}
          tintColor="#FFFFFF"
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* === DARK HERO === */}
      <View style={styles.darkHero}>
        <View style={styles.heroGlowTopRight} />
        <View style={styles.heroGlowBottomLeft} />

        {/* Safe area spacer */}
        <View style={{ height: insets.top + 8 }} />

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Histórico</Text>
          <Text style={styles.title}>Resultados</Text>
        </View>

        {/* Aggregate hero */}
        {items.length > 0 ? (
          <View style={styles.aggHero}>
            <View style={styles.aggMain}>
              <Text style={styles.aggLabel}>Pontuação média</Text>
              <View style={styles.aggValueRow}>
                <Text style={styles.aggValue}>{avgScore}</Text>
                <Text style={styles.aggUnit}>/100</Text>
              </View>
            </View>

            <View style={styles.aggDivider} />

            <View style={styles.aggSideCol}>
              <View style={styles.aggSideRow}>
                <Ionicons name="mic-outline" size={14} color="#04D2FF" />
                <Text style={styles.aggSideValue}>{totalSessions}</Text>
                <Text style={styles.aggSideLabel}>sessões</Text>
              </View>
              <View style={styles.aggSideRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={theme.colors.mint}
                />
                <Text style={styles.aggSideValue}>{strongCount}</Text>
                <Text style={styles.aggSideLabel}>fortes</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Bottom spacer for overlap */}
        <View style={styles.heroBottomSpacer} />
      </View>

      {/* === WHITE CONTENT CARD === */}
      <View style={styles.whiteCard}>
        {items.length === 0 ? (
          <EmptyState message="Sem resultados ainda. Sessões aparecem após você praticar no Lery físico." />
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <FeedbackCard
                key={item.lessonId}
                lessonTitle={item.lessonTitle}
                score={item.latestScore}
                attempts={item.attempts}
                lastSessionAt={item.lastSessionAt}
                onPress={() => openDetail(item.lessonId)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#040D12',
  },
  content: {
    paddingBottom: 0,
  },

  /* ── Dark hero ── */
  darkHero: {
    backgroundColor: '#040D12',
    paddingHorizontal: theme.spacing.md,
    overflow: 'hidden',
  },
  heroGlowTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(4, 210, 255, 0.12)',
  },
  heroGlowBottomLeft: {
    position: 'absolute',
    bottom: 20,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(4, 210, 255, 0.06)',
  },
  header: {
    gap: 4,
  },
  eyebrow: {
    color: '#04D2FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F6FAFE',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  aggHero: {
    flexDirection: 'row',
    backgroundColor: 'rgba(4, 210, 255, 0.08)',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.15)',
    alignItems: 'center',
    marginTop: 16,
  },
  aggMain: {
    flex: 1,
    gap: 4,
  },
  aggLabel: {
    color: 'rgba(229,250,255,0.65)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  aggValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  aggValue: {
    color: '#04D2FF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1.4,
    lineHeight: 48,
  },
  aggUnit: {
    color: 'rgba(229,250,255,0.55)',
    fontSize: 14,
    fontWeight: '700',
  },
  aggDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(229,250,255,0.10)',
    marginHorizontal: 16,
  },
  aggSideCol: {
    gap: 10,
    minWidth: 88,
  },
  aggSideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aggSideValue: {
    color: '#F6FAFE',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  aggSideLabel: {
    color: 'rgba(229,250,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  heroBottomSpacer: {
    height: 28,
  },

  /* ── White content card ── */
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    paddingTop: 24,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 130,
    minHeight: Dimensions.get('window').height,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  list: {
    gap: 10,
  },
})
