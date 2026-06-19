import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { SessionNotFoundError } from '@/errors.js'
import { apiClient } from '@/lib/api-client.js'
import { sessionStore } from '@/session-store/index.js'

export async function completeSessionRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/sessions/:agentSessionId/complete',
    {
      schema: {
        tags: ['Agent / v1'],
        summary: 'Mark an agent session as completed',
        description:
          'Closes the API-side session (averages scores, applies progress rule) and removes the in-memory agent session. The Summarizer worker will be triggered in a future iteration.',
        params: z.object({
          agentSessionId: z.string(),
        }),
        response: {
          200: z.object({
            finalScore: z.number().nullable(),
            progressStatus: z.string().nullable(),
            turnCount: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { agentSessionId } = request.params
      const state = sessionStore.get(agentSessionId)
      if (!state) throw new SessionNotFoundError(agentSessionId)

      let finalScore: number | null = null
      let progressStatus: string | null = null

      if (state.apiSessionId) {
        try {
          const result = await apiClient.completeSession(state.apiSessionId)
          finalScore = result.finalScore
          progressStatus = result.progressStatus
        } catch (err) {
          app.log.warn({ err }, 'completeSession against API failed')
        }
      }

      sessionStore.delete(agentSessionId)

      return reply.status(200).send({
        finalScore,
        progressStatus,
        turnCount: state.turnCount,
      })
    },
  )
}
