import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '@/env.js'

export const genai = new GoogleGenerativeAI(env.GOOGLE_API_KEY)

export const _RETRYABLE_CODES = new Set([429, 500, 503])

export function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  for (const code of _RETRYABLE_CODES) {
    if (msg.includes(String(code))) return true
  }
  return false
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label = 'gemini',
): Promise<T> {
  let timer: NodeJS.Timeout | undefined
  try {
    return await Promise.race<T>([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${label} timed out after ${ms}ms`)),
          ms,
        )
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export function backoffMs(attempt: number, baseMs = 1000): number {
  return baseMs * 2 ** attempt
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
