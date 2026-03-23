import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function updateSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['ConversationSessions'],
        summary: 'Update session (end it)',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ endedAt: z.string().datetime().optional() }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const s = await prisma.conversationSession.findUnique({ where: { id } })
      if (!s) throw new NotFoundError('ConversationSession not found')
      if (s.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      const updated = await prisma.conversationSession.update({
        where: { id },
        data: request.body.endedAt
          ? { endedAt: new Date(request.body.endedAt) }
          : {},
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
