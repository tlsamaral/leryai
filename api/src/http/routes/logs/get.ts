import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['InteractionLogs'],
        summary: 'Get interaction log',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            sessionId: z.string(),
            userAudioTrans: z.string().nullable(),
            leryResponse: z.string().nullable(),
            grammaticalFixes: z.string().nullable(),
            sentimentScore: z.number().nullable(),
            createdAt: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const item = await prisma.interactionLog.findUnique({
        where: { id },
        include: { session: true },
      })
      if (!item) throw new NotFoundError('InteractionLog not found')
      if (item.session.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      return reply.status(200).send({
        id: item.id,
        sessionId: item.sessionId,
        userAudioTrans: item.userAudioTrans,
        leryResponse: item.leryResponse,
        grammaticalFixes: item.grammaticalFixes,
        sentimentScore: item.sentimentScore,
        createdAt: item.createdAt.toISOString(),
      })
    },
  )
}
