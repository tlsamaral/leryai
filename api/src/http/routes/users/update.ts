import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Update user (own account only)',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          name: z.string().min(1).optional(),
          username: z.string().min(3).optional(),
          email: z.string().email().optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      if (id !== request.user.sub)
        throw new BadRequestError('Cannot update another user')
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) throw new NotFoundError('User not found')
      const updated = await prisma.user.update({
        where: { id },
        data: request.body,
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
