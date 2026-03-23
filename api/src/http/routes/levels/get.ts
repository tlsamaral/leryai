import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        tags: ['Levels'],
        summary: 'Get level',
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            code: z.string(),
            description: z.string().nullable(),
            languageId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const level = await prisma.level.findUnique({ where: { id } })
      if (!level) throw new NotFoundError('Level not found')
      return reply.status(200).send({
        id: level.id,
        code: level.code,
        description: level.description,
        languageId: level.languageId,
      })
    },
  )
}
