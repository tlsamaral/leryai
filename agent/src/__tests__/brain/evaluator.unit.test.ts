import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockGenerateContent, mockSleep } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
  mockSleep: vi.fn().mockResolvedValue(undefined),
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
    getGenerativeModel: vi.fn().mockReturnValue({ generateContent: mockGenerateContent }),
  },
  isRetryable: (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    return ['429', '500', '503'].some((c) => msg.includes(c))
  },
  sleep: mockSleep,
  backoffMs: vi.fn().mockReturnValue(0),
}))

import { Evaluator } from '@/brain/evaluator.js'

function makeResponse(json: object): { response: { text: () => string } } {
  return { response: { text: () => JSON.stringify(json) } }
}

const VALID_SCORES = {
  task_achievement: 20,
  grammar: 18,
  vocabulary: 17,
  fluency: 19,
  total_score: 74,
  grammatical_fixes: 'No corrections needed.',
  reasoning: 'Good vocabulary usage; improve sentence variety.',
}

describe('Evaluator.evaluateTurn', () => {
  let evaluator: Evaluator

  beforeEach(() => {
    evaluator = new Evaluator()
    mockGenerateContent.mockReset()
    mockSleep.mockReset()
    mockSleep.mockResolvedValue(undefined)
  })

  it('returns all 4 pillars on happy path', async () => {
    mockGenerateContent.mockResolvedValueOnce(makeResponse(VALID_SCORES))
    const result = await evaluator.evaluateTurn({
      userInput: 'I go to school yesterday.',
      leryResponse: 'Great effort!',
    })
    expect(result).not.toBeNull()
    expect(result?.task_achievement).toBe(20)
    expect(result?.grammar).toBe(18)
    expect(result?.vocabulary).toBe(17)
    expect(result?.fluency).toBe(19)
  })

  it('total_score equals sum of 4 pillars regardless of LLM value', async () => {
    mockGenerateContent.mockResolvedValueOnce(
      makeResponse({ ...VALID_SCORES, total_score: 999 }),
    )
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result?.total_score).toBe(
      result!.task_achievement + result!.grammar + result!.vocabulary + result!.fluency,
    )
  })

  it('clamps pillar value 999 to 25', async () => {
    mockGenerateContent.mockResolvedValueOnce(
      makeResponse({ ...VALID_SCORES, grammar: 999 }),
    )
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result?.grammar).toBe(25)
  })

  it('clamps negative pillar to 0', async () => {
    mockGenerateContent.mockResolvedValueOnce(
      makeResponse({ ...VALID_SCORES, fluency: -5 }),
    )
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result?.fluency).toBe(0)
  })

  it('strips markdown code fences from JSON response', async () => {
    const raw = '```json\n' + JSON.stringify(VALID_SCORES) + '\n```'
    mockGenerateContent.mockResolvedValueOnce({ response: { text: () => raw } })
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result).not.toBeNull()
    expect(result?.grammar).toBe(18)
  })

  it('returns null on non-JSON response', async () => {
    mockGenerateContent.mockResolvedValueOnce({ response: { text: () => 'plain prose here' } })
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result).toBeNull()
  })

  it('includes lessonObjectives in prompt when provided', async () => {
    mockGenerateContent.mockResolvedValueOnce(makeResponse(VALID_SCORES))
    await evaluator.evaluateTurn({
      userInput: 'test',
      leryResponse: 'ok',
      lessonObjectives: 'Use past tense correctly.',
    })
    const promptArg: string = mockGenerateContent.mock.calls[0][0]
    expect(promptArg).toContain('LESSON OBJECTIVES')
    expect(promptArg).toContain('Use past tense correctly.')
  })

  it('omits lesson objectives section when not provided', async () => {
    mockGenerateContent.mockResolvedValueOnce(makeResponse(VALID_SCORES))
    await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    const promptArg: string = mockGenerateContent.mock.calls[0][0]
    expect(promptArg).not.toContain('LESSON OBJECTIVES')
  })

  it('retries on 429 error and returns result on second attempt', async () => {
    mockGenerateContent
      .mockRejectedValueOnce(new Error('429 rate limit'))
      .mockResolvedValueOnce(makeResponse(VALID_SCORES))
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result).not.toBeNull()
    expect(mockGenerateContent).toHaveBeenCalledTimes(2)
  })

  it('retries on 503 and 500 errors', async () => {
    mockGenerateContent
      .mockRejectedValueOnce(new Error('503 service unavailable'))
      .mockRejectedValueOnce(new Error('500 internal error'))
      .mockResolvedValueOnce(makeResponse(VALID_SCORES))
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result).not.toBeNull()
  })

  it('does not retry on non-retryable error', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('404 not found'))
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result).toBeNull()
    expect(mockGenerateContent).toHaveBeenCalledTimes(1)
  })

  it('returns null after exhausting all retries', async () => {
    mockGenerateContent.mockRejectedValue(new Error('503 always fails'))
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result).toBeNull()
    expect(mockGenerateContent).toHaveBeenCalledTimes(3) // TUTOR_MAX_RETRIES = 3
  })

  it('grammatical_fixes defaults to "No corrections needed." when missing', async () => {
    const { grammatical_fixes: _, ...rest } = VALID_SCORES
    mockGenerateContent.mockResolvedValueOnce(makeResponse(rest))
    const result = await evaluator.evaluateTurn({ userInput: 'test', leryResponse: 'ok' })
    expect(result?.grammatical_fixes).toBe('No corrections needed.')
  })
})
