import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'
import type { LearningMapResponse } from '../../../shared/types/api'
import type { LearningMapLesson } from '../../../shared/types/domain'

type LessonItem = LearningMapResponse['modules'][number]['lessons'][number]

interface ModuleOverviewCardProps {
  order: number
  name: string
  description: string | null
  lessons: LessonItem[]
  onPressLesson: (lessonId: string) => void
}

function lessonChipStyle(lesson: LearningMapLesson) {
  if (lesson.status === 'IN_PROGRESS') {
    return { bg: '#040D12', border: '#04D2FF', text: '#04D2FF', icon: 'play' as const }
  }
  if (lesson.status === 'COMPLETED') {
    return { bg: '#E7F8F0', border: '#B7E5CD', text: '#1A7C56', icon: 'checkmark' as const }
  }
  if (lesson.status === 'REVIEW_REQUIRED') {
    return { bg: '#FFF6E5', border: '#FFD899', text: '#7A4A10', icon: 'refresh' as const }
  }
  return { bg: theme.colors.surfaceAlt, border: theme.colors.border, text: theme.colors.dim, icon: 'lock-closed' as const }
}

export function ModuleOverviewCard({
  order,
  name,
  description,
  lessons,
  onPressLesson,
}: ModuleOverviewCardProps) {
  const completed = lessons.filter((l) => l.status === 'COMPLETED').length
  const total = lessons.length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  const hasCurrent = lessons.some((l) => l.isCurrent)

  return (
    <View style={[styles.card, hasCurrent && styles.cardActive]}>
      <View style={styles.topRow}>
        <View style={styles.modulePill}>
          <Text style={styles.moduleOrder}>M{order}</Text>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          {description ? (
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          ) : null}
        </View>
        <View style={styles.pctChip}>
          <Text style={styles.pctText}>{pct}%</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>

      <View style={styles.lessonsCol}>
        {lessons.map((lesson) => {
          const visual = lessonChipStyle(lesson)
          const disabled = lesson.status === 'LOCKED'
          return (
            <Pressable
              key={lesson.id}
              disabled={disabled}
              onPress={() => onPressLesson(lesson.id)}
              style={({ pressed }) => [
                styles.lessonRow,
                {
                  backgroundColor: visual.bg,
                  borderColor: visual.border,
                },
                pressed && !disabled && { opacity: 0.85 },
              ]}
            >
              <View style={[styles.lessonIcon, { borderColor: visual.border }]}>
                <Ionicons name={visual.icon} size={11} color={visual.text} />
              </View>
              <Text
                style={[styles.lessonText, { color: visual.text }]}
                numberOfLines={1}
              >
                {lesson.title}
              </Text>
              {lesson.score > 0 ? (
                <Text style={[styles.lessonScore, { color: visual.text }]}>
                  {lesson.score}%
                </Text>
              ) : null}
            </Pressable>
          )
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {completed} de {total} concluídas
        </Text>
        {hasCurrent ? (
          <View style={styles.currentBadge}>
            <View style={styles.currentDot} />
            <Text style={styles.currentText}>Em andamento</Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.soft,
  },
  cardActive: {
    borderColor: `${theme.colors.primary}55`,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modulePill: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleOrder: {
    color: theme.colors.primaryDeep,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  pctChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
  },
  pctText: {
    color: theme.colors.primaryDeep,
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceAlt,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  lessonsCol: {
    gap: 6,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  lessonIcon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  lessonText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  lessonScore: {
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}55`,
  },
  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  currentText: {
    color: theme.colors.primaryDeep,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
})
