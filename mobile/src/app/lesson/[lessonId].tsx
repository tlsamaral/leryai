import { Ionicons } from '@expo/vector-icons'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSessionStore } from '../../features/auth/store/session-store'
import { PromptEditorCard } from '../../features/lessons/components/prompt-editor-card'
import { useLessonDetailViewModel } from '../../features/lessons/viewmodels/use-lesson-detail-view-model'
import { LoadingState } from '../../shared/components/loading-state'
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
  const insets = useSafeAreaInsets()

  if (!isBootstrapped) return <ScreenContainer><LoadingState /></ScreenContainer>
  if (!isAuthenticated) return <Redirect href="/auth" />
  if (vm.isLoading || !vm.lesson) return <ScreenContainer><LoadingState /></ScreenContainer>

  const sv = statusVisual(vm.lesson.status)

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: 80 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Dark hero */}
      <View style={styles.hero}>
        <View style={[styles.heroGlow, { backgroundColor: sv.glow }]} />
        <View style={[styles.heroGlow2, { backgroundColor: sv.glow2 }]} />

        {/* Module + status row */}
        <View style={styles.heroTopRow}>
          <View style={styles.modulePill}>
            <Ionicons name="layers-outline" size={11} color={theme.colors.primary} />
            <Text style={styles.modulePillText} numberOfLines={1}>{vm.lesson.moduleName}</Text>
          </View>

          <View style={[styles.statusChip, { backgroundColor: sv.chipBg, borderColor: sv.chipBorder }]}>
            <Ionicons name={sv.icon} size={12} color={sv.color} />
            <Text style={[styles.statusChipText, { color: sv.color }]}>{sv.label}</Text>
          </View>
        </View>

        {/* Title + scenario */}
        <Text style={styles.heroTitle}>{vm.lesson.title}</Text>
        <Text style={styles.heroScenario}>{vm.lesson.scenario}</Text>

        {/* Metrics row */}
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
      </View>

      <View style={styles.body}>
        {/* Device reminder */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceIconWrap}>
            <Ionicons name="hardware-chip-outline" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.deviceTexts}>
            <Text style={styles.deviceTitle}>Praticar com Lery</Text>
            <Text style={styles.deviceSub}>
              Diga "Lery" no dispositivo físico para iniciar esta lição.
            </Text>
          </View>
        </View>

        {/* Prompt editor */}
        <PromptEditorCard
          value={vm.promptValue}
          isSaving={vm.isSaving}
          onChange={vm.setPromptValue}
          onSave={vm.savePrompt}
        />

        {/* Retry */}
        {vm.lesson.status !== 'LOCKED' ? (
          <Pressable
            style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
            onPress={vm.retryLesson}
            disabled={vm.isRetrying}
          >
            <Ionicons name="reload-outline" size={16} color={theme.colors.text} />
            <Text style={styles.retryText}>
              {vm.isRetrying ? 'Reiniciando...' : 'Reiniciar esta lição'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.bg },
  content: { gap: 14 },

  // Hero
  hero: {
    backgroundColor: '#040D12',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    overflow: 'hidden',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(4,210,255,0.08)',
  },
  heroGlow: {
    position: 'absolute', top: -90, right: -50,
    width: 220, height: 220, borderRadius: 999,
  },
  heroGlow2: {
    position: 'absolute', bottom: -80, left: -40,
    width: 180, height: 180, borderRadius: 999,
  },
  heroTopRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: 8,
  },
  modulePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, backgroundColor: 'rgba(4,210,255,0.10)',
    borderWidth: 1, borderColor: 'rgba(4,210,255,0.25)',
    maxWidth: '55%',
  },
  modulePillText: {
    color: theme.colors.primary, fontSize: 11, fontWeight: '700',
  },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1,
  },
  statusChipText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.2 },
  heroTitle: {
    color: '#F6FAFE', fontSize: 26, fontWeight: '800',
    letterSpacing: -0.6, lineHeight: 32,
  },
  heroScenario: {
    color: 'rgba(229,250,255,0.55)', fontSize: 14, lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12, marginTop: 4,
  },
  metricCard: { flex: 1, alignItems: 'center', gap: 3 },
  metricValue: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  metricLabel: {
    color: 'rgba(229,250,255,0.45)', fontSize: 10,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1, height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Body
  body: { paddingHorizontal: 16, gap: 12 },

  // Device card
  deviceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: `${theme.colors.primary}33`,
  },
  deviceIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  deviceTexts: { flex: 1, gap: 3 },
  deviceTitle: {
    color: theme.colors.primaryDeep, fontSize: 14, fontWeight: '800', letterSpacing: -0.2,
  },
  deviceSub: {
    color: theme.colors.primaryDeep, fontSize: 12, lineHeight: 17, opacity: 0.7,
  },

  // Retry
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 999, paddingVertical: 13,
    borderWidth: 1.5, borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  retryBtnPressed: { opacity: 0.75 },
  retryText: {
    color: theme.colors.muted, fontSize: 14, fontWeight: '700',
  },
})
