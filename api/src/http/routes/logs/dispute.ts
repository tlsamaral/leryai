import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function disputeLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/:id/dispute',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['InteractionLogs'],
        summary: 'Dispute an interaction log evaluation (GradeHITL Phase 2)',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ reason: z.string().min(1) }),
        response: {
          200: z.object({
            id: z.string(),
            disputeStatus: z.literal('PENDING'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { reason } = request.body

      const log = await prisma.interactionLog.findUnique({
        where: { id },
        include: { session: true },
      })

      if (!log) throw new NotFoundError('InteractionLog not found')
      if (log.session.userId !== request.user.sub) throw new BadRequestError('Access denied')
      if (log.isDisputed) throw new BadRequestError('Already disputed')

      await prisma.interactionLog.update({
        where: { id },
        data: {
          isDisputed: true,
          disputeStatus: 'PENDING',
          // reason stored in grammaticalFixes prefix until a dedicated field is added
          grammaticalFixes: log.grammaticalFixes
            ? `[DISPUTE] ${reason}\n\n${log.grammaticalFixes}`
            : `[DISPUTE] ${reason}`,
        },
      })

      return reply.status(200).send({ id, disputeStatus: 'PENDING' })
    },
  )
}
