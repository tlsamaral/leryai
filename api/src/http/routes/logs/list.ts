import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const responseSchema = z.array(z.object({ id: z.string(), sessionId: z.string(), userAudioTrans: z.string().nullable(), leryResponse: z.string().nullable(), grammaticalFixes: z.string().nullable(), sentimentScore: z.number().nullable(), createdAt: z.string() }))

export async function listLogs(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    { schema: { tags: ['InteractionLogs'], summary: 'List logs', response: { 200: responseSchema } } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const items = await prisma.interactionLog.findMany({ orderBy: { createdAt: 'desc' } })
      return reply.status(200).send(items.map((i) => ({ id: i.id, sessionId: i.sessionId, userAudioTrans: i.userAudioTrans, leryResponse: i.leryResponse, grammaticalFixes: i.grammaticalFixes, sentimentScore: i.sentimentScore, createdAt: i.createdAt.toISOString() })))
    },
  )
}
