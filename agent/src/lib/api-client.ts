import { env } from '@/env.js'

type Json = Record<string, unknown>

export interface SessionConfig {
  deviceId: string
  userId: string
  level: string
  diagnosisCompleted: boolean
  lesson: {
    id: string
    title: string
    scenario: string
    systemPrompt: string
    objectives: string | null
    order: number
  } | null
  module: {
    id: string
    name: string
    description: string | null
    order: number
  } | null
  profile: {
    nativeLanguage: string
    interests: string[]
    hobbies: string[]
    occupation: string | null
    ageGroup: string | null
    learningGoal: string | null
  } | null
}

export interface LearnerSnapshot {
  userId: string
  recentErrors: { pattern: string; exampleCount: number; lastSeen: string }[]
  dominatedStructures: {
    structure: string
    accuracyPct: number
    sampleSize: number
  }[]
  openTopics: { topic: string; lastMentioned: string }[]
  updatedAt: string | null
}

export interface SessionInsight {
  id: string
  sessionId: string
  topError: string
  topProgress: string
  openTopic: string | null
  createdAt: string
}

export class LeryApiClient {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor(baseUrl = env.LERY_API_URL, apiKey = env.LERY_DEVICE_API_KEY) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.apiKey = apiKey
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(
        `Lery API ${init.method ?? 'GET'} ${path} failed: ${res.status} ${text}`,
      )
    }

    return (await res.json()) as T
  }

  getSessionConfig(): Promise<SessionConfig> {
    return this.request<SessionConfig>('/core/session/config')
  }

  getLearnerSnapshot(): Promise<LearnerSnapshot> {
    return this.request<LearnerSnapshot>('/core/learner-snapshot')
  }

  listSessionInsights(limit = 3): Promise<{ insights: SessionInsight[] }> {
    return this.request(`/core/session-insights?limit=${limit}`)
  }

  createSession(input: {
    mode: 'FREE_TALK' | 'GUIDED_LESSON' | 'DIAGNOSIS'
    lessonId?: string | null
  }): Promise<{ id: string }> {
    const body: Json = { mode: input.mode }
    if (input.lessonId) body.lessonId = input.lessonId
    return this.request('/core/sessions', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  completeSession(sessionId: string): Promise<{
    id: string
    finalScore: number | null
    progressStatus: string | null
  }> {
    return this.request(`/core/sessions/${sessionId}/complete`, {
      method: 'PATCH',
    })
  }

  createLog(input: {
    sessionId: string
    userAudioTrans?: string
    leryResponse?: string
    grammaticalFixes?: string
    taskAchievement?: number
    grammar?: number
    vocabulary?: number
    fluency?: number
    totalScore?: number
    evaluationReasoning?: string
  }): Promise<{ id: string; progressStatus: string | null }> {
    const body: Json = {}
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) body[key] = value
    }
    return this.request('/core/logs', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  createSessionInsight(input: {
    sessionId: string
    topError: string
    topProgress: string
    openTopic?: string | null
  }): Promise<{ id: string }> {
    const body: Json = {
      sessionId: input.sessionId,
      topError: input.topError,
      topProgress: input.topProgress,
    }
    if (input.openTopic) body.openTopic = input.openTopic
    return this.request('/core/session-insights', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }
}

export const apiClient = new LeryApiClient()
