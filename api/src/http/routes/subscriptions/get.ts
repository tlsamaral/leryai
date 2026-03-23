import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getSubscription(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Subscriptions'],
        summary: 'Get subscription',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            userId: z.string(),
            status: z.string(),
            planType: z.string(),
            expiresAt: z.string(),
            createdAt: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const s = await prisma.subscription.findUnique({ where: { id } })
      if (!s) throw new NotFoundError('Subscription not found')
      if (s.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      return reply.status(200).send({
        id: s.id,
        userId: s.userId,
        status: s.status,
        planType: s.planType,
        expiresAt: s.expiresAt.toISOString(),
        createdAt: s.createdAt.toISOString(),
      })
    },
  )
}
