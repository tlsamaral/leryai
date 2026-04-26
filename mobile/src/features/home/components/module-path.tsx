import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useHaptics } from '../../../shared/hooks/use-haptics'
import { theme } from '../../../shared/theme'
import type { LearningMapResponse } from '../../../shared/types/api'
import type { LearningMapLesson } from '../../../shared/types/domain'

interface ModulePathProps {
  map: LearningMapResponse
  onPressLesson: (lessonId: string) => void
}

function cardVisual(lesson: LearningMapLesson) {
  if (lesson.status === 'IN_PROGRESS') {
    return {
      bg: '#040D12',
      border: '#0091B8',
      title: '#E5FAFF',
      subtitle: 'rgba(4,210,255,0.7)',
      iconColor: '#04D2FF',
      icon: 'play' as const,
      rail: 'rgba(4,210,255,0.4)',
      dot: '#04D2FF',
      disabled: false,
      badge: 'Agora',
    }
  }

  if (lesson.status === 'COMPLETED') {
    return {
      bg: '#FFFFFF',
      border: '#D1F0E8',
      title: '#0A1B23',
      subtitle: '#5A6E78',
      iconColor: '#2BC48A',
      icon: 'checkmark-circle' as const,
      rail: '#A8E8D0',
      dot: '#2BC48A',
      disabled: false,
      badge: 'Concluída',
    }
  }

  if (lesson.status === 'REVIEW_REQUIRED') {
    return {
      bg: '#FFF8EE',
      border: '#FFD899',
      title: '#7A4A10',
      subtitle: '#AA7020',
      iconColor: '#FFB547',
      icon: 'refresh' as const,
      rail: '#FFD899',
      dot: '#FFB547',
      disabled: false,
      badge: 'Revisão',
    }
  }

  return {
    bg: '#F6FAFE',
    border: '#E0EBF1',
    title: '#92A2AB',
    subtitle: '#B0BEC5',
    iconColor: '#B0BEC5',
    icon: 'lock-closed' as const,
    rail: '#E0EBF1',
    dot: '#C8D8E4',
    disabled: true,
    badge: 'Bloqueada',
  }
}

function LessonLineItem({
  lesson,
  index,
  total,
  onPressLesson,
}: {
  lesson: LearningMapLesson
  index: number
  total: number
  onPressLesson: (lessonId: string) => void
}) {
  const haptics = useHaptics()
  const visual = cardVisual(lesson)

  return (
    <View style={styles.lineRow}>
      <View style={styles.railCol}>
        {index === 0 ? (
          <View style={styles.railGhost} />
        ) : (
          <View style={[styles.railSeg, { backgroundColor: visual.rail }]} />
        )}
        <View style={[styles.railDot, { backgroundColor: visual.dot }]}>
          <Ionicons
            name={visual.icon}
            size={11}
            color={visual.disabled ? '#7B8983' : '#F8FFFB'}
          />
        </View>
        {index === total - 1 ? (
          <View style={styles.railGhost} />
        ) : (
          <View style={[styles.railSeg, { backgroundColor: visual.rail }]} />
        )}
      </View>

      <Pressable
        style={[
          styles.lessonCard,
          {
            backgroundColor: visual.bg,
            borderColor: visual.border,
          },
          lesson.status === 'IN_PROGRESS' && styles.lessonCardCurrent,
        ]}
        disabled={visual.disabled}
        onPress={() => {
          if (!visual.disabled) {
            haptics.tap()
            onPressLesson(lesson.id)
          }
        }}
      >
        <View style={styles.cardTopRow}>
          <Text style={[styles.cardBadge, { color: visual.subtitle }]}>
            {visual.badge}
          </Text>
          <Text style={[styles.cardScore, { color: visual.title }]}>
            {visual.disabled ? '--' : `${lesson.score}%`}
          </Text>
        </View>

        <Text
          style={[styles.cardTitle, { color: visual.title }]}
          numberOfLines={1}
        >
          {lesson.title}
        </Text>
        <Text
          style={[styles.cardSubtitle, { color: visual.subtitle }]}
          numberOfLines={1}
        >
          {lesson.scenario}
        </Text>

        <View style={styles.cardBottomRow}>
          <View style={styles.cardChip}>
            <Ionicons name="repeat" size={11} color={visual.subtitle} />
            <Text style={[styles.cardChipText, { color: visual.subtitle }]}>
              {lesson.attempts} tent.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={visual.subtitle} />
        </View>
      </Pressable>
    </View>
  )
}

export function ModulePath({ map, onPressLesson }: ModulePathProps) {
  const currentModule =
    map.modules.find((module) =>
      module.lessons.some((lesson) => lesson.isCurrent),
    ) ?? map.modules[0]

  const currentIndex = map.modules.findIndex(
    (module) => module.id === currentModule.id,
  )
  const previousModule = currentIndex > 0 ? map.modules[currentIndex - 1] : null
  const nextModule =
    currentIndex < map.modules.length - 1 ? map.modules[currentIndex + 1] : null
  const canUnlockNext = currentModule.lessons.every(
    (lesson) => lesson.status === 'COMPLETED',
  )

  return (
    <View style={styles.wrap}>
      <View style={styles.moduleHeader}>
        <View style={styles.moduleHeaderTop}>
          <Text style={styles.moduleBadge}>Modulo {currentModule.order}</Text>
          <Text style={styles.moduleMeta}>
            {currentModule.lessons.length} lessons
          </Text>
        </View>
        <Text style={styles.moduleTitle}>{currentModule.name}</Text>
        <Text style={styles.moduleSubtitle}>{currentModule.description}</Text>
      </View>

      <View style={styles.timelineWrap}>
        {currentModule.lessons.map((lesson, index) => (
          <LessonLineItem
            key={lesson.id}
            lesson={lesson}
            index={index}
            total={currentModule.lessons.length}
            onPressLesson={onPressLesson}
          />
        ))}
      </View>

      <View style={styles.moduleActionsRow}>
        <View style={styles.moduleGhostCard}>
          <Text style={styles.moduleCardLabel}>Anterior</Text>
          <Text style={styles.moduleCardTitle}>
            {previousModule?.name ?? 'Inicio'}
          </Text>
        </View>

        <View
          style={[
            styles.moduleNextCard,
            !canUnlockNext && styles.moduleNextCardLocked,
          ]}
        >
          <Text style={styles.moduleCardLabel}>Proximo</Text>
          <Text style={styles.moduleCardTitle}>
            {nextModule?.name ?? 'Sem proximo'}
          </Text>
          <Text style={styles.moduleCardStatus}>
            {!nextModule
              ? 'Fim da trilha'
              : canUnlockNext
                ? 'Desbloqueado'
                : 'Bloqueado'}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  moduleHeader: {
    // borderRadius: 20,
    // borderWidth: 1,
    // borderColor: '#E1ECE7',
    // backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  moduleHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moduleBadge: {
    color: theme.colors.primaryDeep,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  moduleMeta: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  moduleTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 7,
  },
  moduleSubtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 1,
  },
  timelineWrap: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  lineRow: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 96,
  },
  railCol: {
    width: 22,
    alignItems: 'center',
  },
  railSeg: {
    width: 2,
    height: 30,
    borderRadius: 999,
  },
  railGhost: {
    width: 2,
    height: 30,
    backgroundColor: 'transparent',
  },
  railDot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5FAF8',
  },
  lessonCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  lessonCardCurrent: {
    shadowColor: '#04D2FF',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardScore: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 1,
  },
  cardBottomRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  moduleActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  moduleGhostCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE8E3',
    backgroundColor: '#F8FBF9',
    padding: 10,
  },
  moduleNextCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}55`,
    backgroundColor: theme.colors.primarySoft,
    padding: 10,
  },
  moduleNextCardLocked: {
    opacity: 0.58,
  },
  moduleCardLabel: {
    color: theme.colors.muted,
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  moduleCardTitle: {
    color: theme.colors.text,
    fontSize: 14,
    marginTop: 2,
    fontWeight: '700',
  },
  moduleCardStatus: {
    color: theme.colors.primaryDeep,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
})
