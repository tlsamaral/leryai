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

export interface LeryApi {
  authGoogle(input: AuthGoogleRequest): Promise<AuthGoogleResponse>
  getProgressCurrent(): Promise<ProgressCurrentResponse>
  getLearningMap(): Promise<LearningMapResponse>
  pairDevice(input: PairDeviceRequest): Promise<PairDeviceResponse>
  getDeviceSettings(deviceId: string): Promise<DeviceSettingsResponse>
  updateDeviceSettings(
    deviceId: string,
    input: UpdateDeviceSettingsRequest,
  ): Promise<DeviceSettingsResponse>
  updateLessonPromptOverride(
    lessonId: string,
    input: PromptOverrideRequest,
  ): Promise<PromptOverrideResponse>
  retryLesson(lessonId: string): Promise<RetryLessonResponse>
  getResults(): Promise<ResultsListResponse>
  getLessonResult(lessonId: string): Promise<LessonResultDetailResponse>
  getProfile(): Promise<ProfileResponse>
}
