import type { LeryApi } from '../api/types'
import type {
  AuthGoogleRequest,
  AuthGoogleResponse,
  DeviceSettingsResponse,
  LearningMapResponse,
  LessonResultDetailResponse,
  PairDeviceRequest,
  PairDeviceResponse,
  ProfileResponse,
  ProgressCurrentResponse,
  PromptOverrideRequest,
  PromptOverrideResponse,
  ResultsListResponse,
  RetryLessonResponse,
  UpdateDeviceSettingsRequest,
} from '../types/api'
import {
  basePromptByLesson,
  mockDeviceSettingsByDeviceId,
  mockMap,
  mockProfile,
  mockUser,
  promptOverrides,
  resultsByLesson,
  validPairingCode,
} from './db'

function wait(ms = 420) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function findCurrent(): ProgressCurrentResponse {
  for (const module of mockMap.modules) {
    const current = module.lessons.find((lesson) => lesson.isCurrent)
    if (current) {
      return {
        level: mockMap.level,
        module: {
          id: module.id,
          name: module.name,
          description: module.description,
          order: module.order,
        },
        lesson: {
          id: current.id,
          title: current.title,
          scenario: current.scenario,
          systemPrompt:
            promptOverrides[current.id] ?? basePromptByLesson[current.id] ?? '',
          objectives: 'Speak naturally and build confidence with corrections.',
          order: current.order,
        },
      }
    }
  }

  return {
    level: mockMap.level,
    module: null,
    lesson: null,
  }
}

function findLessonMeta(lessonId: string) {
  for (const module of mockMap.modules) {
    const lesson = module.lessons.find((item) => item.id === lessonId)
    if (lesson) {
      return { module, lesson }
    }
  }

  return null
}

export class MockLeryApi implements LeryApi {
  async authGoogle(_input: AuthGoogleRequest): Promise<AuthGoogleResponse> {
    await wait(500)
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: mockUser,
    }
  }

  async getProgressCurrent(): Promise<ProgressCurrentResponse> {
    await wait()
    return findCurrent()
  }

  async getLearningMap(): Promise<LearningMapResponse> {
    await wait()
    return JSON.parse(JSON.stringify(mockMap)) as LearningMapResponse
  }

  async pairDevice(input: PairDeviceRequest): Promise<PairDeviceResponse> {
    await wait()
    if (input.pairingCode.trim().toUpperCase() !== validPairingCode) {
      throw new Error('Invalid pairing code')
    }

    const existing = mockProfile.devices[0]
    if (existing) {
      return { id: existing.id, apiKey: 'lery_mock_apikey_existing' }
    }

    const newDevice = {
      id: 'device-1',
      serialNumber: 'LERY-PI3-0001',
      nickname: 'Lery Living Room',
      isActive: true,
      userId: mockUser.id,
    }

    mockProfile.devices.push(newDevice)
    if (!mockDeviceSettingsByDeviceId[newDevice.id]) {
      mockDeviceSettingsByDeviceId[newDevice.id] = {
        deviceId: newDevice.id,
        settings: {
          voiceTone: 'warm',
          speechSpeed: 1,
          listeningSensitivity: 0.62,
          autoListen: true,
          wakeWordEnabled: true,
        },
        updatedAt: new Date().toISOString(),
      }
    }
    return { id: newDevice.id, apiKey: 'lery_mock_apikey_001' }
  }

  async getDeviceSettings(deviceId: string): Promise<DeviceSettingsResponse> {
    await wait(280)
    const settings = mockDeviceSettingsByDeviceId[deviceId]
    if (!settings) {
      throw new Error('Device settings not found')
    }

    return JSON.parse(JSON.stringify(settings)) as DeviceSettingsResponse
  }

  async updateDeviceSettings(
    deviceId: string,
    input: UpdateDeviceSettingsRequest,
  ): Promise<DeviceSettingsResponse> {
    await wait(320)

    const settings = mockDeviceSettingsByDeviceId[deviceId]
    if (!settings) {
      throw new Error('Device settings not found')
    }

    mockDeviceSettingsByDeviceId[deviceId] = {
      deviceId,
      settings: {
        ...settings.settings,
        ...input,
      },
      updatedAt: new Date().toISOString(),
    }

    return JSON.parse(
      JSON.stringify(mockDeviceSettingsByDeviceId[deviceId]),
    ) as DeviceSettingsResponse
  }

  async updateLessonPromptOverride(
    lessonId: string,
    input: PromptOverrideRequest,
  ): Promise<PromptOverrideResponse> {
    await wait()

    const meta = findLessonMeta(lessonId)
    if (!meta) {
      throw new Error('Lesson not found')
    }

    promptOverrides[lessonId] = input.systemPromptOverride

    return {
      lessonId,
      systemPromptOverride: input.systemPromptOverride,
      updatedAt: new Date().toISOString(),
    }
  }

  async retryLesson(lessonId: string): Promise<RetryLessonResponse> {
    await wait(360)
    const meta = findLessonMeta(lessonId)

    if (!meta) {
      throw new Error('Lesson not found')
    }

    for (const module of mockMap.modules) {
      for (const item of module.lessons) {
        if (item.status === 'IN_PROGRESS') {
          item.status = 'REVIEW_REQUIRED'
          item.isCurrent = false
        }
      }
    }

    if (meta.lesson.status === 'LOCKED') {
      throw new Error('Lesson is still locked')
    }

    meta.lesson.status = 'IN_PROGRESS'
    meta.lesson.isCurrent = true
    meta.lesson.attempts += 1

    return {
      progressId: `progress-${lessonId}`,
      lessonId,
      status: 'IN_PROGRESS',
      attempts: meta.lesson.attempts,
    }
  }

  async getResults(): Promise<ResultsListResponse> {
    await wait()
    const items = Object.values(resultsByLesson).map((result) => {
      const latest = result.attempts[0]
      return {
        lessonId: result.lessonId,
        lessonTitle: result.lessonTitle,
        latestScore: latest?.score ?? 0,
        attempts: result.attempts.length,
        lastSessionAt: latest?.session.startedAt ?? new Date().toISOString(),
      }
    })

    items.sort(
      (a, b) =>
        Number(new Date(b.lastSessionAt)) - Number(new Date(a.lastSessionAt)),
    )
    return { items }
  }

  async getLessonResult(lessonId: string): Promise<LessonResultDetailResponse> {
    await wait()
    const result = resultsByLesson[lessonId]
    if (!result) {
      throw new Error('Result not found')
    }
    return JSON.parse(JSON.stringify(result)) as LessonResultDetailResponse
  }

  async getProfile(): Promise<ProfileResponse> {
    await wait()
    return JSON.parse(JSON.stringify(mockProfile)) as ProfileResponse
  }

  async disputeLog(logId: string, _reason: string): Promise<{ id: string; disputeStatus: 'PENDING' }> {
    await wait()
    return { id: logId, disputeStatus: 'PENDING' }
  }

  async upsertProfile(_input: {
    nativeLanguage?: string
    interests?: string[]
    hobbies?: string[]
    occupation?: string
    ageGroup?: string
    learningGoal?: string
  }): Promise<void> {
    await wait()
  }
}
