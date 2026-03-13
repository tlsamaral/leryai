import type { FastifyInstance } from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ description: z.string().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['Levels'], summary: 'Update level', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const level = await prisma.level.findUnique({ where: { id } })
      if (!level) throw new BadRequestError('Level not found')
      const updated = await prisma.level.update({ where: { id }, data: payload })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
