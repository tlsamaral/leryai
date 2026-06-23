import { Ionicons } from '@expo/vector-icons'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSessionStore } from '../../features/auth/store/session-store'
import { useResultDetailViewModel } from '../../features/results/viewmodels/use-result-detail-view-model'
import { getLeryApi } from '../../shared/api/provider'
import { AppCard } from '../../shared/components/app-card'
import { DarkHeroLayout } from '../../shared/components/dark-hero-layout'
import { EmptyState } from '../../shared/components/empty-state'
import { LoadingState } from '../../shared/components/loading-state'
import { PrimaryButton } from '../../shared/components/primary-button'
import { ScoreBar } from '../../shared/components/score-bar'
import { ScreenContainer } from '../../shared/components/screen-container'
import { theme } from '../../shared/theme'
import type { InteractionLog } from '../../shared/types/domain'

// ─── helpers ─────────────────────────────────────────────────────────────────

function scoreTone(score: number) {
  if (score >= 70)
    return { color: theme.colors.mint, bg: '#E7F8F0', label: 'Forte' }
  if (score >= 51)
    return { color: theme.colors.accent, bg: '#FFF6E5', label: 'Médio' }
  return { color: theme.colors.danger, bg: '#FCE7E9', label: 'Frágil' }
}

function has4Pillars(log: InteractionLog) {
  return (
    log.taskAchievement !== null ||
    log.grammar !== null ||
    log.vocabulary !== null ||
    log.fluency !== null
  )
}

// ─── dispute modal ────────────────────────────────────────────────────────────

function DisputeModal({
  logId,
  visible,
  onClose,
}: {
  logId: string
  visible: boolean
  onClose: () => void
}) {
  const [reason, setReason] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!reason.trim()) return
    setLoading(true)
    try {
      await getLeryApi().disputeLog(logId, reason.trim())
    } catch {
      /* mock returns OK */
    }
    setSent(true)
    setLoading(false)
  }

  function close() {
    setReason('')
    setSent(false)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={close}
    >
      <Pressable style={ms.overlay} onPress={close}>
        <Pressable style={ms.sheet} onPress={() => {}}>
          {sent ? (
            <View style={ms.sentWrap}>
              <View style={ms.sentIcon}>
                <Ionicons
                  name="checkmark-circle"
                  size={40}
                  color={theme.colors.mint}
                />
              </View>
              <Text style={ms.sentTitle}>Disputa enviada</Text>
              <Text style={ms.sentSub}>
                Lery vai revisar e ajustar se necessário.
              </Text>
              <View style={{ width: '100%', marginTop: 8 }}>
                <PrimaryButton label="Fechar" onPress={close} tone="cyan" />
              </View>
            </View>
          ) : (
            <View style={ms.form}>
              <View style={ms.handle} />
              <Text style={ms.title}>Discordar desta correção</Text>
              <Text style={ms.sub}>
                Explique por que a avaliação está incorreta.
              </Text>
              <TextInput
                style={ms.input}
                placeholder="Ex: O áudio foi cortado e eu disse corretamente..."
                placeholderTextColor={theme.colors.dim}
                multiline
                numberOfLines={4}
                value={reason}
                onChangeText={setReason}
                textAlignVertical="top"
              />
              <View style={{ marginTop: 4 }}>
                <PrimaryButton
                  label={loading ? 'Enviando...' : 'Enviar disputa'}
                  onPress={() => void submit()}
                  disabled={!reason.trim() || loading}
                  loading={loading}
                  tone="cyan"
                  icon={loading ? undefined : 'send'}
                />
              </View>
              <Pressable style={ms.cancel} onPress={close}>
                <Text style={ms.cancelText}>Cancelar</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,27,35,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  form: { padding: 22, gap: 12 },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  sub: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
  },
  input: {
    minHeight: 110,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
    padding: 12,
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    marginBottom: 4,
  },
  cancel: { alignSelf: 'center', paddingVertical: 6, marginTop: 4 },
  cancelText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
  },
  sentWrap: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  sentIcon: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#E7F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.mint,
  },
  sentTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  sentSub: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.85,
  },
})

// ─── log card ─────────────────────────────────────────────────────────────────

function LogCard({ log, index }: { log: InteractionLog; index: number }) {
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [pillarsOpen, setPillarsOpen] = useState(false)
  const pillars = has4Pillars(log)

  const fade = useRef(new Animated.Value(0)).current
  const slide = useRef(new Animated.Value(8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 340,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 360,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fade, slide, index])

  return (
    <Animated.View
      style={[lc.wrap, { opacity: fade, transform: [{ translateY: slide }] }]}
    >
      {/* User utterance */}
      {log.userAudioTrans ? (
        <View style={lc.row}>
          <View style={lc.spacer} />
          <View style={lc.userBubble}>
            <Text style={lc.userText}>{log.userAudioTrans}</Text>
          </View>
        </View>
      ) : null}

      {/* Lery response */}
      {log.leryResponse ? (
        <View style={lc.row}>
          <View style={lc.leryAvatar}>
            <Ionicons
              name="radio-outline"
              size={12}
              color={theme.colors.primary}
            />
          </View>
          <View style={lc.leryBubble}>
            <Text style={lc.leryText}>{log.leryResponse}</Text>
          </View>
        </View>
      ) : null}

      {/* Grammatical fix */}
      {log.grammaticalFixes ? (
        <View style={lc.fixRow}>
          <Ionicons
            name="sparkles-outline"
            size={13}
            color={theme.colors.accent}
          />
          <Text style={lc.fixText}>{log.grammaticalFixes}</Text>
        </View>
      ) : null}

      {/* 4-pillar section */}
      {pillars ? (
        <AppCard tone="default" padding={0} radius={16}>
          <Pressable
            style={lc.pillarsHeader}
            onPress={() => setPillarsOpen((v) => !v)}
          >
            <Text style={lc.pillarsTitle}>Avaliação detalhada</Text>
            {log.totalScore !== null ? (
              <View
                style={[
                  lc.totalBadge,
                  {
                    backgroundColor: `${scoreTone(log.totalScore).color}20`,
                    borderWidth: 1.5,
                    borderColor: scoreTone(log.totalScore).color,
                  },
                ]}
              >
                <Text
                  style={[
                    lc.totalBadgeText,
                    { color: scoreTone(log.totalScore).color },
                  ]}
                >
                  {log.totalScore}pts
                </Text>
              </View>
            ) : null}
            <Ionicons
              name={pillarsOpen ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={theme.colors.muted}
            />
          </Pressable>

          {pillarsOpen ? (
            <View style={lc.pillarsBars}>
              <ScoreBar
                label="Comunicação"
                value={log.taskAchievement ?? 0}
                max={25}
              />
              <ScoreBar label="Gramática" value={log.grammar ?? 0} max={25} />
              <ScoreBar
                label="Vocabulário"
                value={log.vocabulary ?? 0}
                max={25}
              />
              <ScoreBar label="Fluência" value={log.fluency ?? 0} max={25} />

              {log.evaluationReasoning ? (
                <View style={lc.reasoning}>
                  <Ionicons
                    name="bulb-outline"
                    size={12}
                    color={theme.colors.primaryDeep}
                  />
                  <Text style={lc.reasoningText}>
                    {log.evaluationReasoning}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </AppCard>
      ) : null}

      {/* Dispute */}
      {!log.isDisputed && pillars ? (
        <Pressable
          style={({ pressed }) => [lc.disputeBtn, pressed && { opacity: 0.7 }]}
          onPress={() => setDisputeOpen(true)}
        >
          <Ionicons
            name="alert-circle-outline"
            size={13}
            color={theme.colors.warning}
          />
          <Text style={lc.disputeText}>Discordar desta correção</Text>
        </Pressable>
      ) : null}

      {log.isDisputed ? (
        <View style={lc.disputedChip}>
          <Ionicons
            name="time-outline"
            size={12}
            color={theme.colors.warning}
          />
          <Text style={lc.disputedText}>
            Disputa{' '}
            {log.disputeStatus === 'PENDING'
              ? 'em análise'
              : (log.disputeStatus ?? '').toLowerCase()}
          </Text>
        </View>
      ) : null}

      <DisputeModal
        logId={log.id}
        visible={disputeOpen}
        onClose={() => setDisputeOpen(false)}
      />
    </Animated.View>
  )
}

const lc = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  spacer: { flex: 1 },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '78%',
    borderWidth: 2,
    borderColor: '#000000',
  },
  userText: {
    color: '#040D12',
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  leryAvatar: {
    width: 26,
    height: 26,
    borderRadius: 999,
    flexShrink: 0,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leryBubble: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  leryText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  fixRow: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start',
    backgroundColor: `${theme.colors.accent}14`,
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: `${theme.colors.accent}33`,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  fixText: {
    flex: 1,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    opacity: 0.95,
  },
  pillarsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pillarsTitle: {
    flex: 1,
    color: theme.colors.text,
    fontFamily: theme.fonts.extraBold,
    fontSize: 13,
  },
  totalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  totalBadgeText: { fontSize: 12, fontFamily: theme.fonts.black },
  pillarsBars: {
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  reasoning: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start',
    marginTop: 4,
    backgroundColor: `${theme.colors.primary}08`,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: `${theme.colors.primary}22`,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  reasoningText: {
    flex: 1,
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.9,
  },
  disputeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.warning,
    backgroundColor: `${theme.colors.warning}0C`,
  },
  disputeText: {
    color: theme.colors.warning,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },
  disputedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: `${theme.colors.warning}55`,
    backgroundColor: `${theme.colors.warning}12`,
  },
  disputedText: {
    color: theme.colors.warning,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },
})

// ─── main screen ──────────────────────────────────────────────────────────────

export default function ResultDetailPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>()
  const { data, isLoading } = useResultDetailViewModel(lessonId)
  const insets = useSafeAreaInsets()
  const [activeAttempt, setActiveAttempt] = useState(0)

  if (!isBootstrapped || isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!isAuthenticated) return <Redirect href="/auth" />

  if (!data) {
    return (
      <ScreenContainer>
        <EmptyState message="Não foi possível carregar o resultado." />
      </ScreenContainer>
    )
  }

  const attempt = data.attempts[activeAttempt]
  if (!attempt) return null

  const tone = scoreTone(attempt.score)
  const bestScore = Math.max(...data.attempts.map((a) => a.score))

  return (
    <DarkHeroLayout
      bottomPadding={40}
      hero={
        <>
          <View style={pg.heroTopBar}>
            <Pressable onPress={() => router.back()} style={pg.backBtn}>
              <Ionicons
                name="arrow-back"
                size={20}
                color="rgba(229,250,255,0.8)"
              />
              <Text style={pg.backLabel}>Voltar</Text>
            </Pressable>
          </View>

          <View style={pg.heroGlow} />
          <View style={pg.heroGlow2} />

          <Text style={pg.heroEyebrow}>Resultado da lição</Text>
          <Text style={pg.heroTitle} numberOfLines={2}>
            {data.lessonTitle}
          </Text>

          <View style={pg.heroScoreRow}>
            <View
              style={[
                pg.scoreCircle,
                { borderColor: tone.color, backgroundColor: `${tone.color}18` },
              ]}
            >
              <Text style={[pg.scoreValue, { color: tone.color }]}>
                {attempt.score}
              </Text>
              <Text style={[pg.scoreUnit, { color: tone.color }]}>pts</Text>
            </View>

            <View style={pg.heroMeta}>
              <View
                style={[
                  pg.toneBadge,
                  {
                    backgroundColor: `${tone.color}22`,
                    borderWidth: 1.5,
                    borderColor: tone.color,
                  },
                ]}
              >
                <Text style={[pg.toneBadgeText, { color: tone.color }]}>
                  {tone.label}
                </Text>
              </View>
              <Text style={pg.heroMetaText}>
                Melhor:{' '}
                <Text
                  style={{ color: '#04D2FF', fontFamily: theme.fonts.black }}
                >
                  {bestScore}pts
                </Text>
              </Text>
              <Text style={pg.heroMetaText}>
                {data.attempts.length}{' '}
                {data.attempts.length === 1 ? 'tentativa' : 'tentativas'}
              </Text>
            </View>
          </View>

          {attempt.feedbackSummary ? (
            <View style={pg.feedbackRow}>
              <Ionicons
                name="chatbubble-outline"
                size={13}
                color="rgba(229,250,255,0.6)"
              />
              <Text style={pg.feedbackText}>{attempt.feedbackSummary}</Text>
            </View>
          ) : null}
        </>
      }
    >
      {/* Attempt selector */}
      {data.attempts.length > 1 ? (
        <View style={pg.attemptRow}>
          {data.attempts.map((a, i) => {
            const t = scoreTone(a.score)
            return (
              <Pressable
                key={a.session.id}
                style={[
                  pg.attemptChip,
                  activeAttempt === i && pg.attemptChipActive,
                ]}
                onPress={() => setActiveAttempt(i)}
              >
                <View style={[pg.attemptDot, { backgroundColor: t.color }]} />
                <Text
                  style={[
                    pg.attemptChipText,
                    activeAttempt === i && pg.attemptChipTextActive,
                  ]}
                >
                  Tent. {i + 1} · {a.score}pts
                </Text>
              </Pressable>
            )
          })}
        </View>
      ) : null}

      {/* Logs */}
      <View style={pg.logsSection}>
        <Text style={pg.logsSectionTitle}>Transcrição da sessão</Text>
        <View style={pg.logsWrap}>
          {attempt.logs.map((log, i) => (
            <LogCard key={log.id} log={log} index={i} />
          ))}
        </View>
      </View>
    </DarkHeroLayout>
  )
}

const pg = StyleSheet.create({
  heroTopBar: { marginBottom: 12 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backLabel: {
    color: 'rgba(229,250,255,0.8)',
    fontFamily: theme.fonts.extraBold,
    fontSize: 15,
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.14)',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.07)',
  },
  heroEyebrow: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.black,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    fontSize: 26,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  heroScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  scoreCircle: {
    width: 84,
    height: 84,
    borderRadius: 999,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
  },
  scoreValue: {
    fontSize: 30,
    fontFamily: theme.fonts.black,
    letterSpacing: -1,
    lineHeight: 32,
  },
  scoreUnit: {
    fontSize: 10,
    fontFamily: theme.fonts.black,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroMeta: { flex: 1, gap: 6 },
  toneBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  toneBadgeText: {
    fontSize: 11,
    fontFamily: theme.fonts.black,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroMetaText: {
    color: 'rgba(229,250,255,0.6)',
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    opacity: 0.95,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(229,250,255,0.05)',
    borderRadius: 12,
    padding: 10,
    marginTop: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(229,250,255,0.08)',
  },
  feedbackText: {
    flex: 1,
    color: 'rgba(229,250,255,0.7)',
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.9,
  },
  attemptRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  attemptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  attemptChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  attemptDot: { width: 7, height: 7, borderRadius: 999 },
  attemptChipText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    opacity: 0.95,
  },
  attemptChipTextActive: { color: theme.colors.primaryDeep },
  logsSection: { gap: 12 },
  logsSectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  logsWrap: { gap: 20 },
})
