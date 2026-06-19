import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function iotListSessionInsights(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/session-insights',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'List recent session insight cards for the device user',
        description:
          'Returns the most recent insight cards (3 bullets per session). Consumed by the Agent via the recall_last_session_summary tool to provide cross-session continuity.',
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          limit: z.coerce.number().int().min(1).max(20).default(3),
        }),
        response: {
          200: z.object({
            insights: z.array(
              z.object({
                id: z.string(),
                sessionId: z.string(),
                topError: z.string(),
                topProgress: z.string(),
                openTopic: z.string().nullable(),
                createdAt: z.string(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { limit } = request.query

      const insights = await prisma.sessionInsight.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      return reply.status(200).send({
        insights: insights.map((i) => ({
          id: i.id,
          sessionId: i.sessionId,
          topError: i.topError,
          topProgress: i.topProgress,
          openTopic: i.openTopic,
          createdAt: i.createdAt.toISOString(),
        })),
      })
    },
  )
}
