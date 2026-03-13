import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ userAudioTrans: z.string().optional(), leryResponse: z.string().optional(), grammaticalFixes: z.string().optional(), sentimentScore: z.number().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['InteractionLogs'], summary: 'Update log', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const item = await prisma.interactionLog.findUnique({ where: { id } })
      if (!item) throw new BadRequestError('InteractionLog not found')
      const updated = await prisma.interactionLog.update({ where: { id }, data: payload })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
