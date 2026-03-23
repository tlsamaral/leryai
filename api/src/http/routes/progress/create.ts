import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function createProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['UserProgress'],
        summary: 'Create user progress',
        security: [{ bearerAuth: [] }],
        body: z.object({ lessonId: z.string().uuid() }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { lessonId } = request.body
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
      if (!lesson) throw new NotFoundError('Lesson not found')
      const exists = await prisma.userProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      })
      if (exists) throw new BadRequestError('Progress already exists')
      const p = await prisma.userProgress.create({ data: { userId, lessonId } })
      return reply.status(201).send({ id: p.id })
    },
  )
}
