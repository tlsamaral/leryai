import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['ConversationSessions'],
        summary: 'Get session',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            userId: z.string(),
            mode: z.string(),
            startedAt: z.string(),
            endedAt: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const s = await prisma.conversationSession.findUnique({ where: { id } })
      if (!s) throw new NotFoundError('ConversationSession not found')
      if (s.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      return reply.status(200).send({
        id: s.id,
        userId: s.userId,
        mode: s.mode,
        startedAt: s.startedAt.toISOString(),
        endedAt: s.endedAt?.toISOString() ?? null,
      })
    },
  )
}
