import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ name: z.string().optional(), order: z.number().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['Modules'], summary: 'Update module', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const m = await prisma.module.findUnique({ where: { id } })
      if (!m) throw new BadRequestError('Module not found')
      const updated = await prisma.module.update({ where: { id }, data: payload })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
