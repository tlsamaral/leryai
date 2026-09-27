import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}))

vi.mock('@/env.js', () => ({
  env: {
    GEMINI_EVALUATOR_MODEL: 'test-model',
  },
}))

vi.mock('@/lib/gemini.js', () => ({
  genai: {
    getGenerativeModel: vi
      .fn()
      .mockReturnValue({ generateContent: mockGenerateContent }),
  },
  extractTokenUsage: vi
    .fn()
    .mockReturnValue({ inputTokens: 50, outputTokens: 20, totalTokens: 70 }),
}))

import { ComplianceEvaluator } from '@/brain/compliance.js'

function makeResponse(json: object): { response: { text: () => string } } {
  return { response: { text: () => JSON.stringify(json) } }
}

describe('ComplianceEvaluator.check', () => {
  let evaluator: ComplianceEvaluator

  beforeEach(() => {
    evaluator = new ComplianceEvaluator()
    mockGenerateContent.mockReset()
  })

  it('returns compliant: true when draft respects level rules', async () => {
    mockGenerateContent.mockResolvedValueOnce(
      makeResponse({ compliant: true, violations: [] }),
    )

    const result = await evaluator.check({
      tutorReply: 'Hello! How are you today?',
      studentLevel: 'A1',
      userInput: 'Hi',
    })

    expect(result.compliant).toBe(true)
    expect(result.violations).toHaveLength(0)
  })

  it('returns compliant: false with violations when draft is too complex', async () => {
    mockGenerateContent.mockResolvedValueOnce(
      makeResponse({
        compliant: false,
        violations: [
          {
            type: 'GRAMMAR_TOO_ADVANCED',
            snippet: 'If you had arrived earlier, we would have started.',
            reason: 'Third conditional is far above A1 level.',
            suggestion: 'Use simple present: Please come early next time.',
          },
        ],
      }),
    )

    const result = await evaluator.check({
      tutorReply: 'If you had arrived earlier, we would have started.',
      studentLevel: 'A1',
      userInput: 'Sorry I am late',
    })

    expect(result.compliant).toBe(false)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0].type).toBe('GRAMMAR_TOO_ADVANCED')
  })

  it('falls back gracefully to compliant: true if LLM call fails', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Network failure'))

    const result = await evaluator.check({
      tutorReply: 'Some reply',
      studentLevel: 'A1',
      userInput: 'Hi',
    })

    expect(result.compliant).toBe(true)
    expect(result.violations).toHaveLength(0)
  })
})
