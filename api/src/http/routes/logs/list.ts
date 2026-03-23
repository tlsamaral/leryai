import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listLogs(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['InteractionLogs'],
        summary: 'List interaction logs for authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              sessionId: z.string(),
              userAudioTrans: z.string().nullable(),
              leryResponse: z.string().nullable(),
              grammaticalFixes: z.string().nullable(),
              sentimentScore: z.number().nullable(),
              createdAt: z.string(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const items = await prisma.interactionLog.findMany({
        where: { session: { userId } },
        orderBy: { createdAt: 'desc' },
      })
      return reply.status(200).send(
        items.map((i) => ({
          id: i.id,
          sessionId: i.sessionId,
          userAudioTrans: i.userAudioTrans,
          leryResponse: i.leryResponse,
          grammaticalFixes: i.grammaticalFixes,
          sentimentScore: i.sentimentScore,
          createdAt: i.createdAt.toISOString(),
        })),
      )
    },
  )
}
