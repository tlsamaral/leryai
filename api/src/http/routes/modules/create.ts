import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ name: z.string(), order: z.number(), levelId: z.string() })
const responseSchema = z.object({ id: z.string() })

export async function createModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['Modules'], summary: 'Create module', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = bodySchema.parse(request.body as unknown)
      const lv = await prisma.level.findUnique({ where: { id: payload.levelId } })
      if (!lv) throw new BadRequestError('Level not found')
      const m = await prisma.module.create({ data: { name: payload.name, order: payload.order, levelId: payload.levelId } })
      return reply.status(201).send({ id: m.id })
    },
  )
}
