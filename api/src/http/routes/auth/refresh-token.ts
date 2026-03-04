import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function refreshToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/token/refresh',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Refresh token',
        response: {
          200: z.object({
            token: z.string(),
            refreshToken: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        await request.jwtVerify({ onlyCookie: true })
      } catch (err) {
        throw new BadRequestError('Invalid refresh token')
      }

      const userId = request.user.sub

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        throw new BadRequestError('User not found')
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          sign: { expiresIn: '1h' },
        },
      )

      const refreshToken = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: '3d' } },
      )

      return reply
        .setCookie('refresh_token', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: false, // Set to true in production
          path: '/',
        })
        .status(200)
        .send({
          token,
          refreshToken,
        })
    },
  )
}
