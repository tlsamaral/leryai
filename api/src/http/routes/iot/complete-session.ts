import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { applyProgressRule } from '@/core/progress-rule.js'
import { prisma } from '@/lib/prisma.js'

export async function iotCompleteSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/sessions/:id/complete',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'Finalize a session and compute final score',
        description:
          'Called when the user ends the conversation. Averages interaction scores, applies the 70% progress rule for GUIDED_LESSON, and sets endedAt.',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            endedAt: z.string(),
            finalScore: z.number().nullable(),
            progressStatus: z
              .enum(['LOCKED', 'IN_PROGRESS', 'REVIEW_REQUIRED', 'COMPLETED'])
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { id } = request.params

      const session = await prisma.conversationSession.findUnique({
        where: { id },
        include: { interactions: { select: { totalScore: true } } },
      })

      if (!session) throw new NotFoundError('Session not found')
      if (session.userId !== userId) throw new BadRequestError('Access denied')
      if (session.endedAt) throw new BadRequestError('Session already completed')

      const endedAt = new Date()
      await prisma.conversationSession.update({ where: { id }, data: { endedAt } })

      let finalScore: number | null = null
      let progressStatus = null

      if (session.mode === 'GUIDED_LESSON' && session.lessonId) {
        const scores = session.interactions
          .map((i) => i.totalScore)
          .filter((s): s is number => s !== null)

        if (scores.length > 0) {
          finalScore = Math.round(scores.reduce((a, s) => a + s, 0) / scores.length)
          const result = await applyProgressRule(userId, session.lessonId, finalScore)
          progressStatus = result.status
        }
      }

      return reply.status(200).send({
        id,
        endedAt: endedAt.toISOString(),
        finalScore,
        progressStatus,
      })
    },
  )
}
