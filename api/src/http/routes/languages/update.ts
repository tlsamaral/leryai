import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function updateLanguage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Languages'],
        summary: 'Update language',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          name: z.string().min(1).optional(),
          isActive: z.boolean().optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const lang = await prisma.language.findUnique({ where: { id } })
      if (!lang) throw new NotFoundError('Language not found')
      const updated = await prisma.language.update({
        where: { id },
        data: request.body,
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
