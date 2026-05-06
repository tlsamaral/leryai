import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function iotSessionConfig(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/session/config',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'Get current lesson config and user context for the device session',
        description:
          'Called by the Raspberry Pi at boot. Returns the active lesson system prompt, user level, and profile data needed to initialize the Gemini conversation.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            deviceId: z.string(),
            userId: z.string(),
            level: z.string(),
            lesson: z
              .object({
                id: z.string(),
                title: z.string(),
                scenario: z.string(),
                systemPrompt: z.string(),
                objectives: z.string().nullable(),
                order: z.number(),
              })
              .nullable(),
            module: z
              .object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                order: z.number(),
              })
              .nullable(),
            profile: z
              .object({
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
      const deviceId = request.deviceId as string

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          currentLevel: true,
          targetLanguageId: true,
          profile: {
            select: {
              nativeLanguage: true,
              interests: true,
              hobbies: true,
              occupation: true,
              ageGroup: true,
              learningGoal: true,
            },
          },
        },
      })

      // Find current in-progress lesson first
      const inProgress = await prisma.userProgress.findFirst({
        where: { userId, status: 'IN_PROGRESS' },
        include: { lesson: { include: { module: true } } },
        orderBy: { lastAttempt: 'desc' },
      })

      if (inProgress) {
        return reply.status(200).send({
          deviceId,
          userId,
          level: user.currentLevel,
          lesson: {
            id: inProgress.lesson.id,
            title: inProgress.lesson.title,
            scenario: inProgress.lesson.scenario,
            systemPrompt: inProgress.lesson.systemPrompt,
            objectives: inProgress.lesson.objectives,
            order: inProgress.lesson.order,
          },
          module: {
            id: inProgress.lesson.module.id,
            name: inProgress.lesson.module.name,
            description: inProgress.lesson.module.description,
            order: inProgress.lesson.module.order,
          },
          profile: user.profile,
        })
      }

      // No in-progress — find next available lesson
      const nextLesson = await prisma.lesson.findFirst({
        where: {
          module: {
            level: {
              code: user.currentLevel,
              ...(user.targetLanguageId ? { languageId: user.targetLanguageId } : {}),
            },
          },
          userProgress: {
            none: { userId, status: 'COMPLETED' },
          },
        },
        include: { module: true },
        orderBy: [{ module: { order: 'asc' } }, { order: 'asc' }],
      })

      return reply.status(200).send({
        deviceId,
        userId,
        level: user.currentLevel,
        lesson: nextLesson
          ? {
              id: nextLesson.id,
              title: nextLesson.title,
              scenario: nextLesson.scenario,
              systemPrompt: nextLesson.systemPrompt,
              objectives: nextLesson.objectives,
              order: nextLesson.order,
            }
          : null,
        module: nextLesson
          ? {
              id: nextLesson.module.id,
              name: nextLesson.module.name,
              description: nextLesson.module.description,
              order: nextLesson.module.order,
            }
          : null,
        profile: user.profile,
      })
    },
  )
}
