import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { applyProgressRule } from '@/core/progress-rule.js'
import { prisma } from '@/lib/prisma.js'

export async function iotCreateLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/logs',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'Post an interaction log with CEFR evaluation scores',
        description:
          'Called after each conversation turn. Saves the transcript, Lery response, and the 4-pillar CEFR scores returned by Gemini. Triggers progress rule if in GUIDED_LESSON mode.',
        security: [{ bearerAuth: [] }],
        body: z.object({
          sessionId: z.string().uuid(),
          userAudioTrans: z.string().optional(),
          leryResponse: z.string().optional(),
          grammaticalFixes: z.string().optional(),
          taskAchievement: z.number().int().min(0).max(25).optional(),
          grammar: z.number().int().min(0).max(25).optional(),
          vocabulary: z.number().int().min(0).max(25).optional(),
          fluency: z.number().int().min(0).max(25).optional(),
          totalScore: z.number().int().min(0).max(100).optional(),
          evaluationReasoning: z.string().optional(),
        }),
        response: {
          201: z.object({
            id: z.string(),
            progressStatus: z
              .enum(['LOCKED', 'IN_PROGRESS', 'REVIEW_REQUIRED', 'COMPLETED'])
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const {
        sessionId,
        userAudioTrans,
        leryResponse,
        grammaticalFixes,
        taskAchievement,
        grammar,
        vocabulary,
        fluency,
        totalScore,
        evaluationReasoning,
      } = request.body

      const session = await prisma.conversationSession.findUnique({
        where: { id: sessionId },
      })
      if (!session) throw new NotFoundError('Session not found')
      if (session.userId !== userId) throw new BadRequestError('Access denied')

      const log = await prisma.interactionLog.create({
        data: {
          sessionId,
          userAudioTrans,
          leryResponse,
          grammaticalFixes,
          taskAchievement,
          grammar,
          vocabulary,
          fluency,
          totalScore,
          evaluationReasoning,
        },
      })

      let progressStatus = null

      if (
        session.mode === 'GUIDED_LESSON' &&
        session.lessonId &&
        totalScore !== undefined
      ) {
        const result = await applyProgressRule(
          userId,
          session.lessonId,
          totalScore,
        )
        progressStatus = result.status
      }

      return reply.status(201).send({ id: log.id, progressStatus })
    },
  )
}
