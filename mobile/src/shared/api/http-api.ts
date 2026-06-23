import { httpClient } from '../../features/auth/services/http-client'
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

export class HttpLeryApi implements LeryApi {
  authGoogle(input: AuthGoogleRequest): Promise<AuthGoogleResponse> {
    return httpClient.request<AuthGoogleResponse>('/auth/google', {
      method: 'POST',
      body: input,
      anonymous: true,
    })
  }

  getProgressCurrent(): Promise<ProgressCurrentResponse> {
    return httpClient.request<ProgressCurrentResponse>('/progress/current')
  }

  getLearningMap(): Promise<LearningMapResponse> {
    return httpClient.request<LearningMapResponse>('/learning/map')
  }

  pairDevice(input: PairDeviceRequest): Promise<PairDeviceResponse> {
    return httpClient.request<PairDeviceResponse>('/devices/pair', {
      method: 'POST',
      body: input,
    })
  }

  getDeviceSettings(deviceId: string): Promise<DeviceSettingsResponse> {
    return httpClient.request<DeviceSettingsResponse>(
      `/devices/${deviceId}/settings`,
    )
  }

  updateDeviceSettings(
    deviceId: string,
    input: UpdateDeviceSettingsRequest,
  ): Promise<DeviceSettingsResponse> {
    return httpClient.request<DeviceSettingsResponse>(
      `/devices/${deviceId}/settings`,
      {
        method: 'PUT',
        body: input,
      },
    )
  }

  updateLessonPromptOverride(
    lessonId: string,
    input: PromptOverrideRequest,
  ): Promise<PromptOverrideResponse> {
    return httpClient.request<PromptOverrideResponse>(
      `/lessons/${lessonId}/prompt-override`,
      {
        method: 'PUT',
        body: input,
      },
    )
  }

  retryLesson(lessonId: string): Promise<RetryLessonResponse> {
    return httpClient.request<RetryLessonResponse>(
      `/progress/${lessonId}/retry`,
      {
        method: 'POST',
      },
    )
  }

  getResults(): Promise<ResultsListResponse> {
    return httpClient.request<ResultsListResponse>('/results')
  }

  getLessonResult(lessonId: string): Promise<LessonResultDetailResponse> {
    return httpClient.request<LessonResultDetailResponse>(
      `/results/${lessonId}`,
    )
  }

  getProfile(): Promise<ProfileResponse> {
    return httpClient.request<ProfileResponse>('/profile')
  }

  disputeLog(
    logId: string,
    reason: string,
  ): Promise<{ id: string; disputeStatus: 'PENDING' }> {
    return httpClient.request<{ id: string; disputeStatus: 'PENDING' }>(
      `/logs/${logId}/dispute`,
      {
        method: 'POST',
        body: { reason },
      },
    )
  }

  upsertProfile(input: {
    nativeLanguage?: string
    interests?: string[]
    hobbies?: string[]
    occupation?: string
    ageGroup?: string
    learningGoal?: string
  }): Promise<void> {
    return httpClient.request<void>('/profile', {
      method: 'PUT',
      body: input,
    })
  }
}
