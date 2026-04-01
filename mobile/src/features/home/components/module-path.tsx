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
      bg: '#1F8A70',
      border: '#156B55',
      title: '#F5FFFB',
      subtitle: '#D6F3E9',
      iconColor: '#F6FFFB',
      icon: 'play' as const,
      rail: '#7CC7AF',
      dot: '#1F8A70',
      disabled: false,
      badge: 'Agora',
    }
  }

  if (lesson.status === 'COMPLETED') {
    return {
      bg: '#FFFFFF',
      border: '#DCEAE4',
      title: '#1E5134',
      subtitle: '#5B7E6F',
      iconColor: '#2E9E5B',
      icon: 'checkmark-circle' as const,
      rail: '#B8DCCA',
      dot: '#2E9E5B',
      disabled: false,
      badge: 'Concluida',
    }
  }

  if (lesson.status === 'REVIEW_REQUIRED') {
    return {
      bg: '#FFF8E8',
      border: '#F0D79C',
      title: '#775A20',
      subtitle: '#927748',
      iconColor: '#C28A1A',
      icon: 'refresh' as const,
      rail: '#E5D2A5',
      dot: '#F4B942',
      disabled: false,
      badge: 'Revisao',
    }
  }

  return {
    bg: '#F4F6F5',
    border: '#DFE5E2',
    title: '#7A8982',
    subtitle: '#9BA8A2',
    iconColor: '#9BA8A2',
    icon: 'lock-closed' as const,
    rail: '#E2E8E5',
    dot: '#CDD8D3',
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
    color: '#2E7F67',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    backgroundColor: '#E7F4EE',
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
    shadowColor: '#1F8A70',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
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
    borderColor: '#A7D6C6',
    backgroundColor: '#EAF8F2',
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
    color: '#1F8A70',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
})
