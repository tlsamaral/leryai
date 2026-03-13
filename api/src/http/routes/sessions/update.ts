import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ endedAt: z.string().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['ConversationSessions'], summary: 'Update session', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const s = await prisma.conversationSession.findUnique({ where: { id } })
      if (!s) throw new BadRequestError('ConversationSession not found')
      const data: any = {}
      if (payload.endedAt) data.endedAt = new Date(payload.endedAt)
      const updated = await prisma.conversationSession.update({ where: { id }, data })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
