import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ name: z.string().optional(), username: z.string().optional(), email: z.string().email().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['Users'], summary: 'Update user', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) throw new BadRequestError('User not found')
      const updated = await prisma.user.update({ where: { id }, data: payload })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
