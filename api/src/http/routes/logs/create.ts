import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { applyProgressRule } from '@/core/progress-rule.js'
import { prisma } from '@/lib/prisma.js'

export async function createLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['InteractionLogs'],
        summary: 'Create interaction log with 4-pillar evaluation scores',
        security: [{ bearerAuth: [] }],
        body: z.object({
          sessionId: z.string().uuid(),
          userAudioTrans: z.string().optional(),
          leryResponse: z.string().optional(),
          grammaticalFixes: z.string().optional(),
          sentimentScore: z.number().min(-1).max(1).optional(),
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
            progressStatus: z.enum(['LOCKED', 'IN_PROGRESS', 'REVIEW_REQUIRED', 'COMPLETED']).nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        sessionId,
        userAudioTrans,
        leryResponse,
        grammaticalFixes,
        sentimentScore,
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
      if (session.userId !== request.user.sub) throw new BadRequestError('Access denied')

      const item = await prisma.interactionLog.create({
        data: {
          sessionId,
          userAudioTrans,
          leryResponse,
          grammaticalFixes,
          sentimentScore,
          taskAchievement,
          grammar,
          vocabulary,
          fluency,
          totalScore,
          evaluationReasoning,
        },
      })

      let progressStatus = null

      if (session.mode === 'GUIDED_LESSON' && session.lessonId && totalScore !== undefined) {
        const result = await applyProgressRule(session.userId, session.lessonId, totalScore)
        progressStatus = result.status
      }

      return reply.status(201).send({ id: item.id, progressStatus })
    },
  )
}
