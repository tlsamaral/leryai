import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

const cefrLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])

export async function iotDiagnoseSession(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/sessions/:id/diagnose',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'Finalize a DIAGNOSIS session and update user CEFR level',
        description:
          'Called by the device after rating the diagnosis conversation with Gemini. ' +
          'Updates user.currentLevel and sets diagnosisCompleted = true. ' +
          'Also sets session endedAt.',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          estimatedLevel: cefrLevelSchema,
        }),
        response: {
          200: z.object({
            id: z.string(),
            endedAt: z.string(),
            previousLevel: cefrLevelSchema,
            updatedLevel: cefrLevelSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { id } = request.params
      const { estimatedLevel } = request.body

      const session = await prisma.conversationSession.findUnique({
        where: { id },
      })

      if (!session) throw new NotFoundError('Session not found')
      if (session.userId !== userId) throw new BadRequestError('Access denied')
      if (session.mode !== 'DIAGNOSIS')
        throw new BadRequestError('Session is not a DIAGNOSIS session')
      if (session.endedAt)
        throw new BadRequestError('Session already completed')

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { currentLevel: true },
      })

      const endedAt = new Date()

      await prisma.$transaction([
        prisma.conversationSession.update({ where: { id }, data: { endedAt } }),
        prisma.user.update({
          where: { id: userId },
          data: { currentLevel: estimatedLevel, diagnosisCompleted: true },
        }),
      ])

      return reply.status(200).send({
        id,
        endedAt: endedAt.toISOString(),
        previousLevel: user.currentLevel,
        updatedLevel: estimatedLevel,
      })
    },
  )
}
