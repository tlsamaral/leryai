import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'

interface StreakCardProps {
  currentStreak: number
  longestStreak: number
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Streak</Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.value}>{currentStreak} dias</Text>
          <Text style={styles.label}>Atual</Text>
        </View>
        <View>
          <Text style={styles.value}>{longestStreak} dias</Text>
          <Text style={styles.label}>Recorde</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: theme.typography.h2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: theme.typography.h1,
  },
  label: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
})
