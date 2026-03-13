import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ userId: z.string(), mode: z.string() })
const responseSchema = z.object({ id: z.string() })

export async function createSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['ConversationSessions'], summary: 'Create session', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = bodySchema.parse(request.body as unknown)
      const s = await prisma.conversationSession.create({ data: { userId: payload.userId, mode: payload.mode as any } })
      return reply.status(201).send({ id: s.id })
    },
  )
}
