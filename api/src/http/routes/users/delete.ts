import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Delete user (own account only)',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      if (id !== request.user.sub)
        throw new BadRequestError('Cannot delete another user')
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) throw new NotFoundError('User not found')
      await prisma.user.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
