import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listLanguages(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        tags: ['Languages'],
        summary: 'List languages',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              code: z.string(),
              name: z.string(),
              isActive: z.boolean(),
              createdAt: z.string(),
            }),
          ),
        },
      },
    },
    async (_request, reply) => {
      const langs = await prisma.language.findMany({ orderBy: { code: 'asc' } })
      return reply.status(200).send(
        langs.map((l) => ({
          id: l.id,
          code: l.code,
          name: l.name,
          isActive: l.isActive,
          createdAt: l.createdAt.toISOString(),
        })),
      )
    },
  )
}
