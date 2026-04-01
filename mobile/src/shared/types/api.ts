import type {
  ConversationSession,
  Device,
  InteractionLog,
  LessonStatus,
  StreakSummary,
} from './domain'

export interface AuthGoogleRequest {
  idToken: string
}

export interface AuthGoogleResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    avatarUrl?: string | null
  }
}

export interface PairDeviceRequest {
  pairingCode: string
}

export interface PairDeviceResponse {
  id: string
  apiKey: string | null
}

export type LeryVoiceTone = 'warm' | 'neutral' | 'energetic'

export interface DeviceSettings {
  voiceTone: LeryVoiceTone
  speechSpeed: number
  listeningSensitivity: number
  autoListen: boolean
  wakeWordEnabled: boolean
}

export interface DeviceSettingsResponse {
  deviceId: string
  settings: DeviceSettings
  updatedAt: string
}

export interface UpdateDeviceSettingsRequest {
  voiceTone?: LeryVoiceTone
  speechSpeed?: number
  listeningSensitivity?: number
  autoListen?: boolean
  wakeWordEnabled?: boolean
}

export interface ProgressCurrentResponse {
  level: string
  module: {
    id: string
    name: string
    description: string | null
    order: number
  } | null
  lesson: {
    id: string
    title: string
    scenario: string
    systemPrompt: string
    objectives: string | null
    order: number
  } | null
}

export interface LearningMapResponse {
  level: string
  modules: {
    id: string
    name: string
    description: string | null
    order: number
    lessons: {
      id: string
      title: string
      scenario: string
      order: number
      status: LessonStatus
      score: number
      attempts: number
      isCurrent: boolean
    }[]
  }[]
}

export interface PromptOverrideRequest {
  systemPromptOverride: string
}

export interface PromptOverrideResponse {
  lessonId: string
  systemPromptOverride: string
  updatedAt: string
}

export interface RetryLessonResponse {
  progressId: string
  lessonId: string
  status: LessonStatus
  attempts: number
}

export interface ResultListItem {
  lessonId: string
  lessonTitle: string
  latestScore: number
  attempts: number
  lastSessionAt: string
}

export interface ResultsListResponse {
  items: ResultListItem[]
}

export interface LessonResultDetailResponse {
  lessonId: string
  lessonTitle: string
  attempts: {
    session: ConversationSession
    score: number
    feedbackSummary: string
    logs: InteractionLog[]
  }[]
}

export interface ProfileResponse {
  profile: {
    id: string
    nativeLanguage: string
    interests: string[]
    hobbies: string[]
    occupation: string | null
    ageGroup: string | null
    learningGoal: string | null
  } | null
  streak: StreakSummary
  devices: Device[]
}
