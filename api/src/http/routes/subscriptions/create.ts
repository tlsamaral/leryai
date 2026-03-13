import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ userId: z.string(), status: z.string(), planType: z.string(), expiresAt: z.string() })
const responseSchema = z.object({ id: z.string() })

export async function createSubscription(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['Subscriptions'], summary: 'Create subscription', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = bodySchema.parse(request.body as unknown)
      const expiresAt = new Date(payload.expiresAt)
      const sub = await prisma.subscription.create({ data: { userId: payload.userId, status: payload.status as any, planType: payload.planType, expiresAt } })
      return reply.status(201).send({ id: sub.id })
    },
  )
}
