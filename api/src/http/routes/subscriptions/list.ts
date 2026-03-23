import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listSubscriptions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Subscriptions'],
        summary: 'List subscriptions for authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              userId: z.string(),
              status: z.string(),
              planType: z.string(),
              expiresAt: z.string(),
              createdAt: z.string(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const subs = await prisma.subscription.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      return reply.status(200).send(
        subs.map((s) => ({
          id: s.id,
          userId: s.userId,
          status: s.status,
          planType: s.planType,
          expiresAt: s.expiresAt.toISOString(),
          createdAt: s.createdAt.toISOString(),
        })),
      )
    },
  )
}
