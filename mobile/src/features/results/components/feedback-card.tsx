import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'

interface FeedbackCardProps {
  lessonTitle: string
  score: number
  attempts: number
  lastSessionAt: string
  onPress: () => void
}

function scoreTone(score: number) {
  if (score >= 70) return { color: theme.colors.mint, bg: '#E7F8F0', border: '#B7E5CD', label: 'Forte', icon: 'checkmark-circle' as const }
  if (score >= 51) return { color: theme.colors.accent, bg: '#FFF6E5', border: '#FFD899', label: 'Médio', icon: 'time-outline' as const }
  return { color: theme.colors.danger, bg: '#FCE7E9', border: '#F4B5BB', label: 'Frágil', icon: 'alert-circle' as const }
}

function relativeDate(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `${days}d atrás`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function FeedbackCard({
  lessonTitle,
  score,
  attempts,
  lastSessionAt,
  onPress,
}: FeedbackCardProps) {
  const tone = scoreTone(score)

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.scoreCircle, { backgroundColor: tone.bg, borderColor: tone.border }]}>
        <Text style={[styles.scoreValue, { color: tone.color }]}>{score}</Text>
        <Text style={[styles.scoreUnit, { color: tone.color }]}>pts</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {lessonTitle}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="repeat" size={11} color={theme.colors.muted} />
            <Text style={styles.metaText}>
              {attempts} {attempts === 1 ? 'tent.' : 'tents.'}
            </Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={11} color={theme.colors.muted} />
            <Text style={styles.metaText}>{relativeDate(lastSessionAt)}</Text>
          </View>
        </View>

        <View style={[styles.tag, { backgroundColor: tone.bg, borderColor: tone.border }]}>
          <Ionicons name={tone.icon} size={10} color={tone.color} />
          <Text style={[styles.tagText, { color: tone.color }]}>{tone.label}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={theme.colors.dim} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    ...theme.shadow.soft,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 24,
  },
  scoreUnit: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  body: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: theme.colors.dim,
  },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
})
