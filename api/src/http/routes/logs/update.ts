import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function updateLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['InteractionLogs'],
        summary: 'Update interaction log',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          userAudioTrans: z.string().optional(),
          leryResponse: z.string().optional(),
          grammaticalFixes: z.string().optional(),
          sentimentScore: z.number().min(-1).max(1).optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const item = await prisma.interactionLog.findUnique({
        where: { id },
        include: { session: true },
      })
      if (!item) throw new NotFoundError('InteractionLog not found')
      if (item.session.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      const updated = await prisma.interactionLog.update({
        where: { id },
        data: request.body,
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
