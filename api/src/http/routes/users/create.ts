import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { prisma } from '@/lib/prisma.js'

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Users'],
        summary: 'Create user (admin)',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string().min(1),
          username: z.string().min(3),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { name, username, email, password } = request.body
      const existingEmail = await prisma.user.findUnique({ where: { email } })
      if (existingEmail) throw new BadRequestError('Email already in use')
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      })
      if (existingUsername) throw new BadRequestError('Username already in use')
      const passwordHash = await hash(password, 6)
      const user = await prisma.user.create({
        data: { name, username, email, passwordHash },
      })
      return reply.status(201).send({ id: user.id })
    },
  )
}
