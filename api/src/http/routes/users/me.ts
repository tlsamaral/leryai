import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getMe(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Get currently authenticated user',
        description:
          'Returns the user behind the JWT in Authorization. Used by the mobile client to revalidate the session at boot and after refresh.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            id: z.string(),
            email: z.string(),
            username: z.string(),
            name: z.string(),
            avatarUrl: z.string().nullable(),
            currentLevel: z.string(),
            diagnosisCompleted: z.boolean(),
            createdAt: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw new NotFoundError('User not found')

      return reply.status(200).send({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
        currentLevel: user.currentLevel,
        diagnosisCompleted: user.diagnosisCompleted,
        createdAt: user.createdAt.toISOString(),
      })
    },
  )
}
