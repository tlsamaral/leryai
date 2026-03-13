import type { FastifyInstance } from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })

export async function deleteLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    { schema: { tags: ['Levels'], summary: 'Delete level', params: paramsSchema, response: { 204: z.null() } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const level = await prisma.level.findUnique({ where: { id } })
      if (!level) throw new BadRequestError('Level not found')
      await prisma.level.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
