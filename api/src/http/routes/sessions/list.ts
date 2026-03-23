import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listSessions(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['ConversationSessions'],
        summary: 'List sessions for authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              userId: z.string(),
              mode: z.string(),
              startedAt: z.string(),
              endedAt: z.string().nullable(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const items = await prisma.conversationSession.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
      })
      return reply.status(200).send(
        items.map((s) => ({
          id: s.id,
          userId: s.userId,
          mode: s.mode,
          startedAt: s.startedAt.toISOString(),
          endedAt: s.endedAt?.toISOString() ?? null,
        })),
      )
    },
  )
}
