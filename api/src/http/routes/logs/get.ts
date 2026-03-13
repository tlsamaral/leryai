import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({ id: z.string(), sessionId: z.string(), userAudioTrans: z.string().nullable(), leryResponse: z.string().nullable(), grammaticalFixes: z.string().nullable(), sentimentScore: z.number().nullable(), createdAt: z.string() })

export async function getLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    { schema: { tags: ['InteractionLogs'], summary: 'Get log', params: paramsSchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const item = await prisma.interactionLog.findUnique({ where: { id } })
      if (!item) throw new BadRequestError('InteractionLog not found')
      return reply.status(200).send({ id: item.id, sessionId: item.sessionId, userAudioTrans: item.userAudioTrans, leryResponse: item.leryResponse, grammaticalFixes: item.grammaticalFixes, sentimentScore: item.sentimentScore, createdAt: item.createdAt.toISOString() })
    },
  )
}
