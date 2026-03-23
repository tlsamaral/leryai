import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function updateLesson(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Lessons'],
        summary: 'Update lesson',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          title: z.string().min(1).optional(),
          scenario: z.string().min(1).optional(),
          systemPrompt: z.string().min(1).optional(),
          order: z.number().int().min(1).optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const l = await prisma.lesson.findUnique({ where: { id } })
      if (!l) throw new NotFoundError('Lesson not found')
      const updated = await prisma.lesson.update({
        where: { id },
        data: request.body,
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
