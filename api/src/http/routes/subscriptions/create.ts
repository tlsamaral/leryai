import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

const subscriptionStatusSchema = z.enum([
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'EXPIRED',
])

export async function createSubscription(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Subscriptions'],
        summary: 'Create subscription for authenticated user',
        security: [{ bearerAuth: [] }],
        body: z.object({
          status: subscriptionStatusSchema,
          planType: z.string().min(1),
          expiresAt: z.string().datetime(),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { status, planType, expiresAt } = request.body
      const sub = await prisma.subscription.create({
        data: { userId, status, planType, expiresAt: new Date(expiresAt) },
      })
      return reply.status(201).send({ id: sub.id })
    },
  )
}
