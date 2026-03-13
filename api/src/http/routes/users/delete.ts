import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    { schema: { tags: ['Users'], summary: 'Delete user', params: paramsSchema, response: { 204: z.null() } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) throw new BadRequestError('User not found')
      await prisma.user.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
