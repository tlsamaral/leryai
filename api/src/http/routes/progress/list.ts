import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['UserProgress'],
        summary: 'List progress for authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              userId: z.string(),
              lessonId: z.string(),
              score: z.number(),
              status: z.string(),
              attempts: z.number(),
              lastAttempt: z.string(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const items = await prisma.userProgress.findMany({
        where: { userId },
        orderBy: { lastAttempt: 'desc' },
      })
      return reply.status(200).send(
        items.map((i) => ({
          id: i.id,
          userId: i.userId,
          lessonId: i.lessonId,
          score: i.score,
          status: i.status,
          attempts: i.attempts,
          lastAttempt: i.lastAttempt.toISOString(),
        })),
      )
    },
  )
}
