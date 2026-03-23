import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getLesson(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        tags: ['Lessons'],
        summary: 'Get lesson',
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            title: z.string(),
            scenario: z.string(),
            order: z.number(),
            moduleId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const l = await prisma.lesson.findUnique({ where: { id } })
      if (!l) throw new NotFoundError('Lesson not found')
      return reply.status(200).send({
        id: l.id,
        title: l.title,
        scenario: l.scenario,
        order: l.order,
        moduleId: l.moduleId,
      })
    },
  )
}
