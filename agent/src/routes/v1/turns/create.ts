import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { Evaluator } from '@/brain/evaluator.js'
import { BadRequestError, SessionNotFoundError } from '@/errors.js'
import { apiClient } from '@/lib/api-client.js'
import { sessionStore } from '@/session-store/index.js'

const evaluator = new Evaluator()

export async function createTurnRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/turns',
    {
      schema: {
        tags: ['Agent / v1'],
        summary: 'Process one conversation turn',
        description:
          'Accepts transcribed user text, runs the Tutor (chat history kept in-memory per session), optionally runs the Evaluator (GUIDED_LESSON only), persists the InteractionLog via the Lery API, and returns the Tutor reply plus scores.',
        body: z.object({
          agentSessionId: z.string(),
          userText: z.string().min(1),
          evaluate: z.boolean().optional(),
        }),
        response: {
          200: z.object({
            reply: z.string(),
            attempts: z.number(),
            latencyMs: z.number(),
            evaluation: z
              .object({
                task_achievement: z.number(),
                grammar: z.number(),
                vocabulary: z.number(),
                fluency: z.number(),
                total_score: z.number(),
                grammatical_fixes: z.string(),
                reasoning: z.string(),
              })
              .nullable(),
            logId: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { agentSessionId, userText, evaluate } = request.body
      const state = sessionStore.get(agentSessionId)
      if (!state) throw new SessionNotFoundError(agentSessionId)

      if (!userText.trim()) {
        throw new BadRequestError('userText cannot be empty')
      }

      // ── Tutor reply ────────────────────────────────────────────────────
      const tutorReply = await state.tutor.reply(userText)
      state.turnCount += 1

      // ── Evaluator (only when explicitly requested or in GUIDED_LESSON) ─
      const shouldEvaluate = evaluate ?? state.mode === 'GUIDED_LESSON'
      const evaluation = shouldEvaluate
        ? await evaluator.evaluateTurn({
            userInput: userText,
            leryResponse: tutorReply.text,
            lessonObjectives: state.lessonObjectives ?? undefined,
          })
        : null

      // ── Persist log ────────────────────────────────────────────────────
      let logId: string | null = null
      if (state.apiSessionId) {
        try {
          const logRes = await apiClient.createLog({
            sessionId: state.apiSessionId,
            userAudioTrans: userText,
            leryResponse: tutorReply.text,
            grammaticalFixes: evaluation?.grammatical_fixes,
            taskAchievement: evaluation?.task_achievement,
            grammar: evaluation?.grammar,
            vocabulary: evaluation?.vocabulary,
            fluency: evaluation?.fluency,
            totalScore: evaluation?.total_score,
            evaluationReasoning: evaluation?.reasoning,
          })
          logId = logRes.id
        } catch (err) {
          app.log.warn({ err }, 'Failed to persist interaction log')
        }
      }

      return reply.status(200).send({
        reply: tutorReply.text,
        attempts: tutorReply.attempts,
        latencyMs: tutorReply.latencyMs,
        evaluation,
        logId,
      })
    },
  )
}
