import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function createLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['InteractionLogs'],
        summary: 'Create interaction log',
        security: [{ bearerAuth: [] }],
        body: z.object({
          sessionId: z.string().uuid(),
          userAudioTrans: z.string().optional(),
          leryResponse: z.string().optional(),
          grammaticalFixes: z.string().optional(),
          sentimentScore: z.number().min(-1).max(1).optional(),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const {
        sessionId,
        userAudioTrans,
        leryResponse,
        grammaticalFixes,
        sentimentScore,
      } = request.body
      const session = await prisma.conversationSession.findUnique({
        where: { id: sessionId },
      })
      if (!session) throw new NotFoundError('Session not found')
      if (session.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      const item = await prisma.interactionLog.create({
        data: {
          sessionId,
          userAudioTrans,
          leryResponse,
          grammaticalFixes,
          sentimentScore,
        },
      })
      return reply.status(201).send({ id: item.id })
    },
  )
}
