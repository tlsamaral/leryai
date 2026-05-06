import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

const interactionModeSchema = z.enum(['FREE_TALK', 'GUIDED_LESSON', 'DIAGNOSIS'])

export async function iotCreateSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'Start a new conversation session from the device',
        security: [{ bearerAuth: [] }],
        body: z.object({
          mode: interactionModeSchema,
          lessonId: z.string().uuid().optional(),
        }),
        response: {
          201: z.object({ id: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { mode, lessonId } = request.body

      if (mode === 'GUIDED_LESSON') {
        if (!lessonId) throw new NotFoundError('lessonId is required for GUIDED_LESSON mode')
        const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
        if (!lesson) throw new NotFoundError('Lesson not found')
      }

      const session = await prisma.conversationSession.create({
        data: {
          userId,
          mode,
          ...(lessonId ? { lessonId } : {}),
        },
      })

      return reply.status(201).send({ id: session.id })
    },
  )
}
