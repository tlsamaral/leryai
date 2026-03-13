import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({ id: z.string(), userId: z.string(), lessonId: z.string(), score: z.number(), status: z.string(), attempts: z.number(), lastAttempt: z.string() })

export async function getProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    { schema: { tags: ['UserProgress'], summary: 'Get user progress', params: paramsSchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const item = await prisma.userProgress.findUnique({ where: { id } })
      if (!item) throw new BadRequestError('UserProgress not found')
      return reply.status(200).send({ id: item.id, userId: item.userId, lessonId: item.lessonId, score: item.score, status: item.status, attempts: item.attempts, lastAttempt: item.lastAttempt.toISOString() })
    },
  )
}
