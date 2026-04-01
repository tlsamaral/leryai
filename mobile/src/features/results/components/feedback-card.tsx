import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'

interface FeedbackCardProps {
  lessonTitle: string
  score: number
  attempts: number
  lastSessionAt: string
  onPress: () => void
}

export function FeedbackCard({
  lessonTitle,
  score,
  attempts,
  lastSessionAt,
  onPress,
}: FeedbackCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title}>{lessonTitle}</Text>
        <Text style={styles.score}>{score}%</Text>
      </View>
      <Text style={styles.meta}>{attempts} tentativas</Text>
      <Text style={styles.meta}>
        Ultima sessao: {new Date(lastSessionAt).toLocaleDateString('pt-BR')}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: theme.typography.h2,
  },
  score: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.h2,
  },
  meta: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
})
