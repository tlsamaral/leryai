import { describe, expect, it, vi } from 'vitest'

vi.mock('@/env.js', () => ({
  env: {
    GOOGLE_API_KEY: 'test-key',
    GEMINI_TUTOR_MODEL: 'gemini-2.5-flash',
    GEMINI_EVALUATOR_MODEL: 'gemini-2.5-flash',
    TUTOR_HARD_TIMEOUT_MS: 10000,
    TUTOR_MAX_RETRIES: 4,
    LERY_API_URL: 'http://localhost:3333',
    LERY_DEVICE_API_KEY: 'test-device-key',
    PORT: 3334,
    HOST: '0.0.0.0',
  },
}))

import {
  _RETRYABLE_CODES,
  backoffMs,
  isRetryable,
  withTimeout,
} from '@/lib/gemini.js'

describe('isRetryable', () => {
  it('returns true for 429 in message', () => {
    expect(isRetryable(new Error('Rate limit 429 exceeded'))).toBe(true)
  })

  it('returns true for 500 in message', () => {
    expect(isRetryable(new Error('Internal Server Error 500'))).toBe(true)
  })

  it('returns true for 503 in message', () => {
    expect(isRetryable(new Error('Service unavailable 503'))).toBe(true)
  })

  it('returns false for 404', () => {
    expect(isRetryable(new Error('Not found 404'))).toBe(false)
  })

  it('returns false for unrelated error', () => {
    expect(isRetryable(new Error('JSON parse error'))).toBe(false)
  })

  it('accepts non-Error (stringified)', () => {
    expect(isRetryable('503 error')).toBe(true)
    expect(isRetryable('unknown')).toBe(false)
  })

  it('_RETRYABLE_CODES contains exactly 429, 500, 503', () => {
    expect(_RETRYABLE_CODES).toEqual(new Set([429, 500, 503]))
  })
})

describe('backoffMs', () => {
  it('attempt 0 returns baseMs', () => {
    expect(backoffMs(0, 1000)).toBe(1000)
  })

  it('attempt 1 returns 2x baseMs', () => {
    expect(backoffMs(1, 1000)).toBe(2000)
  })

  it('attempt 2 returns 4x baseMs', () => {
    expect(backoffMs(2, 1000)).toBe(4000)
  })

  it('attempt 3 returns 8x baseMs', () => {
    expect(backoffMs(3, 1000)).toBe(8000)
  })

  it('uses default baseMs of 1000', () => {
    expect(backoffMs(0)).toBe(1000)
  })
})

describe('withTimeout', () => {
  it('resolves when promise settles before deadline', async () => {
    const result = await withTimeout(Promise.resolve('ok'), 1000)
    expect(result).toBe('ok')
  })

  it('rejects with timeout message when promise exceeds deadline', async () => {
    const never = new Promise<string>(() => {})
    await expect(withTimeout(never, 10, 'tutor')).rejects.toThrow(
      'tutor timed out after 10ms',
    )
  })

  it('uses label in timeout error message', async () => {
    const never = new Promise<string>(() => {})
    await expect(withTimeout(never, 10, 'evaluator')).rejects.toThrow(
      'evaluator timed out after 10ms',
    )
  })

  it('propagates rejection from the original promise', async () => {
    const failing = Promise.reject(new Error('gemini error'))
    await expect(withTimeout(failing, 1000)).rejects.toThrow('gemini error')
  })
})
