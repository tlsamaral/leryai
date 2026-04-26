import { type LessonStatus, type UserLevel } from '../lib/prisma-client/index.js'
import { prisma } from '../lib/prisma.js'

const CEFR_ORDER: UserLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

function computeStatus(score: number): LessonStatus {
  if (score >= 70) return 'COMPLETED'
  if (score >= 51) return 'REVIEW_REQUIRED'
  return 'LOCKED'
}

async function unlockNextLesson(userId: string, completedLessonId: string) {
  const completedLesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: completedLessonId },
    include: { module: { include: { level: true } } },
  })

  // Try next lesson in same module
  const nextInModule = await prisma.lesson.findFirst({
    where: { moduleId: completedLesson.moduleId, order: { gt: completedLesson.order } },
    orderBy: { order: 'asc' },
  })

  if (nextInModule) {
    await upsertProgressAsInProgress(userId, nextInModule.id)
    return
  }

  // Try first lesson of next module in same level
  const nextModule = await prisma.module.findFirst({
    where: { levelId: completedLesson.module.levelId, order: { gt: completedLesson.module.order } },
    orderBy: { order: 'asc' },
    include: { lessons: { orderBy: { order: 'asc' }, take: 1 } },
  })

  if (nextModule?.lessons[0]) {
    await upsertProgressAsInProgress(userId, nextModule.lessons[0].id)
    return
  }

  // No more lessons in level — try to advance User.currentLevel
  await tryAdvanceUserLevel(userId, completedLesson.module.levelId, completedLesson.module.level.code)
}

async function upsertProgressAsInProgress(userId: string, lessonId: string) {
  const existing = await prisma.userProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } })
  if (!existing || existing.status === 'LOCKED') {
    await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, status: 'IN_PROGRESS', score: 0, attempts: 0 },
      update: { status: 'IN_PROGRESS' },
    })
  }
}

async function tryAdvanceUserLevel(userId: string, levelId: string, currentCode: UserLevel) {
  const totalLessons = await prisma.lesson.count({ where: { module: { levelId } } })
  const completed = await prisma.userProgress.count({
    where: { userId, status: 'COMPLETED', lesson: { module: { levelId } } },
  })

  if (completed < totalLessons) return

  const nextIndex = CEFR_ORDER.indexOf(currentCode) + 1
  if (nextIndex >= CEFR_ORDER.length) return

  await prisma.user.update({ where: { id: userId }, data: { currentLevel: CEFR_ORDER[nextIndex] } })
}

export async function applyProgressRule(
  userId: string,
  lessonId: string,
  score: number,
): Promise<{ status: LessonStatus; score: number }> {
  const newStatus = computeStatus(score)

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, score, status: newStatus, attempts: 1 },
    update: { score, status: newStatus, attempts: { increment: 1 } },
  })

  if (newStatus === 'COMPLETED') {
    await unlockNextLesson(userId, lessonId)
  }

  return { status: newStatus, score }
}
