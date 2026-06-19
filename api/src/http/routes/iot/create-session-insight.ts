import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function iotCreateSessionInsight(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/session-insights',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'Persist a session insight card produced by the Summarizer',
        description:
          'Called by the Agent at the end of each session. Stores the 3-bullet compacted memory for cross-session recall.',
        security: [{ bearerAuth: [] }],
        body: z.object({
          sessionId: z.string().uuid(),
          topError: z.string(),
          topProgress: z.string(),
          openTopic: z.string().nullable().optional(),
        }),
        response: {
          201: z.object({
            id: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { sessionId, topError, topProgress, openTopic } = request.body

      const session = await prisma.conversationSession.findUnique({
        where: { id: sessionId },
      })
      if (!session) throw new NotFoundError('Session not found')
      if (session.userId !== userId) throw new BadRequestError('Access denied')

      const insight = await prisma.sessionInsight.upsert({
        where: { sessionId },
        create: {
          userId,
          sessionId,
          topError,
          topProgress,
          openTopic: openTopic ?? null,
        },
        update: {
          topError,
          topProgress,
          openTopic: openTopic ?? null,
        },
      })

      return reply.status(201).send({ id: insight.id })
    },
  )
}
