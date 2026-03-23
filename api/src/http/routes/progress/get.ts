import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['UserProgress'],
        summary: 'Get user progress',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            userId: z.string(),
            lessonId: z.string(),
            score: z.number(),
            status: z.string(),
            attempts: z.number(),
            lastAttempt: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const item = await prisma.userProgress.findUnique({ where: { id } })
      if (!item) throw new NotFoundError('UserProgress not found')
      if (item.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      return reply.status(200).send({
        id: item.id,
        userId: item.userId,
        lessonId: item.lessonId,
        score: item.score,
        status: item.status,
        attempts: item.attempts,
        lastAttempt: item.lastAttempt.toISOString(),
      })
    },
  )
}
