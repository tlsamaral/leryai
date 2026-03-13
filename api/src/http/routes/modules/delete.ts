import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })

export async function deleteModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    { schema: { tags: ['Modules'], summary: 'Delete module', params: paramsSchema, response: { 204: z.null() } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const m = await prisma.module.findUnique({ where: { id } })
      if (!m) throw new BadRequestError('Module not found')
      await prisma.module.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
