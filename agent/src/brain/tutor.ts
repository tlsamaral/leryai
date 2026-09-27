import type { ChatSession, FunctionDeclaration } from '@google/generative-ai'
import { env } from '@/env.js'
import {
  backoffMs,
  extractTokenUsage,
  genai,
  isRetryable,
  sleep,
  withTimeout,
} from '@/lib/gemini.js'
import { wrapWithTelemetry } from '@/lib/telemetry.js'
import {
  executePedagogicalTool,
  type PedagogicalToolContext,
} from './tools/pedagogical-tools.js'
import type { ChatTurn, TutorReply } from './types.js'

export interface TutorSeed {
  systemInstruction: string
  history?: ChatTurn[]
  tools?: FunctionDeclaration[]
  toolContext?: PedagogicalToolContext
}

export class Tutor {
  private readonly chat: ChatSession
  private readonly modelName: string
  private readonly toolContext?: PedagogicalToolContext

  constructor(seed: TutorSeed) {
    this.modelName = env.GEMINI_TUTOR_MODEL
    this.toolContext = seed.toolContext
    const model = genai.getGenerativeModel({
      model: this.modelName,
      systemInstruction: seed.systemInstruction,
      tools: seed.tools ? [{ functionDeclarations: seed.tools }] : undefined,
    })
    this.chat = model.startChat({
      history:
        seed.history?.map((h) => ({
          role: h.role,
          parts: [{ text: h.content }],
        })) ?? [],
    })
  }

  async reply(
    userInput: string,
    sessionId?: string | null,
  ): Promise<TutorReply> {
    const start = Date.now()
    let lastErr: unknown

    for (let attempt = 0; attempt < env.TUTOR_MAX_RETRIES; attempt++) {
      try {
        const { result } = await wrapWithTelemetry(
          'tutor',
          this.modelName,
          sessionId ?? null,
          () =>
            withTimeout(
              this.chat.sendMessage(userInput),
              env.TUTOR_HARD_TIMEOUT_MS,
              'tutor',
            ),
          (r) => extractTokenUsage(r.response),
        )
        const functionCalls = result.response.functionCalls?.()
        if (functionCalls && functionCalls.length > 0 && this.toolContext) {
          const call = functionCalls[0]
          const toolResult = executePedagogicalTool(
            call.name,
            call.args as Record<string, unknown>,
            this.toolContext,
          )
          const followUp = await withTimeout(
            this.chat.sendMessage([
              {
                functionResponse: {
                  name: call.name,
                  response: toolResult,
                },
              },
            ]),
            env.TUTOR_HARD_TIMEOUT_MS,
            'tutor-tool-followup',
          )
          return {
            text: followUp.response.text(),
            attempts: attempt + 1,
            latencyMs: Date.now() - start,
          }
        }

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

  async retryWithFeedback(
    feedback: string,
    sessionId?: string | null,
  ): Promise<TutorReply> {
    const prompt = `[CRITICAL PEDAGOGICAL CORRECTION] Your previous reply violated the student's level constraints:
${feedback}

Rewrite your reply immediately to strictly respect the sentence length and grammar level rules. Do NOT mention this correction in your reply, just respond naturally to the student.`
    return this.reply(prompt, sessionId)
  }
}
