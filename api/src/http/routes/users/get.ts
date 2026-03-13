import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({ id: z.string(), email: z.string(), username: z.string(), name: z.string(), createdAt: z.string() })

export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    { schema: { tags: ['Users'], summary: 'Get user', params: paramsSchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) throw new BadRequestError('User not found')
      return reply.status(200).send({ id: user.id, email: user.email, username: user.username, name: user.name, createdAt: user.createdAt.toISOString() })
    },
  )
}
