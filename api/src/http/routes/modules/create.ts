import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function createModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Modules'],
        summary: 'Create module',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string().min(1),
          order: z.number().int().min(1),
          levelId: z.string().uuid(),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { name, order, levelId } = request.body
      const level = await prisma.level.findUnique({ where: { id: levelId } })
      if (!level) throw new NotFoundError('Level not found')
      const m = await prisma.module.create({ data: { name, order, levelId } })
      return reply.status(201).send({ id: m.id })
    },
  )
}
