import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { buildDiagnosisPrompt } from '@/brain/prompts/diagnosis.js'
import { buildLearnerSnapshot } from '@/brain/prompts/learner-snapshot.js'
import { buildPersona } from '@/brain/prompts/persona.js'
import { buildSessionState } from '@/brain/prompts/session-state.js'
import { Tutor } from '@/brain/tutor.js'
import { apiClient } from '@/lib/api-client.js'
import { sessionStore } from '@/session-store/index.js'

const ModeSchema = z.enum(['FREE_TALK', 'GUIDED_LESSON', 'DIAGNOSIS'])

export async function createSessionRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        tags: ['Agent / v1'],
        summary: 'Open a new agent session',
        description:
          'Fetches session config + learner snapshot + recent insights from the Lery API, assembles a layered system prompt, and seeds the Tutor with it. Returns an agentSessionId used by subsequent turn calls.',
        body: z.object({
          mode: ModeSchema.default('FREE_TALK'),
        }),
        response: {
          201: z.object({
            agentSessionId: z.string(),
            apiSessionId: z.string().nullable(),
            mode: ModeSchema,
            userId: z.string(),
            level: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { mode } = request.body

      // ── Layer 1: pull external context in parallel ─────────────────────
      const [config, snapshot, insightsRes] = await Promise.all([
        apiClient.getSessionConfig(),
        apiClient.getLearnerSnapshot().catch(() => null),
        apiClient.listSessionInsights(3).catch(() => ({ insights: [] })),
      ])

      const lessonObjectives =
        mode === 'GUIDED_LESSON' && config.lesson?.objectives
          ? config.lesson.objectives
          : null

      // ── Layer 2: open API-side session, get persistent sessionId ───────
      let apiSession: { id: string } | null = null
      try {
        apiSession = await apiClient.createSession({
          mode,
          lessonId:
            mode === 'GUIDED_LESSON' ? (config.lesson?.id ?? null) : null,
        })
      } catch (err) {
        app.log.warn(
          { err },
          'Agent could not open API session — continuing offline',
        )
      }

      // ── Layer 3: assemble layered system prompt ────────────────────────
      const systemInstruction =
        mode === 'DIAGNOSIS'
          ? buildDiagnosisPrompt()
          : [
              buildPersona(),
              buildLearnerSnapshot(config, snapshot, insightsRes.insights),
              buildSessionState(config, mode, null),
              mode === 'GUIDED_LESSON' && config.lesson?.systemPrompt
                ? `LESSON SYSTEM PROMPT (overrides general behavior for this lesson):\n${config.lesson.systemPrompt}`
                : '',
            ]
              .filter(Boolean)
              .join('\n\n')

      const tutor = new Tutor({ systemInstruction })

      const agentSessionId = randomUUID()

      sessionStore.set({
        agentSessionId,
        apiSessionId: apiSession?.id ?? null,
        userId: config.userId,
        mode,
        tutor,
        config,
        lessonObjectives,
        startedAt: Date.now(),
        turnCount: 0,
      })

      return reply.status(201).send({
        agentSessionId,
        apiSessionId: apiSession?.id ?? null,
        mode,
        userId: config.userId,
        level: config.level,
      })
    },
  )
}
