import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'
import type { LearningMapResponse } from '../../../shared/types/api'
import { LessonNode } from './lesson-node'

interface ModulePathProps {
  map: LearningMapResponse
  onPressLesson: (lessonId: string) => void
}

export function ModulePath({ map, onPressLesson }: ModulePathProps) {
  return (
    <View style={styles.container}>
      {map.modules.map((module) => (
        <View key={module.id} style={styles.moduleCard}>
          <Text style={styles.moduleTitle}>
            {module.order}. {module.name}
          </Text>
          <Text style={styles.moduleDescription}>{module.description}</Text>
          <View style={styles.lessons}>
            {module.lessons.map((lesson, index) => {
              const mirrored = index % 2 === 1
              return (
                <View
                  key={lesson.id}
                  style={[
                    styles.lessonRow,
                    mirrored ? styles.lessonRight : styles.lessonLeft,
                  ]}
                >
                  <View style={styles.connector} />
                  <LessonNode
                    lesson={lesson}
                    onPress={() => onPressLesson(lesson.id)}
                  />
                </View>
              )
            })}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  moduleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  moduleTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.h2,
    fontWeight: '700',
  },
  moduleDescription: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
  },
  lessons: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  lessonRow: {
    width: '100%',
    maxWidth: 360,
  },
  lessonLeft: {
    alignSelf: 'flex-start',
  },
  lessonRight: {
    alignSelf: 'flex-end',
  },
  connector: {
    width: 2,
    height: 16,
    backgroundColor: theme.colors.primarySoft,
    alignSelf: 'center',
    marginBottom: theme.spacing.xs,
  },
})
