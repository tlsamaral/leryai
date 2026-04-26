import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

interface ActivityRowProps {
  title: string
  subtitle: string
  score: number
  onPress?: () => void
}

function scoreTone(score: number) {
  if (score >= 70) return { color: theme.colors.mint, bg: '#E7F8F0', label: 'Forte' }
  if (score >= 51) return { color: theme.colors.accent, bg: '#FFF6E5', label: 'Médio' }
  return { color: theme.colors.danger, bg: '#FCE7E9', label: 'Frágil' }
}

export function ActivityRow({ title, subtitle, score, onPress }: ActivityRowProps) {
  const tone = scoreTone(score)
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shell, pressed && styles.pressed]}>
      <View style={[styles.scoreCircle, { backgroundColor: tone.bg, borderColor: `${tone.color}55` }]}>
        <Text style={[styles.scoreText, { color: tone.color }]}>{score}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View style={[styles.tag, { backgroundColor: tone.bg }]}>
        <Text style={[styles.tagText, { color: tone.color }]}>{tone.label}</Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color={theme.colors.dim} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  scoreCircle: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
})
