export type LessonStatus =
  | 'LOCKED'
  | 'IN_PROGRESS'
  | 'REVIEW_REQUIRED'
  | 'COMPLETED'

export type InteractionMode = 'FREE_TALK' | 'GUIDED_LESSON' | 'DIAGNOSIS'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
}

export interface Device {
  id: string
  serialNumber: string
  nickname: string | null
  isActive: boolean
  userId: string
}

export interface LearningMapLesson {
  id: string
  title: string
  scenario: string
  order: number
  status: LessonStatus
  score: number
  attempts: number
  isCurrent: boolean
}

export interface Module {
  id: string
  name: string
  description: string | null
  order: number
  levelId: string
  lessons: LearningMapLesson[]
}

export interface ConversationSession {
  id: string
  userId: string
  mode: InteractionMode
  lessonId?: string
  startedAt: string
  endedAt: string | null
}

export interface InteractionLog {
  id: string
  sessionId: string
  userAudioTrans: string | null
  leryResponse: string | null
  grammaticalFixes: string | null
  sentimentScore: number | null
  createdAt: string
}

export interface StreakSummary {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
}
