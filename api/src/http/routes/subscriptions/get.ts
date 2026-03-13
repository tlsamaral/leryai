import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.string(),
  planType: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
})

export async function getSubscription(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        tags: ['Subscriptions'],
        summary: 'Get subscription',
        params: paramsSchema,
        response: { 200: responseSchema },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params)
      const s = await prisma.subscription.findUnique({ where: { id } })
      if (!s) throw new BadRequestError('Subscription not found')
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
