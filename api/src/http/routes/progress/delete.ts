import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function deleteProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['UserProgress'],
        summary: 'Delete user progress',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const p = await prisma.userProgress.findUnique({ where: { id } })
      if (!p) throw new NotFoundError('UserProgress not found')
      if (p.userId !== request.user.sub)
        throw new BadRequestError('Access denied')
      await prisma.userProgress.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
