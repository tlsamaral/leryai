import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/env.js', () => ({
  env: {
    GOOGLE_API_KEY: 'test-key',
    GEMINI_TUTOR_MODEL: 'test-model',
    GEMINI_EVALUATOR_MODEL: 'test-model',
    LERY_API_URL: 'http://localhost:3333',
    LERY_DEVICE_API_KEY: 'test-device-key',
    TUTOR_HARD_TIMEOUT_MS: 10000,
    TUTOR_MAX_RETRIES: 3,
    PORT: 3334,
    HOST: '0.0.0.0',
  },
}))

import { LeryApiClient } from '@/lib/api-client.js'

function mockFetch(data: unknown, ok = true, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    status,
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response)
}

describe('LeryApiClient', () => {
  let client: LeryApiClient
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    client = new LeryApiClient('http://api.test', 'my-device-key')
  })

  afterEach(() => {
    fetchSpy?.mockRestore()
  })

  describe('auth header', () => {
    it('sends Bearer token on every request', async () => {
      fetchSpy = mockFetch({ deviceId: 'd', userId: 'u', level: 'B1', diagnosisCompleted: true, lesson: null, module: null, profile: null })
      await client.getSessionConfig()
      const headers = (fetchSpy.mock.calls[0][1] as RequestInit).headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer my-device-key')
    })

    it('sends Content-Type application/json', async () => {
      fetchSpy = mockFetch({ id: 'session-1' })
      await client.createSession({ mode: 'FREE_TALK' })
      const headers = (fetchSpy.mock.calls[0][1] as RequestInit).headers as Record<string, string>
      expect(headers['Content-Type']).toBe('application/json')
    })
  })

  describe('getSessionConfig', () => {
    it('returns parsed config on success', async () => {
      const config = { deviceId: 'd', userId: 'u', level: 'A1', diagnosisCompleted: false, lesson: null, module: null, profile: null }
      fetchSpy = mockFetch(config)
      const result = await client.getSessionConfig()
      expect(result.level).toBe('A1')
      expect(result.userId).toBe('u')
    })

    it('throws on non-ok response', async () => {
      fetchSpy = mockFetch('Unauthorized', false, 401)
      await expect(client.getSessionConfig()).rejects.toThrow('401')
    })
  })

  describe('createSession', () => {
    it('sends POST with mode in body', async () => {
      fetchSpy = mockFetch({ id: 'sess-abc' })
      await client.createSession({ mode: 'GUIDED_LESSON', lessonId: 'lesson-1' })
      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string)
      expect(body.mode).toBe('GUIDED_LESSON')
      expect(body.lessonId).toBe('lesson-1')
    })

    it('omits lessonId when null', async () => {
      fetchSpy = mockFetch({ id: 'sess-abc' })
      await client.createSession({ mode: 'FREE_TALK', lessonId: null })
      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string)
      expect(body.lessonId).toBeUndefined()
    })
  })

  describe('createLog', () => {
    it('omits undefined optional fields from body', async () => {
      fetchSpy = mockFetch({ id: 'log-1', progressStatus: null })
      await client.createLog({ sessionId: 'sess-1', userAudioTrans: 'hello' })
      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string)
      expect(body.sessionId).toBe('sess-1')
      expect(body.userAudioTrans).toBe('hello')
      expect('grammar' in body).toBe(false)
      expect('fluency' in body).toBe(false)
    })

    it('includes all score fields when provided', async () => {
      fetchSpy = mockFetch({ id: 'log-1', progressStatus: null })
      await client.createLog({
        sessionId: 'sess-1',
        grammar: 20,
        fluency: 18,
        taskAchievement: 22,
        vocabulary: 19,
        totalScore: 79,
      })
      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string)
      expect(body.grammar).toBe(20)
      expect(body.totalScore).toBe(79)
    })
  })

  describe('completeSession', () => {
    it('sends PATCH request', async () => {
      fetchSpy = mockFetch({ id: 'sess-1', finalScore: 82, progressStatus: 'PASSED' })
      await client.completeSession('sess-1')
      expect((fetchSpy.mock.calls[0][1] as RequestInit).method).toBe('PATCH')
    })

    it('returns finalScore and progressStatus', async () => {
      fetchSpy = mockFetch({ id: 'sess-1', finalScore: 75, progressStatus: 'PASSED' })
      const result = await client.completeSession('sess-1')
      expect(result.finalScore).toBe(75)
      expect(result.progressStatus).toBe('PASSED')
    })
  })

  describe('createSessionInsight', () => {
    it('sends POST to /core/session-insights with correct body', async () => {
      fetchSpy = mockFetch({ id: 'insight-1' })
      await client.createSessionInsight({
        sessionId: 'sess-1',
        topError: 'subject-verb agreement',
        topProgress: 'past tense usage',
        openTopic: 'weekend plans',
      })
      const call = fetchSpy.mock.calls[0]
      expect((call[1] as RequestInit).method).toBe('POST')
      expect((call[0] as string).endsWith('/core/session-insights')).toBe(true)
      const body = JSON.parse((call[1] as RequestInit).body as string)
      expect(body.sessionId).toBe('sess-1')
      expect(body.topError).toBe('subject-verb agreement')
      expect(body.topProgress).toBe('past tense usage')
      expect(body.openTopic).toBe('weekend plans')
    })

    it('returns { id } on success', async () => {
      fetchSpy = mockFetch({ id: 'insight-42' })
      const result = await client.createSessionInsight({
        sessionId: 'sess-2',
        topError: 'article usage',
        topProgress: 'conditional sentences',
      })
      expect(result.id).toBe('insight-42')
    })

    it('omits openTopic from body when not provided', async () => {
      fetchSpy = mockFetch({ id: 'insight-3' })
      await client.createSessionInsight({
        sessionId: 'sess-3',
        topError: 'prepositions',
        topProgress: 'vocabulary range',
      })
      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string)
      expect('openTopic' in body).toBe(false)
    })
  })

  describe('error on non-ok', () => {
    it('error message includes method, path, and status', async () => {
      fetchSpy = mockFetch('not found', false, 404)
      await expect(client.getLearnerSnapshot()).rejects.toThrow(/GET.*404/)
    })
  })
})
