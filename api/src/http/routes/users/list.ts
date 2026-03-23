import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Users'],
        summary: 'List users',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              email: z.string(),
              username: z.string(),
              name: z.string(),
              createdAt: z.string(),
            }),
          ),
        },
      },
    },
    async (_request, reply) => {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return reply.status(200).send(
        users.map((u) => ({
          id: u.id,
          email: u.email,
          username: u.username,
          name: u.name,
          createdAt: u.createdAt.toISOString(),
        })),
      )
    },
  )
}
