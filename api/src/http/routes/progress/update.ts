import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

const lessonStatusSchema = z.enum([
  'LOCKED',
  'IN_PROGRESS',
  'REVIEW_REQUIRED',
  'COMPLETED',
])

export async function updateProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['UserProgress'],
        summary: 'Update user progress',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          score: z.number().int().min(0).max(100).optional(),
          status: lessonStatusSchema.optional(),
          attempts: z.number().int().min(0).optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const p = await prisma.userProgress.findUnique({ where: { id } })
      if (!p) throw new NotFoundError('UserProgress not found')
      if (p.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      const updated = await prisma.userProgress.update({
        where: { id },
        data: request.body,
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
