import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listLevels(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        tags: ['Levels'],
        summary: 'List levels',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              code: z.string(),
              description: z.string().nullable(),
              languageId: z.string(),
            }),
          ),
        },
      },
    },
    async (_request, reply) => {
      const levels = await prisma.level.findMany({ orderBy: { code: 'asc' } })
      return reply.status(200).send(
        levels.map((l) => ({
          id: l.id,
          code: l.code,
          description: l.description,
          languageId: l.languageId,
        })),
      )
    },
  )
}
