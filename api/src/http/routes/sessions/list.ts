import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const responseSchema = z.array(z.object({ id: z.string(), userId: z.string(), mode: z.string(), startedAt: z.string(), endedAt: z.string().nullable() }))

export async function listSessions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    { schema: { tags: ['ConversationSessions'], summary: 'List sessions', response: { 200: responseSchema } } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const items = await prisma.conversationSession.findMany({ orderBy: { startedAt: 'desc' } })
      return reply.status(200).send(items.map((s) => ({ id: s.id, userId: s.userId, mode: s.mode, startedAt: s.startedAt.toISOString(), endedAt: s.endedAt?.toISOString() ?? null })))
    },
  )
}
