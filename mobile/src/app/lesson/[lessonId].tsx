import { Ionicons } from '@expo/vector-icons'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSessionStore } from '../../features/auth/store/session-store'
import { PromptEditorCard } from '../../features/lessons/components/prompt-editor-card'
import { useLessonDetailViewModel } from '../../features/lessons/viewmodels/use-lesson-detail-view-model'
import { AppCard } from '../../shared/components/app-card'
import { DarkHeroLayout } from '../../shared/components/dark-hero-layout'
import { LoadingState } from '../../shared/components/loading-state'
import { PrimaryButton } from '../../shared/components/primary-button'
import { ScreenContainer } from '../../shared/components/screen-container'
import { theme } from '../../shared/theme'
import type { LessonStatus } from '../../shared/types/domain'

// ─── status visual map ────────────────────────────────────────────────────────

function statusVisual(status: LessonStatus) {
  switch (status) {
    case 'IN_PROGRESS':
      return {
        label: 'Em andamento',
        icon: 'play-circle' as const,
        color: theme.colors.primary,
        glow: 'rgba(4,210,255,0.22)',
        glow2: 'rgba(4,210,255,0.10)',
        chipBg: 'rgba(4,210,255,0.14)',
        chipBorder: 'rgba(4,210,255,0.35)',
      }
    case 'COMPLETED':
      return {
        label: 'Concluída',
        icon: 'checkmark-circle' as const,
        color: theme.colors.mint,
        glow: 'rgba(43,196,138,0.18)',
        glow2: 'rgba(43,196,138,0.09)',
        chipBg: 'rgba(43,196,138,0.14)',
        chipBorder: 'rgba(43,196,138,0.35)',
      }
    case 'REVIEW_REQUIRED':
      return {
        label: 'Revisão necessária',
        icon: 'refresh-circle' as const,
        color: theme.colors.accent,
        glow: 'rgba(255,181,71,0.18)',
        glow2: 'rgba(255,181,71,0.09)',
        chipBg: 'rgba(255,181,71,0.14)',
        chipBorder: 'rgba(255,181,71,0.35)',
      }
    default:
      return {
        label: 'Bloqueada',
        icon: 'lock-closed' as const,
        color: theme.colors.dim,
        glow: 'rgba(146,162,171,0.12)',
        glow2: 'rgba(146,162,171,0.06)',
        chipBg: 'rgba(146,162,171,0.10)',
        chipBorder: 'rgba(146,162,171,0.25)',
      }
  }
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function LessonDetailPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>()
  const vm = useLessonDetailViewModel(lessonId)

  if (!isBootstrapped)
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  if (!isAuthenticated) return <Redirect href="/auth" />
  if (vm.isLoading || !vm.lesson)
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )

  const sv = statusVisual(vm.lesson.status)

  return (
    <DarkHeroLayout
      bottomPadding={40}
      hero={
        <>
          {/* Back button */}
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons
              name="arrow-back"
              size={20}
              color="rgba(229,250,255,0.8)"
            />
            <Text style={styles.backLabel}>Voltar</Text>
          </Pressable>

          <View style={[styles.heroGlow, { backgroundColor: sv.glow }]} />
          <View style={[styles.heroGlow2, { backgroundColor: sv.glow2 }]} />

          <View style={styles.heroTopRow}>
            <View style={styles.modulePill}>
              <Ionicons
                name="layers-outline"
                size={11}
                color={theme.colors.primary}
              />
              <Text style={styles.modulePillText} numberOfLines={1}>
                {vm.lesson.moduleName}
              </Text>
            </View>
            <View
              style={[
                styles.statusChip,
                { backgroundColor: sv.chipBg, borderColor: sv.chipBorder },
              ]}
            >
              <Ionicons name={sv.icon} size={12} color={sv.color} />
              <Text style={[styles.statusChipText, { color: sv.color }]}>
                {sv.label}
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{vm.lesson.title}</Text>
          <Text style={styles.heroScenario}>{vm.lesson.scenario}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: sv.color }]}>
                {vm.lesson.score > 0 ? vm.lesson.score : '—'}
              </Text>
              <Text style={styles.metricLabel}>Pontuação</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: sv.color }]}>
                {vm.lesson.attempts}
              </Text>
              <Text style={styles.metricLabel}>Tentativas</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, { color: sv.color }]}>70</Text>
              <Text style={styles.metricLabel}>Meta mínima</Text>
            </View>
          </View>
        </>
      }
    >
      {/* Device reminder */}
      <AppCard tone="default" padding={14} radius={18}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.deviceIconWrap}>
            <Ionicons
              name="hardware-chip-outline"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.deviceTexts}>
            <Text style={styles.deviceTitle}>Praticar com Lery</Text>
            <Text style={styles.deviceSub}>
              Diga "Hey Lery" no dispositivo físico para iniciar esta lição.
            </Text>
          </View>
        </View>
      </AppCard>

      <PromptEditorCard
        value={vm.promptValue}
        isSaving={vm.isSaving}
        onChange={vm.setPromptValue}
        onSave={vm.savePrompt}
      />

      {vm.lesson.status !== 'LOCKED' ? (
        <View style={{ marginTop: 4 }}>
          <PrimaryButton
            label={vm.isRetrying ? 'Reiniciando...' : 'Reiniciar esta lição'}
            onPress={vm.retryLesson}
            disabled={vm.isRetrying}
            loading={vm.isRetrying}
            tone="dark"
            icon="reload-outline"
          />
        </View>
      ) : null}
    </DarkHeroLayout>
  )
}

const styles = StyleSheet.create({
  // Back button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backLabel: {
    color: 'rgba(229,250,255,0.8)',
    fontFamily: theme.fonts.extraBold,
    fontSize: 15,
  },

  // Hero glows (positioned relative to the hero container provided by DarkHeroLayout)
  heroGlow: {
    position: 'absolute',
    top: -90,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 999,
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  modulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.25)',
    maxWidth: '55%',
  },
  modulePillText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 2,
  },
  statusChipText: {
    fontSize: 11,
    fontFamily: theme.fonts.black,
    letterSpacing: 0.2,
  },
  heroTitle: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    fontSize: 26,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  heroScenario: {
    color: 'rgba(229,250,255,0.55)',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12,
    marginTop: 4,
  },
  metricCard: { flex: 1, alignItems: 'center', gap: 3 },
  metricValue: {
    fontSize: 22,
    fontFamily: theme.fonts.black,
    letterSpacing: -0.5,
  },
  metricLabel: {
    color: 'rgba(229,250,255,0.45)',
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Body
  heroBottomSpacer: { height: 28 },

  // Device card style is handled by AppCard
  deviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  deviceTexts: { flex: 1, gap: 3 },
  deviceTitle: {
    color: theme.colors.primaryDeep,
    fontFamily: theme.fonts.black,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  deviceSub: {
    color: theme.colors.primaryDeep,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.75,
  },
})
