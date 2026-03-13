import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ sessionId: z.string(), userAudioTrans: z.string().optional(), leryResponse: z.string().optional(), grammaticalFixes: z.string().optional(), sentimentScore: z.number().optional() })
const responseSchema = z.object({ id: z.string() })

export async function createLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['InteractionLogs'], summary: 'Create log', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = bodySchema.parse(request.body as unknown)
      const s = await prisma.conversationSession.findUnique({ where: { id: payload.sessionId } })
      if (!s) throw new BadRequestError('Session not found')
      const item = await prisma.interactionLog.create({ data: { sessionId: payload.sessionId, userAudioTrans: payload.userAudioTrans, leryResponse: payload.leryResponse, grammaticalFixes: payload.grammaticalFixes, sentimentScore: payload.sentimentScore } })
      return reply.status(201).send({ id: item.id })
    },
  )
}
