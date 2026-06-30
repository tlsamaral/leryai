import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { sessionStore } from '@/session-store/index.js'

export async function healthRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check',
        response: {
          200: z.object({
            status: z.literal('ok'),
            activeSessions: z.number(),
            uptimeSec: z.number(),
          }),
        },
      },
    },
    async (_req, reply) => {
      return reply.status(200).send({
        status: 'ok' as const,
        activeSessions: sessionStore.size(),
        uptimeSec: Math.round(process.uptime()),
      })
    },
  )
}
