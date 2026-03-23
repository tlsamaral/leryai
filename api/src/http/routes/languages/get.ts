import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getLanguage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        tags: ['Languages'],
        summary: 'Get language by id',
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            code: z.string(),
            name: z.string(),
            isActive: z.boolean(),
            createdAt: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const lang = await prisma.language.findUnique({ where: { id } })
      if (!lang) throw new NotFoundError('Language not found')
      return reply.status(200).send({
        id: lang.id,
        code: lang.code,
        name: lang.name,
        isActive: lang.isActive,
        createdAt: lang.createdAt.toISOString(),
      })
    },
  )
}
