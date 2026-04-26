/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: <explanation> */
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getLeryApi } from '../shared/api/provider'
import { WaveformBars } from '../shared/components/waveform-bars'
import { theme } from '../shared/theme'

// ─── types ──────────────────────────────────────────────────────────────────

type RecordState = 'idle' | 'recording' | 'processing' | 'review'

interface StepDef {
  id: string
  question: string
  label: string
  mockAnswer: string
}

// ─── step config ─────────────────────────────────────────────────────────────

const STEPS: StepDef[] = [
  {
    id: 'occupation',
    question:
      'Oi! Eu sou o Lery, seu tutor de inglês 👋\n\nO que você faz da vida? Me conta sua profissão ou área de estudo.',
    label: 'Fale sua profissão',
    mockAnswer: 'Sou Engenheiro de Software',
  },
  {
    id: 'age_group',
    question: 'Legal! E qual é a sua faixa etária?',
    label: 'Fale sua idade ou faixa',
    mockAnswer: 'Tenho 23 anos, sou adulto',
  },
  {
    id: 'interests',
    question: 'Quais assuntos te interessam? Pode citar vários, à vontade!',
    label: 'Fale seus interesses',
    mockAnswer: 'Gosto de tecnologia, música e futebol',
  },
  {
    id: 'hobbies',
    question: 'No seu tempo livre, o que você gosta de fazer?',
    label: 'Fale seus hobbies',
    mockAnswer:
      'Gosto muito de programar, assistir jogos e de vez em quando jogar Fortnite',
  },
  {
    id: 'learning_goal',
    question:
      'Última pergunta, prometo! Qual é o seu principal objetivo com o inglês?',
    label: 'Fale seu objetivo',
    mockAnswer: 'Quero usar melhor no trabalho e conseguir me virar viajando',
  },
]

// ─── expanding rings ─────────────────────────────────────────────────────────

function ExpandingRings({
  active,
  size,
  color,
}: {
  active: boolean
  size: number
  color: string
}) {
  const anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  useEffect(() => {
    if (!active) {
      anims.forEach((a) => a.setValue(0))
      return
    }

    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 520),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1700,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    )

    animations.forEach((a) => a.start())
    return () => {
      animations.forEach((a) => a.stop())
      anims.forEach((a) => a.setValue(0))
    }
  }, [active, anims])

  return (
    <>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: color,
            opacity: anim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0.7, 0],
            }),
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.5],
                }),
              },
            ],
          }}
        />
      ))}
    </>
  )
}

// ─── processing dots ─────────────────────────────────────────────────────────

function ProcessingDots() {
  const anims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(anim, {
            toValue: 1,
            duration: 360,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 360,
            useNativeDriver: true,
          }),
          Animated.delay(360),
        ]),
      ),
    )
    animations.forEach((a) => a.start())
    return () => animations.forEach((a) => a.stop())
  }, [anims])

  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.colors.primary,
            opacity: anim,
          }}
        />
      ))}
    </View>
  )
}

// ─── record button ────────────────────────────────────────────────────────────

const BUTTON_SIZE = 148

interface RecordButtonProps {
  state: RecordState
  onStart: () => void
  onStop: () => void
  timer: number
}

function RecordButton({ state, onStart, onStop, timer }: RecordButtonProps) {
  const scale = useRef(new Animated.Value(1)).current
  const idleGlow = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (state !== 'idle') {
      idleGlow.setValue(1)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleGlow, {
          toValue: 1.07,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(idleGlow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [state, idleGlow])

  const isRecording = state === 'recording'
  const ringColor = isRecording ? theme.colors.danger : theme.colors.primary
  const bgColor = isRecording ? 'rgba(230,57,70,0.14)' : 'rgba(4,210,255,0.10)'

  return (
    <View style={rb.wrap}>
      {/* Expanding rings when recording */}
      <ExpandingRings
        active={isRecording}
        size={BUTTON_SIZE}
        color={theme.colors.danger}
      />

      {/* Idle glow ring */}
      {state === 'idle' && (
        <Animated.View
          style={[rb.glowRing, { transform: [{ scale: idleGlow }] }]}
        />
      )}

      {/* Main button */}
      <Pressable
        onPressIn={() => {
          Animated.spring(scale, {
            toValue: 0.91,
            useNativeDriver: true,
            damping: 12,
            stiffness: 300,
          }).start()
          onStart()
        }}
        onPressOut={() => {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            damping: 14,
            stiffness: 260,
          }).start()
          if (isRecording) onStop()
        }}
        disabled={state === 'processing' || state === 'review'}
      >
        <Animated.View
          style={[
            rb.btn,
            {
              backgroundColor: bgColor,
              borderColor: ringColor,
              transform: [{ scale }],
            },
          ]}
        >
          {state === 'idle' && (
            <Ionicons name="mic" size={52} color={theme.colors.primary} />
          )}
          {state === 'recording' && (
            <WaveformBars
              active
              bars={5}
              height={40}
              color={theme.colors.danger}
            />
          )}
          {state === 'processing' && <ProcessingDots />}
          {state === 'review' && (
            <Ionicons
              name="checkmark-circle"
              size={54}
              color={theme.colors.mint}
            />
          )}
        </Animated.View>
      </Pressable>

      {/* Timer */}
      {state === 'recording' && (
        <Text style={rb.timer}>{`0:${String(timer).padStart(2, '0')}`}</Text>
      )}
    </View>
  )
}

const rb = StyleSheet.create({
  wrap: {
    width: BUTTON_SIZE + 120,
    height: BUTTON_SIZE + 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: BUTTON_SIZE + 40,
    height: BUTTON_SIZE + 40,
    borderRadius: (BUTTON_SIZE + 40) / 2,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
  },
  btn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  timer: {
    position: 'absolute',
    bottom: 12,
    color: theme.colors.danger,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
})

// ─── confirm screen ───────────────────────────────────────────────────────────

function ConfirmScreen({
  answers,
  onSave,
  saving,
  onRedo,
}: {
  answers: string[]
  onSave: () => void
  saving: boolean
  onRedo: () => void
}) {
  const insets = useSafeAreaInsets()
  const fade = useRef(new Animated.Value(0)).current
  const slide = useRef(new Animated.Value(16)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 420,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fade, slide])

  const pairs = STEPS.map((s, i) => ({ label: s.id, answer: answers[i] ?? '' }))
  const labels: Record<string, string> = {
    occupation: 'Profissão',
    age_group: 'Faixa etária',
    interests: 'Interesses',
    hobbies: 'Hobbies',
    learning_goal: 'Objetivo',
  }

  return (
    <View
      style={[
        cs.root,
        { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) },
      ]}
    >
      <Animated.View
        style={[
          cs.content,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <View style={cs.leryRow}>
          <View style={cs.leryIcon}>
            <Ionicons
              name="radio-outline"
              size={16}
              color={theme.colors.primary}
            />
          </View>
          <Text style={cs.leryText}>
            Entendi tudo! Deixa eu confirmar o que captei sobre você:
          </Text>
        </View>

        <View style={cs.summaryCard}>
          {pairs.map(({ label, answer }) => (
            <View key={label} style={cs.summaryRow}>
              <Text style={cs.summaryLabel}>{labels[label] ?? label}</Text>
              <Text style={cs.summaryAnswer} numberOfLines={2}>
                {answer}
              </Text>
            </View>
          ))}
        </View>

        <View style={cs.actions}>
          <Pressable
            style={({ pressed }) => [
              cs.saveBtn,
              saving && cs.saveBtnDisabled,
              pressed && cs.saveBtnPressed,
            ]}
            onPress={onSave}
            disabled={saving}
          >
            <Ionicons
              name={saving ? 'hourglass-outline' : 'rocket-outline'}
              size={18}
              color="#040D12"
            />
            <Text style={cs.saveBtnText}>
              {saving ? 'Salvando...' : 'Está certo! Vamos começar'}
            </Text>
          </Pressable>

          <Pressable style={cs.redoLink} onPress={onRedo}>
            <Text style={cs.redoLinkText}>Refazer respostas</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  )
}

const cs = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#040D12',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    gap: 20,
  },
  leryRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  leryIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  leryText: {
    flex: 1,
    color: 'rgba(229,250,255,0.85)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: 'rgba(4,210,255,0.06)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.18)',
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(4,210,255,0.08)',
  },
  summaryLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    width: 80,
    paddingTop: 2,
  },
  summaryAnswer: {
    flex: 1,
    color: '#F6FAFE',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  saveBtnText: {
    color: '#040D12',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  redoLink: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
  redoLinkText: {
    color: 'rgba(229,250,255,0.45)',
    fontSize: 13,
    fontWeight: '600',
  },
})

// ─── main screen ──────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets()

  const [currentStep, setCurrentStep] = useState(0)
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timer, setTimer] = useState(0)
  const [saving, setSaving] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const questionFade = useRef(new Animated.Value(0)).current
  const questionSlide = useRef(new Animated.Value(12)).current
  const reviewFade = useRef(new Animated.Value(0)).current
  const reviewSlide = useRef(new Animated.Value(24)).current

  // Animate question in on step change
  useEffect(() => {
    questionFade.setValue(0)
    questionSlide.setValue(12)
    Animated.parallel([
      Animated.timing(questionFade, {
        toValue: 1,
        duration: 380,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(questionSlide, {
        toValue: 0,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }, [questionFade, questionSlide])

  // Animate review panel in
  useEffect(() => {
    if (recordState !== 'review') return
    reviewFade.setValue(0)
    reviewSlide.setValue(24)
    Animated.parallel([
      Animated.timing(reviewFade, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(reviewSlide, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start()
  }, [recordState, reviewFade, reviewSlide])

  function startRecording() {
    if (recordState !== 'idle') return
    setRecordState('recording')
    setTimer(0)
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
  }

  function stopRecording() {
    if (recordState !== 'recording') return

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setRecordState('processing')

    setTimeout(() => {
      const mock = STEPS[currentStep]?.mockAnswer ?? ''
      setCurrentAnswer(mock)
      setRecordState('review')
    }, 1200)
  }

  function confirmAnswer() {
    const next = [...answers, currentAnswer]
    setAnswers(next)
    setCurrentAnswer('')
    setTimer(0)

    if (currentStep < STEPS.length - 1) {
      setRecordState('idle')
      setCurrentStep((s) => s + 1)
    } else {
      setCurrentStep(STEPS.length)
    }
  }

  function redoAnswer() {
    setRecordState('idle')
    setCurrentAnswer('')
    setTimer(0)
  }

  function resetAll() {
    setAnswers([])
    setCurrentAnswer('')
    setTimer(0)
    setCurrentStep(0)
    setRecordState('idle')
  }

  async function handleSave() {
    setSaving(true)
    try {
      await getLeryApi().upsertProfile({
        nativeLanguage: 'pt-BR',
        occupation: answers[0] ?? '',
        ageGroup: 'adult',
        interests: ['tecnologia', 'música', 'viagens'],
        hobbies: ['leitura', 'programação'],
        learningGoal: 'travel',
      })
      router.replace('/(tabs)/home')
    } catch {
      setSaving(false)
    }
  }

  // Confirm screen
  if (currentStep >= STEPS.length) {
    return (
      <ConfirmScreen
        answers={answers}
        onSave={() => void handleSave()}
        saving={saving}
        onRedo={resetAll}
      />
    )
  }

  const step = STEPS[currentStep]

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Progress dots */}
      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < currentStep && styles.dotDone,
              i === currentStep && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Question bubble */}
      <Animated.View
        style={[
          styles.questionWrap,
          { opacity: questionFade, transform: [{ translateY: questionSlide }] },
        ]}
      >
        <View style={styles.leryAvatar}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.leryAvatarImage}
          />
        </View>
        <View style={styles.questionBubble}>
          <Text style={styles.questionText}>{step.question}</Text>
        </View>
      </Animated.View>

      {/* Record zone */}
      <View style={styles.recordZone}>
        <RecordButton
          state={recordState}
          onStart={startRecording}
          onStop={stopRecording}
          timer={timer}
        />

        <Text
          style={[
            styles.recordLabel,
            recordState === 'recording' && styles.recordLabelActive,
            recordState === 'processing' && styles.recordLabelProcessing,
          ]}
        >
          {recordState === 'idle' && `↑ Segure o botão · ${step.label}`}
          {recordState === 'recording' && 'Gravando... solte para parar'}
          {recordState === 'processing' && 'Processando sua resposta...'}
          {recordState === 'review' && 'Ouvi isso:'}
        </Text>
      </View>

      {/* Review panel */}
      {recordState === 'review' && (
        <Animated.View
          style={[
            styles.reviewPanel,
            {
              opacity: reviewFade,
              transform: [{ translateY: reviewSlide }],
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          <View style={styles.responseBubble}>
            <Ionicons name="mic" size={12} color="rgba(4,210,255,0.7)" />
            <Text style={styles.responseText}>{currentAnswer}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [
                styles.redoBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={redoAnswer}
            >
              <Ionicons
                name="mic-outline"
                size={15}
                color={theme.colors.primary}
              />
              <Text style={styles.redoBtnText}>Gravar de novo</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.confirmBtn,
                pressed && styles.confirmBtnPressed,
              ]}
              onPress={confirmAnswer}
            >
              <Text style={styles.confirmBtnText}>
                {currentStep < STEPS.length - 1 ? 'Próximo' : 'Finalizar'}
              </Text>
              <Ionicons
                name={
                  currentStep < STEPS.length - 1 ? 'arrow-forward' : 'checkmark'
                }
                size={15}
                color="#040D12"
              />
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Bottom step hint */}
      {recordState === 'idle' && (
        <View
          style={[
            styles.bottomHint,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Text style={styles.bottomHintText}>
            {currentStep + 1} de {STEPS.length}
          </Text>
        </View>
      )}
    </View>
  )
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#040D12',
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.15)',
  },
  dotDone: {
    backgroundColor: `${theme.colors.primary}77`,
    width: 6,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  questionWrap: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    marginTop: 8,
  },
  leryAvatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  leryAvatarImage: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },
  questionBubble: {
    flex: 1,
    backgroundColor: '#F6FAFE',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  questionText: {
    color: '#0A1B23',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  recordZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recordLabel: {
    color: 'rgba(229,250,255,0.45)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  recordLabelActive: {
    color: theme.colors.danger,
  },
  recordLabelProcessing: {
    color: theme.colors.primary,
  },
  reviewPanel: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(4,210,255,0.10)',
    backgroundColor: 'rgba(4,210,255,0.03)',
  },
  responseBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  responseText: {
    color: '#040D12',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  redoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(4,210,255,0.35)',
    paddingVertical: 13,
  },
  redoBtnText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    paddingVertical: 13,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  confirmBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  confirmBtnText: {
    color: '#040D12',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  bottomHint: {
    paddingVertical: 12,
  },
  bottomHintText: {
    color: 'rgba(229,250,255,0.3)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})
