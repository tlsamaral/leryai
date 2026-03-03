import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with password',
        security: [],
        body: z.object({
          username: z.string(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body

      const userFromUsername = await prisma.user.findUnique({
        where: {
          username,
        },
      })

      if (!userFromUsername) {
        throw new BadRequestError('Invalid credentials')
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userFromUsername.passwordHash,
      )

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromUsername.id,
          id: userFromUsername.id,
          name: userFromUsername.name,
          email: userFromUsername.email,
          role: userFromUsername.role,
          branchCode: userFromUsername.branchCode,
        },
        {
          sign: { expiresIn: '1h' },
        },
      )

      const refreshToken = await reply.jwtSign(
        { sub: userFromUsername.id },
        { sign: { expiresIn: '3d' } },
      )

      reply.setCookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        path: '/',
      })

      return reply.status(201).send({
        token,
      })
    },
  )
}
