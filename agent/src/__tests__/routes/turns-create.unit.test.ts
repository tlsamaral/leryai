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

const {
  mockTutorReply,
  mockTutorRetry,
  mockEvaluatorTurn,
  mockCreateLog,
  mockComplianceCheck,
} = vi.hoisted(() => ({
  mockTutorReply: vi.fn(),
  mockTutorRetry: vi.fn(),
  mockEvaluatorTurn: vi.fn(),
  mockCreateLog: vi.fn(),
  mockComplianceCheck: vi
    .fn()
    .mockResolvedValue({ compliant: true, violations: [] }),
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
  apiClient: {
    getSessionConfig: vi.fn(),
    getLearnerSnapshot: vi.fn(),
    listSessionInsights: vi.fn(),
    createSession: vi.fn(),
    createLog: mockCreateLog,
    completeSession: vi.fn(),
  },
}))

vi.mock('@/brain/tutor.js', () => ({
  Tutor: vi.fn().mockImplementation(function MockTutor(this: unknown) {
    return { reply: mockTutorReply, retryWithFeedback: mockTutorRetry }
  }),
}))

vi.mock('@/brain/evaluator.js', () => ({
  Evaluator: vi.fn().mockImplementation(function MockEvaluator(this: unknown) {
    return { evaluateTurn: mockEvaluatorTurn }
  }),
}))

vi.mock('@/brain/compliance.js', () => ({
  ComplianceEvaluator: vi
    .fn()
    .mockImplementation(function MockComplianceEvaluator(this: unknown) {
      return { check: mockComplianceCheck }
    }),
}))

// ── Imports ───────────────────────────────────────────────────────────────────

import type { SessionState } from '@/session-store/index.js'
import { sessionStore } from '@/session-store/index.js'
import { buildTestApp } from '../helpers/test-app.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

const SESSION_ID = 'test-session-001'

function makeState(overrides: Partial<SessionState> = {}): SessionState {
  return {
    agentSessionId: SESSION_ID,
    apiSessionId: 'api-sess-1',
    userId: 'user-1',
    mode: 'FREE_TALK',
    tutor: {
      reply: mockTutorReply,
      retryWithFeedback: mockTutorRetry,
    } as never,
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
    turnCount: 0,
    lastActivityAt: Date.now(),
    interactions: [],
    ...overrides,
  }
}

const EVAL_RESULT = {
  task_achievement: 20,
  grammar: 18,
  vocabulary: 17,
  fluency: 19,
  total_score: 74,
  grammatical_fixes: 'No corrections needed.',
  reasoning: 'Good effort.',
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('POST /v1/turns', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = buildTestApp()
    await app.ready()
  })

  afterAll(() => app.close())

  beforeEach(() => {
    vi.clearAllMocks()
    mockTutorReply.mockResolvedValue({
      text: 'Hello!',
      attempts: 1,
      latencyMs: 100,
    })
    mockEvaluatorTurn.mockResolvedValue(EVAL_RESULT)
    mockCreateLog.mockResolvedValue({ id: 'log-1', progressStatus: null })
    sessionStore.set(makeState())
  })

  afterEach(() => {
    sessionStore.delete(SESSION_ID)
  })

  it('returns 200 with reply and null evaluation in FREE_TALK', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'Hi there' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.reply).toBe('Hello!')
    expect(body.attempts).toBe(1)
    expect(body.latencyMs).toBe(100)
    expect(body.evaluation).toBeNull()
  })

  it('does not call evaluator in FREE_TALK by default', async () => {
    await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'Hi there' },
    })
    expect(mockEvaluatorTurn).not.toHaveBeenCalled()
  })

  it('calls evaluator in GUIDED_LESSON automatically', async () => {
    sessionStore.set(
      makeState({ mode: 'GUIDED_LESSON', lessonObjectives: 'Use past tense.' }),
    )

    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'I went to school.' },
    })

    expect(mockEvaluatorTurn).toHaveBeenCalledOnce()
    expect(res.json().evaluation).not.toBeNull()
    expect(res.json().evaluation.grammar).toBe(18)
  })

  it('calls evaluator when evaluate:true in FREE_TALK', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'Hello', evaluate: true },
    })

    expect(mockEvaluatorTurn).toHaveBeenCalledOnce()
    expect(res.json().evaluation).not.toBeNull()
  })

  it('passes lessonObjectives to evaluator', async () => {
    sessionStore.set(
      makeState({
        mode: 'GUIDED_LESSON',
        lessonObjectives: 'Use present perfect.',
      }),
    )

    await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'I have studied.' },
    })

    expect(mockEvaluatorTurn).toHaveBeenCalledWith(
      expect.objectContaining({ lessonObjectives: 'Use present perfect.' }),
    )
  })

  it('turnCount increments after each turn', async () => {
    await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'turn 1' },
    })
    await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'turn 2' },
    })

    expect(sessionStore.get(SESSION_ID)?.turnCount).toBe(2)
  })

  it('persists log with apiSessionId', async () => {
    await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'test' },
    })

    expect(mockCreateLog).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: 'api-sess-1',
        userAudioTrans: 'test',
      }),
    )
  })

  it('logId is returned from createLog', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'test' },
    })
    expect(res.json().logId).toBe('log-1')
  })

  it('logId is null when createLog throws (non-fatal)', async () => {
    mockCreateLog.mockRejectedValue(new Error('DB unavailable'))

    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'test' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().logId).toBeNull()
  })

  it('does not persist log when apiSessionId is null', async () => {
    sessionStore.set(makeState({ apiSessionId: null }))

    await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'test' },
    })

    expect(mockCreateLog).not.toHaveBeenCalled()
  })

  it('returns 404 for unknown agentSessionId', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: 'nonexistent-id', userText: 'hi' },
    })

    expect(res.statusCode).toBe(404)
    expect(res.json().kind).toBe('SessionNotFoundError')
  })

  it('returns 400 for whitespace-only userText', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: '   ' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('triggers compliance check and retries with feedback when A1 level draft has violations', async () => {
    sessionStore.set(
      makeState({
        config: {
          level: 'A1',
          userId: 'user-1',
          deviceId: 'd',
          diagnosisCompleted: true,
          lesson: null,
          module: null,
          profile: null,
        },
      }),
    )

    mockComplianceCheck.mockResolvedValueOnce({
      compliant: false,
      violations: [
        {
          type: 'GRAMMAR_TOO_ADVANCED',
          snippet: 'If I had been there',
          reason: 'Too complex for A1',
          suggestion: 'Use simple present',
        },
      ],
    })

    mockTutorRetry.mockResolvedValueOnce({
      text: 'I am happy. Do you like school?',
      attempts: 1,
      latencyMs: 80,
    })

    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'Hello teacher' },
    })

    expect(res.statusCode).toBe(200)
    expect(mockComplianceCheck).toHaveBeenCalledOnce()
    expect(mockTutorRetry).toHaveBeenCalledOnce()
    expect(res.json().reply).toBe('I am happy. Do you like school?')
  })

  it('does not retry when A1 draft is already compliant', async () => {
    sessionStore.set(
      makeState({
        config: {
          level: 'A1',
          userId: 'user-1',
          deviceId: 'd',
          diagnosisCompleted: true,
          lesson: null,
          module: null,
          profile: null,
        },
      }),
    )

    mockComplianceCheck.mockResolvedValueOnce({
      compliant: true,
      violations: [],
    })

    const res = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: { agentSessionId: SESSION_ID, userText: 'Hello teacher' },
    })

    expect(res.statusCode).toBe(200)
    expect(mockComplianceCheck).toHaveBeenCalledOnce()
    expect(mockTutorRetry).not.toHaveBeenCalled()
  })

  it('enforces compliance check when enforceCompliance is true even on B1', async () => {
    sessionStore.set(
      makeState({
        config: {
          level: 'B1',
          userId: 'user-1',
          deviceId: 'd',
          diagnosisCompleted: true,
          lesson: null,
          module: null,
          profile: null,
        },
      }),
    )
    mockComplianceCheck.mockResolvedValueOnce({
      compliant: true,
      violations: [],
    })

    await app.inject({
      method: 'POST',
      url: '/v1/turns',
      body: {
        agentSessionId: SESSION_ID,
        userText: 'Hello',
        enforceCompliance: true,
      },
    })

    expect(mockComplianceCheck).toHaveBeenCalledOnce()
  })
})
