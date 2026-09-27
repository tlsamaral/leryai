import type { FastifyInstance } from 'fastify'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const { mockCompleteSession, mockSummarizeSession, mockCreateSessionInsight } =
  vi.hoisted(() => ({
    mockCompleteSession: vi.fn(),
    mockSummarizeSession: vi.fn().mockResolvedValue({
      topError: 'past tense',
      topProgress: 'fluent',
      openTopic: null,
    }),
    mockCreateSessionInsight: vi.fn().mockResolvedValue({ id: 'insight-1' }),
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
  extractTokenUsage: vi
    .fn()
    .mockReturnValue({ inputTokens: 10, outputTokens: 5, totalTokens: 15 }),
}))

vi.mock('@/lib/api-client.js', () => ({
  LeryApiClient: vi.fn(),
  apiClient: {
    getSessionConfig: vi.fn(),
    getLearnerSnapshot: vi.fn(),
    listSessionInsights: vi.fn(),
    createSession: vi.fn(),
    createLog: vi.fn(),
    completeSession: mockCompleteSession,
    createSessionInsight: mockCreateSessionInsight,
  },
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

vi.mock('@/brain/summarizer.js', () => ({
  Summarizer: vi.fn().mockImplementation(function MockSummarizer(
    this: unknown,
  ) {
    return { summarizeSession: mockSummarizeSession }
  }),
}))

// ── Imports ───────────────────────────────────────────────────────────────────

import type { SessionState } from '@/session-store/index.js'
import { sessionStore } from '@/session-store/index.js'
import { buildTestApp } from '../helpers/test-app.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

const SESSION_ID = 'complete-test-session'

function makeState(overrides: Partial<SessionState> = {}): SessionState {
  return {
    agentSessionId: SESSION_ID,
    apiSessionId: 'api-sess-1',
    userId: 'user-1',
    mode: 'GUIDED_LESSON',
    tutor: { reply: vi.fn() } as never,
    config: {
      level: 'B1',
      userId: 'user-1',
      deviceId: 'd',
      diagnosisCompleted: true,
      lesson: null,
      module: null,
      profile: null,
    },
    lessonObjectives: null,
    startedAt: Date.now(),
    turnCount: 7,
    lastActivityAt: Date.now(),
    interactions: [],
    ...overrides,
  }
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('PATCH /v1/sessions/:agentSessionId/complete', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = buildTestApp()
    await app.ready()
  })

  afterAll(() => app.close())

  beforeEach(() => {
    vi.clearAllMocks()
    mockCompleteSession.mockResolvedValue({
      id: 'api-sess-1',
      finalScore: 82,
      progressStatus: 'PASSED',
    })
    sessionStore.set(makeState())
  })

  afterEach(() => {
    sessionStore.delete(SESSION_ID)
  })

  it('returns 200 with finalScore, progressStatus, and turnCount', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.finalScore).toBe(82)
    expect(body.progressStatus).toBe('PASSED')
    expect(body.turnCount).toBe(7)
  })

  it('removes session from store after completion', async () => {
    await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })
    expect(sessionStore.get(SESSION_ID)).toBeUndefined()
  })

  it('calls apiClient.completeSession with the apiSessionId', async () => {
    await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })
    expect(mockCompleteSession).toHaveBeenCalledWith('api-sess-1')
  })

  it('finalScore is null when apiClient.completeSession throws', async () => {
    mockCompleteSession.mockRejectedValue(new Error('API error'))

    const res = await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().finalScore).toBeNull()
    expect(res.json().progressStatus).toBeNull()
  })

  it('session still deleted from store even when apiClient throws', async () => {
    mockCompleteSession.mockRejectedValue(new Error('API error'))

    await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })

    expect(sessionStore.get(SESSION_ID)).toBeUndefined()
  })

  it('does not call apiClient when apiSessionId is null', async () => {
    sessionStore.set(makeState({ apiSessionId: null }))

    await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })

    expect(mockCompleteSession).not.toHaveBeenCalled()
  })

  it('returns 404 for unknown agentSessionId', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/v1/sessions/nonexistent-session-id/complete',
    })

    expect(res.statusCode).toBe(404)
    expect(res.json().kind).toBe('SessionNotFoundError')
  })

  it('turnCount reflects actual turns before completion', async () => {
    sessionStore.set(makeState({ turnCount: 12 }))

    const res = await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })

    expect(res.json().turnCount).toBe(12)
  })

  it('triggers summarizer and creates session insight when interactions exist', async () => {
    sessionStore.set(
      makeState({
        apiSessionId: 'api-sess-1',
        interactions: [
          {
            userInput: 'Yesterday I go to school',
            leryResponse: 'We say "went". What did you learn?',
            grammaticalFixes: 'Yesterday I went to school',
          },
        ],
      }),
    )

    const res = await app.inject({
      method: 'PATCH',
      url: `/v1/sessions/${SESSION_ID}/complete`,
    })

    expect(res.statusCode).toBe(200)
    expect(mockSummarizeSession).toHaveBeenCalledWith(
      'api-sess-1',
      expect.any(Array),
    )
  })
})
