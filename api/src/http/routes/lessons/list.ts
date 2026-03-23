import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listLessons(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        tags: ['Lessons'],
        summary: 'List lessons',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              scenario: z.string(),
              order: z.number(),
              moduleId: z.string(),
            }),
          ),
        },
      },
    },
    async (_request, reply) => {
      const lessons = await prisma.lesson.findMany({
        orderBy: { order: 'asc' },
      })
      return reply.status(200).send(
        lessons.map((l) => ({
          id: l.id,
          title: l.title,
          scenario: l.scenario,
          order: l.order,
          moduleId: l.moduleId,
        })),
      )
    },
  )
}
