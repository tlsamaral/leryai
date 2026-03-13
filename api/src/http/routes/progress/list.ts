import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const responseSchema = z.array(z.object({ id: z.string(), userId: z.string(), lessonId: z.string(), score: z.number(), status: z.string(), attempts: z.number(), lastAttempt: z.string() }))

export async function listProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    { schema: { tags: ['UserProgress'], summary: 'List user progress', response: { 200: responseSchema } } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const items = await prisma.userProgress.findMany({ orderBy: { lastAttempt: 'desc' } })
      return reply.status(200).send(items.map((i) => ({ id: i.id, userId: i.userId, lessonId: i.lessonId, score: i.score, status: i.status, attempts: i.attempts, lastAttempt: i.lastAttempt.toISOString() })))
    },
  )
}
