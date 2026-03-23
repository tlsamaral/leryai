import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listModules(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        tags: ['Modules'],
        summary: 'List modules',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              order: z.number(),
              levelId: z.string(),
            }),
          ),
        },
      },
    },
    async (_request, reply) => {
      const modules = await prisma.module.findMany({
        orderBy: { order: 'asc' },
      })
      return reply.status(200).send(
        modules.map((m) => ({
          id: m.id,
          name: m.name,
          order: m.order,
          levelId: m.levelId,
        })),
      )
    },
  )
}
