import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        tags: ['Modules'],
        summary: 'Get module',
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            order: z.number(),
            levelId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const m = await prisma.module.findUnique({ where: { id } })
      if (!m) throw new NotFoundError('Module not found')
      return reply
        .status(200)
        .send({ id: m.id, name: m.name, order: m.order, levelId: m.levelId })
    },
  )
}
