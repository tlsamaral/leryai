import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockSendMessage, mockStartChat, mockSleep } = vi.hoisted(() => ({
  mockSendMessage: vi.fn(),
  mockStartChat: vi.fn(),
  mockSleep: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/env.js', () => ({
  env: {
    GOOGLE_API_KEY: 'test-key',
    GEMINI_TUTOR_MODEL: 'test-tutor-model',
    GEMINI_EVALUATOR_MODEL: 'test-eval-model',
    LERY_API_URL: 'http://localhost:3333',
    LERY_DEVICE_API_KEY: 'test-device-key',
    TUTOR_HARD_TIMEOUT_MS: 100,
    TUTOR_MAX_RETRIES: 3,
    PORT: 3334,
    HOST: '0.0.0.0',
  },
}))

vi.mock('@/lib/gemini.js', () => ({
  genai: {
    getGenerativeModel: vi.fn().mockReturnValue({ startChat: mockStartChat }),
  },
  isRetryable: (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    return ['429', '500', '503'].some((c) => msg.includes(c))
  },
  sleep: mockSleep,
  backoffMs: vi.fn().mockReturnValue(0),
  withTimeout: vi.fn().mockImplementation((p: Promise<unknown>) => p),
  extractTokenUsage: vi
    .fn()
    .mockReturnValue({ inputTokens: 10, outputTokens: 5, totalTokens: 15 }),
}))

import { Tutor } from '@/brain/tutor.js'

function makeChat() {
  mockStartChat.mockReturnValue({ sendMessage: mockSendMessage })
}

function makeReply(text: string) {
  return { response: { text: () => text } }
}

describe('Tutor.reply', () => {
  beforeEach(() => {
    mockSendMessage.mockReset()
    mockStartChat.mockReset()
    mockSleep.mockReset()
    mockSleep.mockResolvedValue(undefined)
    makeChat()
  })

  it('returns text and attempts:1 on first success', async () => {
    mockSendMessage.mockResolvedValueOnce(makeReply('Hello!'))
    const tutor = new Tutor({ systemInstruction: 'You are a tutor.' })
    const result = await tutor.reply('hi')
    expect(result.text).toBe('Hello!')
    expect(result.attempts).toBe(1)
  })

  it('latencyMs is a non-negative number', async () => {
    mockSendMessage.mockResolvedValueOnce(makeReply('Hi!'))
    const tutor = new Tutor({ systemInstruction: 'prompt' })
    const result = await tutor.reply('hi')
    expect(result.latencyMs).toBeGreaterThanOrEqual(0)
  })

  it('retries on 429 and returns result on second attempt', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('429 rate limit'))
      .mockResolvedValueOnce(makeReply('Retry worked!'))
    const tutor = new Tutor({ systemInstruction: 'prompt' })
    const result = await tutor.reply('hi')
    expect(result.text).toBe('Retry worked!')
    expect(result.attempts).toBe(2)
  })

  it('attempts count reflects actual retry count', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('503'))
      .mockRejectedValueOnce(new Error('503'))
      .mockResolvedValueOnce(makeReply('Finally!'))
    const tutor = new Tutor({ systemInstruction: 'prompt' })
    const result = await tutor.reply('hi')
    expect(result.attempts).toBe(3)
  })

  it('throws on non-retryable error without retrying', async () => {
    mockSendMessage.mockRejectedValueOnce(new Error('invalid request'))
    const tutor = new Tutor({ systemInstruction: 'prompt' })
    await expect(tutor.reply('hi')).rejects.toThrow()
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })

  it('throws after exhausting all retries', async () => {
    mockSendMessage.mockRejectedValue(new Error('503 persistent'))
    const tutor = new Tutor({ systemInstruction: 'prompt' })
    await expect(tutor.reply('hi')).rejects.toThrow(/failed after/)
    expect(mockSendMessage).toHaveBeenCalledTimes(3) // TUTOR_MAX_RETRIES = 3
  })

  it('forwards history to startChat', () => {
    new Tutor({
      systemInstruction: 'prompt',
      history: [
        { role: 'user', content: 'Hello' },
        { role: 'model', content: 'Hi there!' },
      ],
    })
    const callArg = mockStartChat.mock.calls[0][0]
    expect(callArg.history).toHaveLength(2)
    expect(callArg.history[0]).toEqual({
      role: 'user',
      parts: [{ text: 'Hello' }],
    })
    expect(callArg.history[1]).toEqual({
      role: 'model',
      parts: [{ text: 'Hi there!' }],
    })
  })

  it('passes empty history when no seed history provided', () => {
    new Tutor({ systemInstruction: 'prompt' })
    const callArg = mockStartChat.mock.calls[0][0]
    expect(callArg.history).toEqual([])
  })

  it('timeout error triggers retry', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('tutor timed out after 100ms'))
      .mockResolvedValueOnce(makeReply('After timeout retry'))
    const tutor = new Tutor({ systemInstruction: 'prompt' })
    const result = await tutor.reply('hi')
    expect(result.text).toBe('After timeout retry')
    expect(result.attempts).toBe(2)
  })
})
