import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function currentProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/current',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['UserProgress'],
        summary: 'Get current module and lesson for authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            level: z.string(),
            module: z
              .object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                order: z.number(),
              })
              .nullable(),
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
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { currentLevel: true, targetLanguageId: true },
      })

      // Find current in-progress lesson
      const inProgress = await prisma.userProgress.findFirst({
        where: { userId, status: 'IN_PROGRESS' },
        include: {
          lesson: {
            include: {
              module: true,
            },
          },
        },
        orderBy: { lastAttempt: 'desc' },
      })

      if (inProgress) {
        return reply.status(200).send({
          level: user.currentLevel,
          module: {
            id: inProgress.lesson.module.id,
            name: inProgress.lesson.module.name,
            description: inProgress.lesson.module.description,
            order: inProgress.lesson.module.order,
          },
          lesson: {
            id: inProgress.lesson.id,
            title: inProgress.lesson.title,
            scenario: inProgress.lesson.scenario,
            systemPrompt: inProgress.lesson.systemPrompt,
            objectives: inProgress.lesson.objectives,
            order: inProgress.lesson.order,
          },
        })
      }

      // No in-progress lesson — find first locked lesson in current level
      const nextLesson = await prisma.lesson.findFirst({
        where: {
          module: {
            level: {
              code: user.currentLevel,
              ...(user.targetLanguageId
                ? { languageId: user.targetLanguageId }
                : {}),
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
        level: user.currentLevel,
        module: nextLesson
          ? {
              id: nextLesson.module.id,
              name: nextLesson.module.name,
              description: nextLesson.module.description,
              order: nextLesson.module.order,
            }
          : null,
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
      })
    },
  )
}
