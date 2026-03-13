import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ name: z.string(), username: z.string(), email: z.string().email(), password: z.string().min(6) })
const responseSchema = z.object({ id: z.string() })

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['Users'], summary: 'Create user', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, username, email, password } = bodySchema.parse(request.body as unknown)
      const existingEmail = await prisma.user.findUnique({ where: { email } })
      if (existingEmail) throw new BadRequestError('Email already in use')
      const existingUsername = await prisma.user.findUnique({ where: { username } })
      if (existingUsername) throw new BadRequestError('Username already in use')
      const user = await prisma.user.create({ data: { name, username, email, passwordHash: password } })
      return reply.status(201).send({ id: user.id })
    },
  )
}
