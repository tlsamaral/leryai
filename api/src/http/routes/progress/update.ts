import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { applyProgressRule } from '@/core/progress-rule.js'
import { prisma } from '@/lib/prisma.js'

export async function updateProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['UserProgress'],
        summary: 'Update user progress — applies 70% rule and unlocks next lesson automatically',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          score: z.number().int().min(0).max(100),
        }),
        response: {
          200: z.object({
            id: z.string(),
            score: z.number(),
            status: z.enum(['LOCKED', 'IN_PROGRESS', 'REVIEW_REQUIRED', 'COMPLETED']),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { score } = request.body

      const p = await prisma.userProgress.findUnique({ where: { id } })
      if (!p) throw new NotFoundError('UserProgress not found')
      if (p.userId !== request.user.sub) throw new BadRequestError('Access denied')

      const { status } = await applyProgressRule(p.userId, p.lessonId, score)

      return reply.status(200).send({ id, score, status })
    },
  )
}
