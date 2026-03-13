import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({ id: z.string(), code: z.string(), description: z.string().nullable(), languageId: z.string() })

export async function getLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    { schema: { tags: ['Levels'], summary: 'Get level', params: paramsSchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const level = await prisma.level.findUnique({ where: { id } })
      if (!level) throw new BadRequestError('Level not found')
      return reply.status(200).send({ id: level.id, code: level.code, description: level.description, languageId: level.languageId })
    },
  )
}
