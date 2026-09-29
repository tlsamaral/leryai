import { trace } from '@opentelemetry/api'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ComplianceEvaluator } from '@/brain/compliance.js'
import { Evaluator } from '@/brain/evaluator.js'
import { BadRequestError, SessionNotFoundError } from '@/errors.js'
import { apiClient } from '@/lib/api-client.js'
import { sessionStore } from '@/session-store/index.js'

const evaluator = new Evaluator()
const complianceEvaluator = new ComplianceEvaluator()
const tracer = trace.getTracer('lery-agent')

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
          enforceCompliance: z.boolean().optional(),
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
      const { agentSessionId, userText, evaluate, enforceCompliance } =
        request.body
      const state = sessionStore.get(agentSessionId)
      if (!state) throw new SessionNotFoundError(agentSessionId)

      if (!userText.trim()) {
        throw new BadRequestError('userText cannot be empty')
      }

      // Root span for the whole turn — tutor/compliance/evaluator spans
      // (emitted by wrapWithTelemetry) nest under it automatically via
      // OTel's async context, giving a waterfall of exactly where a
      // turn's latency goes when viewed in Jaeger.
      return tracer.startActiveSpan('agent.turn', async (span) => {
        span.setAttribute('lery.session_id', agentSessionId)
        span.setAttribute('lery.mode', state.mode)
        span.setAttribute('lery.level', state.config.level)

        try {
          // ── 1. Tutor reply (draft) ───────────────────────────────────
          let tutorReply = await state.tutor.reply(userText, agentSessionId)
          state.turnCount += 1

          // ── 2 & 3. Compliance gate + Student Evaluator, concurrently ──
          // Both only depend on the draft reply, not on each other —
          // running them serially was one full extra Gemini round-trip
          // on every GUIDED_LESSON turn. Parallelizing collapses that to
          // the slower of the two instead of the sum.
          const shouldCheckCompliance =
            enforceCompliance ??
            (state.config.level === 'A1' || state.config.level === 'A2')
          const shouldEvaluate = evaluate ?? state.mode === 'GUIDED_LESSON'

          const [compliance, evaluation] = await Promise.all([
            shouldCheckCompliance
              ? complianceEvaluator.check({
                  tutorReply: tutorReply.text,
                  studentLevel: state.config.level,
                  userInput: userText,
                  lessonObjectives: state.lessonObjectives,
                })
              : Promise.resolve(null),
            shouldEvaluate
              ? evaluator.evaluateTurn({
                  userInput: userText,
                  leryResponse: tutorReply.text,
                  lessonObjectives: state.lessonObjectives ?? undefined,
                })
              : Promise.resolve(null),
          ])

          if (
            compliance &&
            !compliance.compliant &&
            compliance.violations.length > 0
          ) {
            const feedback = compliance.violations
              .map(
                (v) =>
                  `- [${v.type}] on "${v.snippet}": ${v.reason}. Suggestion: ${v.suggestion}`,
              )
              .join('\n')

            try {
              const revised = await state.tutor.retryWithFeedback(
                feedback,
                agentSessionId,
              )
              tutorReply = {
                text: revised.text,
                attempts: tutorReply.attempts + revised.attempts,
                latencyMs: tutorReply.latencyMs + revised.latencyMs,
              }
            } catch (retryErr) {
              app.log.warn(
                { retryErr },
                'Tutor compliance retry failed — proceeding with original draft',
              )
            }
          }

          // ── Persist log ─────────────────────────────────────────────
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

          // ── 4. Record interaction for Session Summarizer ────────────
          state.interactions.push({
            userInput: userText,
            leryResponse: tutorReply.text,
            grammaticalFixes: evaluation?.grammatical_fixes,
          })

          return reply.status(200).send({
            reply: tutorReply.text,
            attempts: tutorReply.attempts,
            latencyMs: tutorReply.latencyMs,
            evaluation,
            logId,
          })
        } finally {
          span.end()
        }
      })
    },
  )
}
