import type { FastifyInstance } from 'fastify'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────

const { mockApiClient, mockTutorReply } = vi.hoisted(() => ({
  mockApiClient: {
    getSessionConfig: vi.fn(),
    getLearnerSnapshot: vi.fn(),
    listSessionInsights: vi.fn(),
    createSession: vi.fn(),
    createLog: vi.fn(),
    completeSession: vi.fn(),
    createSessionInsight: vi.fn(),
  },
  mockTutorReply: vi.fn(),
}))

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

vi.mock('@/lib/gemini.js', () => ({
  genai: { getGenerativeModel: vi.fn().mockReturnValue({ startChat: vi.fn().mockReturnValue({ sendMessage: vi.fn() }) }) },
  isRetryable: vi.fn().mockReturnValue(false),
  sleep: vi.fn().mockResolvedValue(undefined),
  backoffMs: vi.fn().mockReturnValue(0),
  withTimeout: vi.fn().mockImplementation((p: Promise<unknown>) => p),
}))

vi.mock('@/lib/api-client.js', () => ({
  LeryApiClient: vi.fn(),
  apiClient: mockApiClient,
}))

vi.mock('@/brain/tutor.js', () => ({
  Tutor: vi.fn().mockImplementation(function MockTutor(this: unknown) {
    return { reply: mockTutorReply }
  }),
}))

vi.mock('@/brain/evaluator.js', () => ({
  Evaluator: vi.fn().mockImplementation(function MockEvaluator(this: unknown) {
    return { evaluateTurn: vi.fn().mockResolvedValue(null) }
  }),
}))

// ── Imports ───────────────────────────────────────────────────────────────────

import { buildTestApp } from '../helpers/test-app.js'
import { sessionStore } from '@/session-store/index.js'
import type { SessionConfig } from '@/lib/api-client.js'

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeConfig(overrides: Partial<SessionConfig> = {}): SessionConfig {
  return {
    deviceId: 'dev-1',
    userId: 'user-abc',
    level: 'B1',
    diagnosisCompleted: true,
    lesson: null,
    module: null,
    profile: null,
    ...overrides,
  }
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('POST /v1/sessions', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = buildTestApp()
    await app.ready()
  })

  afterAll(() => app.close())

  afterEach(() => {
    vi.clearAllMocks()
    // clean up any sessions left in the store
    const keys: string[] = []
    // SessionStore has no enumeration — use a workaround via the store size
    // Instead, we track created ids in each test (see below pattern)
  })

  it('returns 201 with correct shape on FREE_TALK', async () => {
    mockApiClient.getSessionConfig.mockResolvedValue(makeConfig())
    mockApiClient.getLearnerSnapshot.mockResolvedValue({ userId: 'u', recentErrors: [], dominatedStructures: [], openTopics: [], updatedAt: null })
    mockApiClient.listSessionInsights.mockResolvedValue({ insights: [] })
    mockApiClient.createSession.mockResolvedValue({ id: 'api-sess-1' })

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'FREE_TALK' } })

    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.agentSessionId).toBeTruthy()
    expect(body.apiSessionId).toBe('api-sess-1')
    expect(body.mode).toBe('FREE_TALK')
    expect(body.userId).toBe('user-abc')
    expect(body.level).toBe('B1')

    sessionStore.delete(body.agentSessionId)
  })

  it('defaults mode to FREE_TALK when not provided', async () => {
    mockApiClient.getSessionConfig.mockResolvedValue(makeConfig())
    mockApiClient.getLearnerSnapshot.mockResolvedValue(null)
    mockApiClient.listSessionInsights.mockResolvedValue({ insights: [] })
    mockApiClient.createSession.mockResolvedValue({ id: 'api-sess-2' })

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: {} })

    expect(res.statusCode).toBe(201)
    expect(res.json().mode).toBe('FREE_TALK')
    sessionStore.delete(res.json().agentSessionId)
  })

  it('apiSessionId is null when createSession throws (offline degradation)', async () => {
    mockApiClient.getSessionConfig.mockResolvedValue(makeConfig())
    mockApiClient.getLearnerSnapshot.mockResolvedValue(null)
    mockApiClient.listSessionInsights.mockResolvedValue({ insights: [] })
    mockApiClient.createSession.mockRejectedValue(new Error('API down'))

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'FREE_TALK' } })

    expect(res.statusCode).toBe(201)
    expect(res.json().apiSessionId).toBeNull()
    sessionStore.delete(res.json().agentSessionId)
  })

  it('session created even when getLearnerSnapshot throws', async () => {
    mockApiClient.getSessionConfig.mockResolvedValue(makeConfig())
    mockApiClient.getLearnerSnapshot.mockRejectedValue(new Error('snapshot unavailable'))
    mockApiClient.listSessionInsights.mockResolvedValue({ insights: [] })
    mockApiClient.createSession.mockResolvedValue({ id: 'sess-ok' })

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'FREE_TALK' } })

    expect(res.statusCode).toBe(201)
    sessionStore.delete(res.json().agentSessionId)
  })

  it('session created even when listSessionInsights throws', async () => {
    mockApiClient.getSessionConfig.mockResolvedValue(makeConfig())
    mockApiClient.getLearnerSnapshot.mockResolvedValue(null)
    mockApiClient.listSessionInsights.mockRejectedValue(new Error('insights unavailable'))
    mockApiClient.createSession.mockResolvedValue({ id: 'sess-ok' })

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'FREE_TALK' } })

    expect(res.statusCode).toBe(201)
    sessionStore.delete(res.json().agentSessionId)
  })

  it('stores lessonObjectives when mode is GUIDED_LESSON and lesson has objectives', async () => {
    const config = makeConfig({
      lesson: { id: 'l1', title: 'At the Airport', scenario: 'Check-in', systemPrompt: 'guide', objectives: 'Use travel vocab.', order: 1 },
    })
    mockApiClient.getSessionConfig.mockResolvedValue(config)
    mockApiClient.getLearnerSnapshot.mockResolvedValue(null)
    mockApiClient.listSessionInsights.mockResolvedValue({ insights: [] })
    mockApiClient.createSession.mockResolvedValue({ id: 'sess-guided' })

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'GUIDED_LESSON' } })

    expect(res.statusCode).toBe(201)
    const { agentSessionId } = res.json()
    const state = sessionStore.get(agentSessionId)
    expect(state?.lessonObjectives).toBe('Use travel vocab.')
    sessionStore.delete(agentSessionId)
  })

  it('lessonObjectives is null in FREE_TALK even if lesson present', async () => {
    const config = makeConfig({
      lesson: { id: 'l1', title: 'Test', scenario: 's', systemPrompt: 'p', objectives: 'some obj', order: 1 },
    })
    mockApiClient.getSessionConfig.mockResolvedValue(config)
    mockApiClient.getLearnerSnapshot.mockResolvedValue(null)
    mockApiClient.listSessionInsights.mockResolvedValue({ insights: [] })
    mockApiClient.createSession.mockResolvedValue({ id: 'sess-free' })

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'FREE_TALK' } })

    const { agentSessionId } = res.json()
    expect(sessionStore.get(agentSessionId)?.lessonObjectives).toBeNull()
    sessionStore.delete(agentSessionId)
  })

  it('session persisted in store after creation', async () => {
    mockApiClient.getSessionConfig.mockResolvedValue(makeConfig())
    mockApiClient.getLearnerSnapshot.mockResolvedValue(null)
    mockApiClient.listSessionInsights.mockResolvedValue({ insights: [] })
    mockApiClient.createSession.mockResolvedValue({ id: 'sess-store' })

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'FREE_TALK' } })

    const { agentSessionId } = res.json()
    const state = sessionStore.get(agentSessionId)
    expect(state).toBeDefined()
    expect(state?.userId).toBe('user-abc')
    expect(state?.mode).toBe('FREE_TALK')
    expect(state?.turnCount).toBe(0)
    sessionStore.delete(agentSessionId)
  })

  it('returns 500 when getSessionConfig throws', async () => {
    mockApiClient.getSessionConfig.mockRejectedValue(new Error('DB error'))

    const res = await app.inject({ method: 'POST', url: '/v1/sessions', body: { mode: 'FREE_TALK' } })

    expect(res.statusCode).toBe(500)
  })
})
