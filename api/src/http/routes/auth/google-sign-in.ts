import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { OAuth2Client } from 'google-auth-library'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { prisma } from '@/lib/prisma.js'

const ALLOWED_AUDIENCES = [
  process.env.GOOGLE_WEB_CLIENT_ID,
  process.env.GOOGLE_IOS_CLIENT_ID,
  process.env.GOOGLE_ANDROID_CLIENT_ID,
].filter((id): id is string => Boolean(id))

const googleClient = new OAuth2Client()

function deriveUsernameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .toLowerCase()
}

async function ensureUniqueUsername(base: string): Promise<string> {
  let candidate = base
  let suffix = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
    })
    if (!existing) return candidate
    suffix += 1
    candidate = `${base}_${suffix}`
  }
}

export async function googleSignIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/google',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Sign in with Google',
        description:
          'Verifies the Google ID token, finds or creates the user (deduped by googleId, then email), and returns a JWT access + refresh token pair. The refresh token is also set as an httpOnly cookie for browser callers.',
        security: [],
        body: z.object({
          idToken: z.string().min(1),
        }),
        response: {
          200: z.object({
            token: z.string(),
            refreshToken: z.string(),
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              avatarUrl: z.string().nullable(),
              currentLevel: z.string(),
              diagnosisCompleted: z.boolean(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { idToken } = request.body

      if (ALLOWED_AUDIENCES.length === 0) {
        throw new BadRequestError('Google auth is not configured on the server')
      }

      let payload: ReturnType<
        Awaited<ReturnType<OAuth2Client['verifyIdToken']>>['getPayload']
      >
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: ALLOWED_AUDIENCES,
        })
        payload = ticket.getPayload()
      } catch {
        throw new BadRequestError('Invalid Google idToken')
      }

      if (!payload?.sub || !payload.email) {
        throw new BadRequestError('Google idToken missing required fields')
      }

      const googleId = payload.sub
      const email = payload.email
      const name = payload.name ?? email.split('@')[0]
      const avatarUrl = payload.picture ?? null

      // Find by googleId first; fall back to email (account linking).
      let user = await prisma.user.findUnique({ where: { googleId } })

      if (!user) {
        const existingByEmail = await prisma.user.findUnique({
          where: { email },
        })

        if (existingByEmail) {
          user = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: {
              googleId,
              avatarUrl: existingByEmail.avatarUrl ?? avatarUrl,
            },
          })
        } else {
          const username = await ensureUniqueUsername(
            deriveUsernameFromEmail(email),
          )
          user = await prisma.user.create({
            data: {
              email,
              username,
              name,
              googleId,
              avatarUrl,
            },
          })
        }
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
          id: user.id,
          name: user.name,
          email: user.email,
        },
        { sign: { expiresIn: '1h' } },
      )

      const refreshToken = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: '30d' } },
      )

      reply.setCookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false, // set true in production behind HTTPS
        path: '/',
      })

      return reply.status(200).send({
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          currentLevel: user.currentLevel,
          diagnosisCompleted: user.diagnosisCompleted,
        },
      })
    },
  )
}
