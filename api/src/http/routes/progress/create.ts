import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ userId: z.string(), lessonId: z.string() })
const responseSchema = z.object({ id: z.string() })

export async function createProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['UserProgress'], summary: 'Create user progress', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = bodySchema.parse(request.body as unknown)
      const exists = await prisma.userProgress.findUnique({ where: { userId_lessonId: { userId: payload.userId, lessonId: payload.lessonId } } })
      if (exists) throw new BadRequestError('Progress already exists')
      const p = await prisma.userProgress.create({ data: { userId: payload.userId, lessonId: payload.lessonId } })
      return reply.status(201).send({ id: p.id })
    },
  )
}
