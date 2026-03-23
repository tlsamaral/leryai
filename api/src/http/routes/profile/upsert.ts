import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function upsertProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Profile'],
        summary: 'Create or update learner profile',
        security: [{ bearerAuth: [] }],
        body: z.object({
          nativeLanguage: z.string().min(2).optional(),
          interests: z.array(z.string()).optional(),
          hobbies: z.array(z.string()).optional(),
          occupation: z.string().optional(),
          ageGroup: z.string().optional(),
          learningGoal: z.string().optional(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            nativeLanguage: z.string(),
            interests: z.array(z.string()),
            hobbies: z.array(z.string()),
            occupation: z.string().nullable(),
            ageGroup: z.string().nullable(),
            learningGoal: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const data = request.body

      const profile = await prisma.userProfile.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
      })

      return reply.status(200).send({
        id: profile.id,
        nativeLanguage: profile.nativeLanguage,
        interests: profile.interests,
        hobbies: profile.hobbies,
        occupation: profile.occupation,
        ageGroup: profile.ageGroup,
        learningGoal: profile.learningGoal,
      })
    },
  )
}
