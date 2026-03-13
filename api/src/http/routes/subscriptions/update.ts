import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ status: z.string().optional(), planType: z.string().optional(), expiresAt: z.string().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateSubscription(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['Subscriptions'], summary: 'Update subscription', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const s = await prisma.subscription.findUnique({ where: { id } })
      if (!s) throw new BadRequestError('Subscription not found')
      const data: any = {}
      if (payload.status) data.status = payload.status as any
      if (payload.planType) data.planType = payload.planType
      if (payload.expiresAt) data.expiresAt = new Date(payload.expiresAt)
      const updated = await prisma.subscription.update({ where: { id }, data })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
