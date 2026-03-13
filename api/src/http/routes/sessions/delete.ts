import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })

export async function deleteSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    { schema: { tags: ['ConversationSessions'], summary: 'Delete session', params: paramsSchema, response: { 204: z.null() } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const s = await prisma.conversationSession.findUnique({ where: { id } })
      if (!s) throw new BadRequestError('ConversationSession not found')
      await prisma.conversationSession.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
