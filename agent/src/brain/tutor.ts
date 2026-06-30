import type { ChatSession } from '@google/generative-ai'
import { env } from '@/env.js'
import {
  backoffMs,
  genai,
  isRetryable,
  sleep,
  withTimeout,
} from '@/lib/gemini.js'
import type { ChatTurn, TutorReply } from './types.js'

export interface TutorSeed {
  systemInstruction: string
  history?: ChatTurn[]
}

export class Tutor {
  private readonly chat: ChatSession
  private readonly modelName: string

  constructor(seed: TutorSeed) {
    this.modelName = env.GEMINI_TUTOR_MODEL
    const model = genai.getGenerativeModel({
      model: this.modelName,
      systemInstruction: seed.systemInstruction,
    })
    this.chat = model.startChat({
      history:
        seed.history?.map((h) => ({
          role: h.role,
          parts: [{ text: h.content }],
        })) ?? [],
    })
  }

  async reply(userInput: string): Promise<TutorReply> {
    const start = Date.now()
    let lastErr: unknown

    for (let attempt = 0; attempt < env.TUTOR_MAX_RETRIES; attempt++) {
      try {
        const result = await withTimeout(
          this.chat.sendMessage(userInput),
          env.TUTOR_HARD_TIMEOUT_MS,
          'tutor',
        )
        const text = result.response.text()
        return {
          text,
          attempts: attempt + 1,
          latencyMs: Date.now() - start,
        }
      } catch (err) {
        lastErr = err
        const retryable =
          isRetryable(err) ||
          (err instanceof Error && err.message.includes('timed out'))
        if (!retryable || attempt === env.TUTOR_MAX_RETRIES - 1) break
        const wait = backoffMs(attempt)
        console.warn(
          `[Tutor] retry ${attempt + 1}/${env.TUTOR_MAX_RETRIES} in ${wait}ms: ${err}`,
        )
        await sleep(wait)
      }
    }
    throw new Error(
      `Tutor failed after ${env.TUTOR_MAX_RETRIES} attempts: ${lastErr}`,
    )
  }
}
