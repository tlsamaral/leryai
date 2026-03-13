import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({ id: z.string(), name: z.string(), order: z.number(), levelId: z.string() })

export async function getModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    { schema: { tags: ['Modules'], summary: 'Get module', params: paramsSchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const m = await prisma.module.findUnique({ where: { id } })
      if (!m) throw new BadRequestError('Module not found')
      return reply.status(200).send({ id: m.id, name: m.name, order: m.order, levelId: m.levelId })
    },
  )
}
