import { appConfig } from '../config/app-config'
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
import type { LeryApi } from './types'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT'
  body?: unknown
  accessToken?: string | null
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`
  }

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `HTTP ${response.status}`)
  }

  return (await response.json()) as T
}

export class HttpLeryApi implements LeryApi {
  constructor(private readonly getAccessToken: () => string | null) {}

  authGoogle(input: AuthGoogleRequest): Promise<AuthGoogleResponse> {
    return request<AuthGoogleResponse>('/auth/google', {
      method: 'POST',
      body: input,
    })
  }

  getProgressCurrent(): Promise<ProgressCurrentResponse> {
    return request<ProgressCurrentResponse>('/progress/current', {
      accessToken: this.getAccessToken(),
    })
  }

  getLearningMap(): Promise<LearningMapResponse> {
    return request<LearningMapResponse>('/learning/map', {
      accessToken: this.getAccessToken(),
    })
  }

  pairDevice(input: PairDeviceRequest): Promise<PairDeviceResponse> {
    return request<PairDeviceResponse>('/devices/pair', {
      method: 'POST',
      body: input,
      accessToken: this.getAccessToken(),
    })
  }

  getDeviceSettings(deviceId: string): Promise<DeviceSettingsResponse> {
    return request<DeviceSettingsResponse>(`/devices/${deviceId}/settings`, {
      accessToken: this.getAccessToken(),
    })
  }

  updateDeviceSettings(
    deviceId: string,
    input: UpdateDeviceSettingsRequest,
  ): Promise<DeviceSettingsResponse> {
    return request<DeviceSettingsResponse>(`/devices/${deviceId}/settings`, {
      method: 'PUT',
      body: input,
      accessToken: this.getAccessToken(),
    })
  }

  updateLessonPromptOverride(
    lessonId: string,
    input: PromptOverrideRequest,
  ): Promise<PromptOverrideResponse> {
    return request<PromptOverrideResponse>(
      `/lessons/${lessonId}/prompt-override`,
      {
        method: 'PUT',
        body: input,
        accessToken: this.getAccessToken(),
      },
    )
  }

  retryLesson(lessonId: string): Promise<RetryLessonResponse> {
    return request<RetryLessonResponse>(`/progress/${lessonId}/retry`, {
      method: 'POST',
      accessToken: this.getAccessToken(),
    })
  }

  getResults(): Promise<ResultsListResponse> {
    return request<ResultsListResponse>('/results', {
      accessToken: this.getAccessToken(),
    })
  }

  getLessonResult(lessonId: string): Promise<LessonResultDetailResponse> {
    return request<LessonResultDetailResponse>(`/results/${lessonId}`, {
      accessToken: this.getAccessToken(),
    })
  }

  getProfile(): Promise<ProfileResponse> {
    return request<ProfileResponse>('/profile', {
      accessToken: this.getAccessToken(),
    })
  }

  disputeLog(logId: string, reason: string): Promise<{ id: string; disputeStatus: 'PENDING' }> {
    return request<{ id: string; disputeStatus: 'PENDING' }>(`/logs/${logId}/dispute`, {
      method: 'POST',
      body: { reason },
      accessToken: this.getAccessToken(),
    })
  }

  upsertProfile(input: {
    nativeLanguage?: string
    interests?: string[]
    hobbies?: string[]
    occupation?: string
    ageGroup?: string
    learningGoal?: string
  }): Promise<void> {
    return request<void>('/profile', {
      method: 'PUT',
      body: input,
      accessToken: this.getAccessToken(),
    })
  }
}
