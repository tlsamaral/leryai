import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const responseSchema = z.array(
  z.object({
    id: z.string(),
    userId: z.string(),
    status: z.string(),
    planType: z.string(),
    expiresAt: z.string(),
    createdAt: z.string(),
  }),
)

export async function listSubscriptions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    { schema: { tags: ['Subscriptions'], summary: 'List subscriptions', response: { 200: responseSchema } } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const subs = await prisma.subscription.findMany({ orderBy: { createdAt: 'desc' } })
      return reply.status(200).send(
        subs.map((s) => ({ id: s.id, userId: s.userId, status: s.status, planType: s.planType, expiresAt: s.expiresAt.toISOString(), createdAt: s.createdAt.toISOString() })),
      )
    },
  )
}
