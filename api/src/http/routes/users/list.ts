import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const responseSchema = z.array(
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    name: z.string(),
    createdAt: z.string(),
  }),
)

export async function listUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    { schema: { tags: ['Users'], summary: 'List users', response: { 200: responseSchema } } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
      return reply.status(200).send(
        users.map((u) => ({ id: u.id, email: u.email, username: u.username, name: u.name, createdAt: u.createdAt.toISOString() })),
      )
    },
  )
}
