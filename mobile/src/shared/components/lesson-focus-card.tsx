import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'
import { AppCard } from './app-card'

interface LessonFocusCardProps {
  moduleName: string
  lessonTitle: string
  scenario: string
  attempts: number
  score: number
  onPress: () => void
}

export function LessonFocusCard({
  moduleName,
  lessonTitle,
  scenario,
  attempts,
  score,
  onPress,
}: LessonFocusCardProps) {
  return (
    <AppCard tone="default" onPress={onPress} padding={0} radius={26}>
      <View style={[styles.innerContainer, { borderRadius: 26 }]}>
        <View style={styles.cornerGlow} />

        <View style={styles.topRow}>
          <View style={styles.modulePill}>
            <Ionicons
              name="layers-outline"
              size={11}
              color={theme.colors.primaryDeep}
            />
            <Text style={styles.modulePillText} numberOfLines={1}>
              {moduleName}
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreUnit}>%</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {lessonTitle}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {scenario}
        </Text>

        <View style={styles.footer}>
          <View style={styles.metaChip}>
            <Ionicons name="repeat" size={12} color={theme.colors.muted} />
            <Text style={styles.metaText}>
              {attempts} {attempts === 1 ? 'tentativa' : 'tentativas'}
            </Text>
          </View>
        </View>
      </View>
    </AppCard>
  )
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 18,
    overflow: 'hidden',
    width: '100%',
  },
  cornerGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80, // perfect circular radius for 160 width
    backgroundColor: 'rgba(4,210,255,0.08)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
    maxWidth: '66%',
  },
  modulePillText: {
    color: theme.colors.primaryDeep,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  scoreValue: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 24,
    letterSpacing: -0.6,
  },
  scoreUnit: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 22,
    letterSpacing: -0.4,
    marginTop: 8,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 19,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaText: {
    color: '#040D12',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
})
