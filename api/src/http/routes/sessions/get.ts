import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({ id: z.string(), userId: z.string(), mode: z.string(), startedAt: z.string(), endedAt: z.string().nullable() })

export async function getSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    { schema: { tags: ['ConversationSessions'], summary: 'Get session', params: paramsSchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const s = await prisma.conversationSession.findUnique({ where: { id } })
      if (!s) throw new BadRequestError('ConversationSession not found')
      return reply.status(200).send({ id: s.id, userId: s.userId, mode: s.mode, startedAt: s.startedAt.toISOString(), endedAt: s.endedAt?.toISOString() ?? null })
    },
  )
}
