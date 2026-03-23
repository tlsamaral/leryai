import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Profile'],
        summary: 'Get learner profile for authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            profile: z
              .object({
                id: z.string(),
                nativeLanguage: z.string(),
                interests: z.array(z.string()),
                hobbies: z.array(z.string()),
                occupation: z.string().nullable(),
                ageGroup: z.string().nullable(),
                learningGoal: z.string().nullable(),
              })
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      })
      return reply.status(200).send({
        profile: profile
          ? {
              id: profile.id,
              nativeLanguage: profile.nativeLanguage,
              interests: profile.interests,
              hobbies: profile.hobbies,
              occupation: profile.occupation,
              ageGroup: profile.ageGroup,
              learningGoal: profile.learningGoal,
            }
          : null,
      })
    },
  )
}
