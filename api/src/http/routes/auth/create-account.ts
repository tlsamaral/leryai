import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          username: z.string(),
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string(),
              username: z.string(),
              email: z.email(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, username, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('User with same email already exists.')
      }

      const userWithSameUsername = await prisma.user.findUnique({
        where: { username },
      })

      if (userWithSameUsername) {
        throw new BadRequestError('User with same username already exists.')
      }

      const passwordHash = await hash(password, 6)

      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          passwordHash,
        },
      })

      return reply.status(201).send({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      })
    },
  )
}
