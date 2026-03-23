import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function deleteLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['InteractionLogs'],
        summary: 'Delete interaction log',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
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
      await prisma.interactionLog.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
