import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

const subscriptionStatusSchema = z.enum([
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'EXPIRED',
])

export async function updateSubscription(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Subscriptions'],
        summary: 'Update subscription',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          status: subscriptionStatusSchema.optional(),
          planType: z.string().min(1).optional(),
          expiresAt: z.string().datetime().optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const s = await prisma.subscription.findUnique({ where: { id } })
      if (!s) throw new NotFoundError('Subscription not found')
      if (s.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      const { status, planType, expiresAt } = request.body
      const updated = await prisma.subscription.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(planType && { planType }),
          ...(expiresAt && { expiresAt: new Date(expiresAt) }),
        },
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
