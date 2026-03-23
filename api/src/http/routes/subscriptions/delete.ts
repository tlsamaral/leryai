import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function deleteSubscription(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Subscriptions'],
        summary: 'Delete subscription',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const s = await prisma.subscription.findUnique({ where: { id } })
      if (!s) throw new NotFoundError('Subscription not found')
      if (s.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      await prisma.subscription.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
