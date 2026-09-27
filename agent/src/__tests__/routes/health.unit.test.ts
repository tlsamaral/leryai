import type { FastifyInstance } from 'fastify'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────

const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: {
    getSessionConfig: vi.fn(),
    getLearnerSnapshot: vi.fn(),
    listSessionInsights: vi.fn(),
    createSession: vi.fn(),
    createLog: vi.fn(),
    completeSession: vi.fn(),
    createSessionInsight: vi.fn(),
  },
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
  genai: {
    getGenerativeModel: vi.fn().mockReturnValue({
      startChat: vi.fn().mockReturnValue({ sendMessage: vi.fn() }),
    }),
  },
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
    return { reply: vi.fn() }
  }),
}))

vi.mock('@/brain/evaluator.js', () => ({
  Evaluator: vi.fn().mockImplementation(function MockEvaluator(this: unknown) {
    return { evaluateTurn: vi.fn().mockResolvedValue(null) }
  }),
}))

// ── Imports ───────────────────────────────────────────────────────────────────

import { sessionStore } from '@/session-store/index.js'
import { buildTestApp } from '../helpers/test-app.js'

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('GET /health', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = buildTestApp()
    await app.ready()
  })

  afterAll(() => app.close())

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with correct shape', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.status).toBe('ok')
    expect(typeof body.activeSessions).toBe('number')
    expect(typeof body.uptimeSec).toBe('number')
  })

  it('activeSessions reflects sessionStore.size()', async () => {
    // seed a session into the store
    const fakeSession = {
      agentSessionId: 'health-test-session',
      apiSessionId: null,
      userId: 'user-1',
      mode: 'FREE_TALK' as const,
      tutor: {} as never,
      config: {} as never,
      lessonObjectives: null,
      startedAt: Date.now(),
      turnCount: 0,
    }
    sessionStore.set(fakeSession)

    const res = await app.inject({ method: 'GET', url: '/health' })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.activeSessions).toBeGreaterThanOrEqual(1)

    sessionStore.delete('health-test-session')

    const resAfter = await app.inject({ method: 'GET', url: '/health' })
    expect(resAfter.json().activeSessions).toBe(body.activeSessions - 1)
  })
})
