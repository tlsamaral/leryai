import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AppCard } from '../../../shared/components/app-card'
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

function lessonVisuals(lesson: LearningMapLesson) {
  if (lesson.status === 'IN_PROGRESS') {
    return {
      bg: theme.colors.primary,
      border: '#00A3D2',
      text: '#FFFFFF',
      iconBg: '#FFFFFF',
      iconColor: theme.colors.primaryDeep,
      icon: 'play' as const,
      shadow: '#008EBC',
    }
  }
  if (lesson.status === 'COMPLETED') {
    return {
      bg: '#E7F8F0',
      border: '#B7E5CD',
      text: '#1A7C56',
      iconBg: '#FFFFFF',
      iconColor: '#1A7C56',
      icon: 'checkmark' as const,
      shadow: '#CDEADE',
    }
  }
  if (lesson.status === 'REVIEW_REQUIRED') {
    return {
      bg: '#FFF6E5',
      border: '#FFD899',
      text: '#B06C17',
      iconBg: '#FFFFFF',
      iconColor: '#B06C17',
      icon: 'refresh' as const,
      shadow: '#FCE0A6',
    }
  }
  return {
    bg: '#F6F9FA',
    border: '#EAEFEF',
    text: '#A5B5BA',
    iconBg: '#EAEFEF',
    iconColor: '#A5B5BA',
    icon: 'lock-closed' as const,
    shadow: '#EAEFEF',
  }
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
    <AppCard tone={hasCurrent ? 'cyan' : 'default'} padding={16} radius={24}>
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
          const visual = lessonVisuals(lesson)
          const disabled = lesson.status === 'LOCKED'
          const isActive = lesson.status === 'IN_PROGRESS'

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
                  borderBottomWidth: isActive ? 4 : 2, // 3D push effect
                  borderBottomColor: isActive ? visual.shadow : visual.border,
                },
                pressed &&
                  !disabled && {
                    transform: [{ translateY: 2 }],
                    borderBottomWidth: 2,
                  },
              ]}
            >
              <View
                style={[styles.lessonIcon, { backgroundColor: visual.iconBg }]}
              >
                <Ionicons
                  name={visual.icon}
                  size={13}
                  color={visual.iconColor}
                />
              </View>
              <Text
                style={[
                  styles.lessonText,
                  { color: visual.text, fontWeight: isActive ? '800' : '700' },
                ]}
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
    </AppCard>
  )
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
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
    marginVertical: 10,
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
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  lessonIcon: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonText: {
    flex: 1,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  lessonScore: {
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    marginTop: 10,
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
