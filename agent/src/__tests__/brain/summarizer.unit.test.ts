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
    .mockReturnValue({ inputTokens: 120, outputTokens: 40, totalTokens: 160 }),
}))

import { Summarizer } from '@/brain/summarizer.js'

function makeResponse(json: object): { response: { text: () => string } } {
  return { response: { text: () => JSON.stringify(json) } }
}

describe('Summarizer.summarizeSession', () => {
  let summarizer: Summarizer

  beforeEach(() => {
    summarizer = new Summarizer()
    mockGenerateContent.mockReset()
  })

  it('returns null when interactions array is empty', async () => {
    const result = await summarizer.summarizeSession('sess-1', [])
    expect(result).toBeNull()
    expect(mockGenerateContent).not.toHaveBeenCalled()
  })

  it('generates a 3-bullet insight card on valid transcript', async () => {
    const mockInsight = {
      topError: 'Confused simple past with past continuous ("I was went").',
      topProgress: 'Comfortably used "although" to link contrasting ideas.',
      openTopic: 'Planning a trip to Buenos Aires in October.',
    }
    mockGenerateContent.mockResolvedValueOnce(makeResponse(mockInsight))

    const result = await summarizer.summarizeSession('sess-1', [
      {
        userInput:
          'Yesterday I was went to the market although it was raining.',
        leryResponse:
          'Great sentence! Just say "I went" instead of "I was went". What did you buy?',
        grammaticalFixes:
          'Yesterday I went to the market although it was raining.',
      },
    ])

    expect(result).not.toBeNull()
    expect(result?.topError).toBe(mockInsight.topError)
    expect(result?.topProgress).toBe(mockInsight.topProgress)
    expect(result?.openTopic).toBe(mockInsight.openTopic)
  })

  it('handles null openTopic when student mentioned no personal topics', async () => {
    const mockInsight = {
      topError: 'Pronunciation of regular past -ed.',
      topProgress: 'Great vocabulary range.',
      openTopic: null,
    }
    mockGenerateContent.mockResolvedValueOnce(makeResponse(mockInsight))

    const result = await summarizer.summarizeSession('sess-1', [
      {
        userInput: 'I played football.',
        leryResponse: 'Nice! With whom?',
      },
    ])

    expect(result?.openTopic).toBeNull()
  })

  it('returns null gracefully on LLM error', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('Quota limit'))

    const result = await summarizer.summarizeSession('sess-1', [
      { userInput: 'hi', leryResponse: 'hello' },
    ])

    expect(result).toBeNull()
  })
})
